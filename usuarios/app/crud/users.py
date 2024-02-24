from typing import Any, Dict, Optional, Union
from datetime import datetime

from pydantic import EmailStr
from sqlalchemy.orm import Session

from app.schemas.users import Users

from app.crud.base import CRUDBase

from app.models.users import (
    UserCreate,
    UserUpdate,
)


class CRUDUser(CRUDBase[Users, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: EmailStr) -> Optional[Users]:
        return db.query(Users).filter(Users.email == email).first()
    def search_by_email(self, db: Session, *, email: EmailStr) -> Optional[Users]:
        return db.query(Users).filter(Users.email.startswith(email)).all()

    def get_by_id(self, db: Session, *, _id: str) -> Optional[Users]:
        return db.query(Users).filter(Users.id == _id).first()

    def get_by_telegram_id(self, db: Session, *, _telegram_id: str) -> Optional[Users]:
        return db.query(Users).filter(Users.telegram_id == _telegram_id).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> Users:
        db_obj = Users(
            fullname=obj_in.fullname,
            email=obj_in.email,
            city=obj_in.city,
            phoneNumber=obj_in.phoneNumber,
            birthday=obj_in.birthday,
            register_date=datetime.now(),
            telegram_id=obj_in.telegram_id,
            password=obj_in.password,
            registration_number=obj_in.registration_number,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: Users, obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> Users:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def delete(
        self, db: Session, *, Id: int,
    ) -> Users:
        return super().remove(db, Id=Id)

users = CRUDUser(Users)
