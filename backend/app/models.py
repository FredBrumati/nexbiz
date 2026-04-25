from sqlalchemy import Column, Integer, String, Date, Numeric
from app.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String(20), nullable=False)
    descricao = Column(String(255), nullable=False)
    categoria = Column(String(100), nullable=False)
    valor = Column(Numeric(10, 2), nullable=False)
    data = Column(Date, nullable=False)