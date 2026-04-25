from pydantic import BaseModel
from datetime import date
from decimal import Decimal

class TransactionCreate(BaseModel):
    tipo: str
    descricao: str
    categoria: str
    valor: Decimal
    data: date

class TransactionResponse(TransactionCreate):
    id: int

    class Config:
        from_attributes = True