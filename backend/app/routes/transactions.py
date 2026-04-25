from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Transaction
from app.schemas import TransactionCreate, TransactionResponse

router = APIRouter(prefix="/transactions", tags=["Transactions"])

@router.post("/", response_model=TransactionResponse)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    if transaction.tipo not in ["receita", "despesa"]:
        raise HTTPException(
            status_code=400,
            detail="Tipo inválido. Use 'receita' ou 'despesa'."
        )

    new_transaction = Transaction(**transaction.model_dump())
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return new_transaction

@router.get("/", response_model=List[TransactionResponse])
def list_transactions(db: Session = Depends(get_db)):
    return db.query(Transaction).order_by(Transaction.data.desc()).all()