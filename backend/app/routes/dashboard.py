from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Movimentacao, Usuario
from app.security import get_usuario_logado

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    receitas = db.query(func.sum(Movimentacao.valor)).filter(
        Movimentacao.usuario_id == usuario_logado.id,
        Movimentacao.tipo == "receita"
    ).scalar() or 0

    despesas = db.query(func.sum(Movimentacao.valor)).filter(
        Movimentacao.usuario_id == usuario_logado.id,
        Movimentacao.tipo == "despesa"
    ).scalar() or 0

    saldo = receitas - despesas

    return {
        "receitas": float(receitas),
        "despesas": float(despesas),
        "saldo": float(saldo)
    }