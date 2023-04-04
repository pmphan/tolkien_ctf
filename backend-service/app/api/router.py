from logging import getLogger
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from .deps import RoleChecker, get_db, get_current_user
from app.endpoints import endpoints
from app.service.user_service import UserService
from app.schema import Token, UserCreate, UserLogin, UserDB, UserRole

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
