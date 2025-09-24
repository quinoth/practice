from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from shared.config.database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    file_name = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    mime_type = Column(String, nullable=False)
    size = Column(Integer)  # байты
    uploaded_at = Column(DateTime, default=datetime.utcnow())