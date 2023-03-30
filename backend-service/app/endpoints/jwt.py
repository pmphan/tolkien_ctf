from datetime import datetime, timedelta
import jwt
from pydantic import BaseModel, validator

from logging import getLogger
logger = getLogger(f'uvicorn.{__name__}')


class JWTModel(BaseModel):
    private_key: bytes
    public_key: bytes
    access_token_expire_minutes: int

    @validator("private_key")
    def read_private_key(cls, v):
        with open(v, "rb") as private_file:
            key = private_file.read()
        return key

    @validator("public_key")
    def read_public_key(cls, v):
        with open(v, "rb") as public_file:
            key = public_file.read()
        return key

class JWTAuthen:
    config_key = "jwt"
    def __init__(self, config: dict = {}):
        if config:
            self.init_config(config)

    def init_config(self, config):
        jwt_config = config.get(self.config_key)
        if jwt_config:
            self.config = JWTModel(**jwt_config)
            self.public_key = self.config.public_key
            self.private_key = self.config.private_key
            self.access_token_lifetime = timedelta(minutes=self.config.access_token_expire_minutes)

    def generate_access_token(self, sub: str):
        return self.generate_token(
            expires_after=self.access_token_lifetime,
            sub=sub
        )

    def generate_token(self, expires_after: timedelta, sub: str):
        iat = datetime.utcnow()
        payload = {
            "exp": iat + expires_after,
            "iat": iat,
            "sub": str(sub),
            "role": "user"
        }
        logger.info(self.private_key)
        encode_jwt = jwt.encode(payload, self.private_key, algorithm="ES256")
        return encode_jwt

    def verify_token(self, token):
        logger.info(self.public_key)
        # Key confusion attack
        payload = jwt.decode(token, self.public_key, algorithms=["ES256", "HS256"])
        return payload
