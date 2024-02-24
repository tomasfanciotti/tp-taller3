from typing import Annotated, Any, Dict, Union

from fastapi import APIRouter, Body, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.auth.auth_handler import create_access_token
from app.auth.auth_bearer import JWTBearer

from app.models.utils import ResponseModel, Token
from app.models.users import UserCreate, UserUpdate, UserResponse
from app.crud.users import users as users_crud
from app.db.database import getDB
from app.schemas.users import Users

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

router = APIRouter()


@router.post("/",  response_description="user data added to the database")
async def signup(user: UserCreate = Body(...), db: Session = Depends(getDB)):
    existing_user = users_crud.get_by_email(db, email=user.email)
    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="The user with this email already exists in the system.",
        )
    existing_user = users_crud.get_by_telegram_id(db, _telegram_id=str(user.telegram_id))
    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="The user with this telegram id already exists in the system.",
        )
    new_user = users_crud.create(db, obj_in=user)
    access_token = create_access_token(new_user.id, new_user.email, new_user.telegram_id)
    return Token(access_token=access_token, token_type="bearer")

@router.get("/{id}", dependencies=[Depends(JWTBearer())], response_description="user data retrieved by id")
async def get_user_data_by_id(id: str, db: Session = Depends(getDB)):
    user = users_crud.get_by_id(db, _id=id)
    if user:
        return ResponseModel(create_user_response(user), "user data retrieved successfully")
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="user doesn't exist.",
    )

@router.get("/search/by_email", response_description="user data retrieved by email")
async def get_user_data_by_id(email: str = '', db: Session = Depends(getDB)):
    user = users_crud.search_by_email(db, email=email)
    if user:
        return ResponseModel([create_user_response(x) for x in user], "user data retrieved successfully")
    return ResponseModel([], "user data retrieved successfully")

@router.get("/email/{email}", dependencies=[Depends(JWTBearer())], response_description="user data retrieved by email")
async def get_user_data_by_email(email, db: Session = Depends(getDB)):
    user = users_crud.get_by_email(db, email=email)
    if user:
        return ResponseModel(create_user_response(user), "user data retrieved successfully")
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="user doesn't exist.",
    )

@router.get("/telegram_id/{telegram_id}", response_description="user data retrieved by telegram id")
async def get_user_data_by_telegram_id(telegram_id, db: Session = Depends(getDB)):
    user = users_crud.get_by_telegram_id(db, _telegram_id=telegram_id)
    if user:
        return ResponseModel(create_user_response(user), "user data retrieved successfully")
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="user doesn't exist.",
    )


@router.put("/{email}")
async def update_user_data(email: str, dependencies=[Depends(JWTBearer())], user_in: Union[UserUpdate, Dict[str, Any]] = Body(...), db: Session = Depends(getDB)):
    print(f"user in: {user_in}")
    user = users_crud.get_by_email(db, email=email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The user does not exist",
        )
    user = users_crud.update(db, db_obj=user, obj_in=user_in)
    return create_user_response(user)


@router.delete("/{email}", dependencies=[Depends(JWTBearer())], response_description="user data deleted from the database")
async def delete_user_data(email: str, db: Session = Depends(getDB)):
    user = users_crud.get_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="The user does not exist")
    deleted_user = users_crud.remove(db=db, Id=id)
    return create_user_response(deleted_user)


@router.post("/login", response_description="login")
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
, db: Session = Depends(getDB)):
    user = authenticate(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(user.id, user.email, user.telegram_id)
    return Token(access_token=access_token, token_type="bearer")

def authenticate(db, email: str, password: str) -> Users:
    user = users_crud.get_by_email(db, email=email)
    if not user:
        return None
    if password != user.password:
        return None
    return user

def create_user_response(user: Users) -> UserResponse:
    print(user.id)
    return UserResponse(fullname=user.fullname,
                        email=user.email,
                        city=user.city,
                        id=str(user.id),
                        phoneNumber=user.phoneNumber,
                        birthday=user.birthday,
                        register_date=user.register_date,
                        telegram_id=user.telegram_id,
                        registration_number=user.registration_number
                        )
