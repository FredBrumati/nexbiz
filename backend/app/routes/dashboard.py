from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Transaction

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    receitas = db.query(func.sum(Transaction.valor)).filter(
        Transaction.tipo == "receita"
    ).scalar() or 0

    despesas = db.query(func.sum(Transaction.valor)).filter(
        Transaction.tipo == "despesa"
    ).scalar() or 0

    saldo = receitas - despesas

    return {
        "receitas": float(receitas),
        "despesas": float(despesas),
        "saldo": float(saldo)
    }