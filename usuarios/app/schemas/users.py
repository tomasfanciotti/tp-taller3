from sqlalchemy import Boolean, Column, String
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.db.database import Base


class Users(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    fullname = Column(String)
    email = Column(String, unique=True, index=True, nullable=False)
    city = Column(String)
    phoneNumber = Column(String, index=True)
    birthday = Column(String, nullable=False)
    register_date = Column(String, nullable=False)
    telegram_id = Column(String, default=None)
    password = Column(String, nullable=False)
    registration_number = Column(String, default=None)
