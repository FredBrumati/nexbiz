from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import Movimentacao, Usuario, Categoria
from app.security import get_usuario_logado

router = APIRouter(prefix="/insights", tags=["Insights"])


@router.get("/")
def gerar_insights(
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

    insights = []

    if receitas == 0 and despesas == 0:
        insights.append({
            "titulo": "Comece cadastrando movimentações",
            "descricao": "Ainda não existem dados suficientes para gerar uma análise financeira.",
            "nivel": "baixo"
        })

    if despesas > receitas and receitas > 0:
        insights.append({
            "titulo": "Atenção ao caixa",
            "descricao": "Suas despesas estão maiores que suas receitas. Revise os principais custos.",
            "nivel": "alto"
        })

    if saldo > 0:
        insights.append({
            "titulo": "Saldo positivo",
            "descricao": "Seu fluxo financeiro está positivo no período analisado.",
            "nivel": "baixo"
        })

    maior_categoria = db.query(
        Categoria.nome,
        func.sum(Movimentacao.valor).label("total")
    ).join(
        Categoria,
        Categoria.id == Movimentacao.categoria_id
    ).filter(
        Movimentacao.usuario_id == usuario_logado.id,
        Movimentacao.tipo == "despesa"
    ).group_by(
        Categoria.nome
    ).order_by(
        func.sum(Movimentacao.valor).desc()
    ).first()

    if maior_categoria:
        insights.append({
            "titulo": "Maior categoria de despesa",
            "descricao": f"Sua maior despesa está em {maior_categoria.nome}, totalizando R$ {float(maior_categoria.total):.2f}.",
            "nivel": "medio"
        })

    return {
        "receitas": float(receitas),
        "despesas": float(despesas),
        "saldo": float(saldo),
        "insights": insights
    }