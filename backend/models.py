from sqlalchemy import Column, Integer, String
from database import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String)
    skills = Column(String)
