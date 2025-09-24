from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import Optional
from sqlalchemy.orm import Session

# Локальные импорты
from app.schemas.user_schemas import UserCreate, UserInDB, Token
from app.models.user import User, UserRole
from app.core.security import (
    verify_password,
    create_access_token,
    get_current_user,
    authenticate_user
)
from app.services.user_service import create_user, update_user_role
from shared.utils.permissions import require_permission, Permission

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

@router.post("/register", response_model=UserInDB)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email уже занят")
    return create_user(db=db, user=user)


@router.post("/token", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный логин или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": user.email, "role": user.role.value})
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}


@router.get("/users/me", response_model=UserInDB)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("/users/{user_id}/role")
def change_user_role(
    user_id: int,
    new_role: UserRole,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_permission(Permission.EDIT_USER)),
):
    return update_user_role(db=db, user_id=user_id, new_role=new_role)