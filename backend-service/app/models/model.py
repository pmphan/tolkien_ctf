from app.schema import UserRole

from sqlalchemy import Column, Enum, Identity, String, BigInteger, DateTime
from sqlalchemy.orm import registry, declared_attr, DeclarativeBase
from sqlalchemy.sql.functions import current_timestamp

class_registry = registry()

class Base(DeclarativeBase):
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

    id = Column(BigInteger(), Identity(always=True), primary_key=True)
    create_time = Column(DateTime(timezone=True), server_default=current_timestamp())
    update_time = Column(DateTime(timezone=True), server_default=current_timestamp(), onupdate=current_timestamp())


class Users(Base):
    first_name = Column(String(256), nullable=False)
    last_name = Column(String(256), nullable=False)
    email = Column(String(256), index=True, nullable=False, unique=True)
    hashed_password = Column(String(256), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.user)
    flag = Column(String(256), nullable=True)
