from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.schemas.user_schemas import UserCreate

def create_user(db: Session, user: UserCreate):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email уже существует")

    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        password_hash=hashed_password,
        first_name=user.first_name,
        last_name=user.last_name,
        birth_date=user.birth_date,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def update_user_role(db: Session, user_id: int, new_role: UserRole):
    db_user = db.query(User).get(user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    db_user.role = new_role
    db.commit()
    db.refresh(db_user)
    return db_user