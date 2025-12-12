from uuid import uuid4
from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError
import jwt
from pydantic import BaseModel
from passlib.context import CryptContext
from chorus import models
from chorus.database import Database
from chorus.settings import Settings, SettingsDep
from chorus.auth.user import CurrentUser


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


router = APIRouter()


class User(BaseModel):
    username: str
    password: str


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def authenticate_user(username: str, password: str, db: Database):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def encode_access_token(data: dict, settings: Settings):
    return jwt.encode(data, settings.secret_key, algorithm=settings.algorithm)


def create_access_token(data: dict, settings: Settings):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(
        seconds=settings.expires_delta_seconds
    )
    to_encode.update({"exp": expire})
    return encode_access_token(to_encode, settings)


@router.post("/token")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Database,
    settings: SettingsDep,
    response: Response,
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token({"sub": user.username}, settings)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="none",
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register")
async def register(user: User, db: Database):
    if len(user.username) == 0 or len(user.password) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password cannot be empty",
        )

    try:
        password_hash = get_password_hash(user.password)
        user = models.User(username=user.username, hashed_password=password_hash)
        db.add(user)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username already exists",
        )

    return {"username": user.username}


@router.post("/register/anonymous")
async def register_anonymous_user(db: Database, settings: SettingsDep):
    anonymous_user = models.User(is_anonymous=True, session_id=uuid4())
    db.add(anonymous_user)
    db.commit()

    access_token = encode_access_token(
        {"sub": str(anonymous_user.id), "type": "anonymous"}, settings
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me")
async def read_users_me(current_user: CurrentUser):
    return {"username": current_user.username}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(key="access_token")
    return {"message": "Logged out"}
