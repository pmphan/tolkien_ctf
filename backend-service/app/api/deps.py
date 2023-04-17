from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import PyJWTError
from logging import getLogger

from app.endpoints import endpoints
from app.service.user_service import UserService

logger = getLogger(f'uvicorn.{__name__}')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/login")

credentials_exception = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="You are not allowed to view this resource.",
)

async def get_db():
    async_session = endpoints.postgres.session()
    try:
        yield async_session
    finally:
        await async_session.close()

async def get_current_user(db = Depends(get_db), token: str = Depends(oauth2_scheme)):
    try:
        payload = endpoints.jwt.verify_token(token)
    except PyJWTError as e:
        logger.debug(f"[api] Get current user exception: {e}")
        raise credentials_exception
    if not payload:
        logger.debug(f"[api] Get current user empty payload.")
        raise credentials_exception

    username = payload.get("sub")
    user = await UserService.get_one(db, {"email": username})
    if user is None:
        raise credentials_exception
    return user

class RoleChecker:
    def __init__(self, allowed_roles: list):
        self.allowed_roles = allowed_roles

    def __call__(self, user = Depends(get_current_user)):
        if user.role not in self.allowed_roles:
            logger.debug(f"[api] User with role %s not in %s", user.role, self.allowed_roles)
            raise credentials_exception
