import re
from logging import getLogger
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from jinja2 import Template

from .deps import RoleChecker, get_db, get_current_user
from app.endpoints import endpoints
from app.service.user_service import UserService
from app.schema import Guess, Token, UserCreate, UserLogin, UserDB, UserRole

logger = getLogger(f'uvicorn.{__name__}')
router = APIRouter()
check_role = RoleChecker([UserRole.admin])

@router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=Token)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    try:
        logger.debug("[api] Attempting to create user with email %s.", user.email)
        await UserService.create_user(db, user)
    except IntegrityError:
        logger.debug("[api] Create user %s failed.", user.email)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already existed."
        )
    logger.debug("[api] Create user %s successful.", user.email)
    return {
        "access_token": endpoints.jwt.generate_access_token(sub=user.email),
        "token_type": "bearer"
    }

@router.post("/login", status_code=status.HTTP_200_OK, response_model=Token)
async def login_user(form: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    usr = UserLogin(email=form.username, password=form.password)
    logger.debug("[api] Attempting to login with %s.", usr.email)
    user = await UserService.authenticate(db, usr)
    if not user:
        logger.debug("[api] Authentication for %s failed.", usr.email)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    logger.debug("[api] Authentication for %s succeeded.", usr.email)
    return {
        "access_token": endpoints.jwt.generate_access_token(sub=user.email, role=user.role),
        "token_type": "bearer"
    }

@router.get("/users", status_code=status.HTTP_200_OK, dependencies=[Depends(check_role)], response_model=list[UserDB])
async def view_user_list(db: AsyncSession = Depends(get_db)):
    users = await UserService.get_list(db, {})
    logger.debug("[api] Get %s users.", len(users))
    return jsonable_encoder(users)

@router.get("/profile", status_code=status.HTTP_200_OK, response_model=UserDB)
async def current_user(current_user: UserDB = Depends(get_current_user)):
    return jsonable_encoder(current_user)

@router.post("/riddle", status_code=status.HTTP_200_OK, dependencies=[Depends(check_role)], response_model=str)
async def check_answer(guess: Guess):
    regex = "[0-9\"\']|request|self|class|config|flag"
    if "{{" in guess.answer and re.search(regex, guess.answer):
        return "Nice try, you are on the right track, but we filter out any input matching regex %s." % regex

    template_str = """Picking up his staff Mithrandir stood before the rock and said in a clear voice: """ + guess.answer + """.
{% if answer.lower() != true_answer %}
Many times he repeated these words in different order, or varied them. Then he tried other spells, one after another, speaking now faster and louder, now soft and slow. Then he spoke many single words of Elvish speech. Nothing happened.
{% else %}
Slowly the door divided in the middle and swung outwards inch by inch, until both doors lay back against the wall. Through the opening a shadowy stair could be seen climbing steeply up; but beyond the lower steps the darkness was deeper than the night.
{% endif %}"""
    template = Template(template_str, autoescape=False)
    try:
        return template.render(answer=guess.answer, true_answer="mellon")
    except Exception as e:
        return f"{e.__class__.__qualname__}: {e}"
