from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import date

from app.database import get_db
from app.models import Movimentacao, Usuario, Categoria
from app.security import get_usuario_logado

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def get_summary(
    data_inicio: Optional[date] = Query(default=None),
    data_fim: Optional[date] = Query(default=None),
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    query = db.query(Movimentacao).filter(
        Movimentacao.usuario_id == usuario_logado.id
    )

    if data_inicio:
        query = query.filter(Movimentacao.data_movimentacao >= data_inicio)

    if data_fim:
        query = query.filter(Movimentacao.data_movimentacao <= data_fim)

    receitas = query.filter(Movimentacao.tipo == "receita").with_entities(
        func.sum(Movimentacao.valor)
    ).scalar() or 0

    despesas = query.filter(Movimentacao.tipo == "despesa").with_entities(
        func.sum(Movimentacao.valor)
    ).scalar() or 0

    total_movimentacoes = query.count()
    saldo = receitas - despesas

    return {
        "receitas": float(receitas),
        "despesas": float(despesas),
        "saldo": float(saldo),
        "total_movimentacoes": total_movimentacoes
    }


@router.get("/recent")
def get_recent_movimentacoes(
    limit: int = Query(default=6, ge=1, le=20),
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    movimentacoes = db.query(Movimentacao).filter(
        Movimentacao.usuario_id == usuario_logado.id
    ).order_by(
        Movimentacao.data_movimentacao.desc(),
        Movimentacao.id.desc()
    ).limit(limit).all()

    return [
        {
            "id": mov.id,
            "categoria_id": mov.categoria_id,
            "tipo": mov.tipo,
            "descricao": mov.descricao,
            "valor": float(mov.valor),
            "data_movimentacao": str(mov.data_movimentacao),
            "forma_pagamento": mov.forma_pagamento,
            "observacao": mov.observacao
        }
        for mov in movimentacoes
    ]


@router.get("/por-categoria")
def get_resumo_por_categoria(
    tipo: Optional[str] = Query(default=None),
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    query = db.query(
        Categoria.nome.label("categoria"),
        Movimentacao.tipo.label("tipo"),
        func.sum(Movimentacao.valor).label("total")
    ).join(
        Categoria,
        Categoria.id == Movimentacao.categoria_id
    ).filter(
        Movimentacao.usuario_id == usuario_logado.id
    )

    if tipo:
        query = query.filter(Movimentacao.tipo == tipo)

    resultados = query.group_by(
        Categoria.nome,
        Movimentacao.tipo
    ).order_by(
        func.sum(Movimentacao.valor).desc()
    ).all()

    return [
        {
            "categoria": item.categoria,
            "tipo": item.tipo,
            "total": float(item.total)
        }
        for item in resultados
    ]


@router.get("/mensal")
def get_resumo_mensal(
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    resultados = db.query(
        func.date_format(Movimentacao.data_movimentacao, "%Y-%m").label("mes"),
        Movimentacao.tipo.label("tipo"),
        func.sum(Movimentacao.valor).label("total")
    ).filter(
        Movimentacao.usuario_id == usuario_logado.id
    ).group_by(
        "mes",
        Movimentacao.tipo
    ).order_by("mes").all()

    resumo = {}

    for item in resultados:
        if item.mes not in resumo:
            resumo[item.mes] = {
                "mes": item.mes,
                "receitas": 0,
                "despesas": 0,
                "saldo": 0
            }

        if item.tipo == "receita":
            resumo[item.mes]["receitas"] = float(item.total)

        if item.tipo == "despesa":
            resumo[item.mes]["despesas"] = float(item.total)

        resumo[item.mes]["saldo"] = (
            resumo[item.mes]["receitas"] - resumo[item.mes]["despesas"]
        )

    return list(resumo.values())


@router.get("/overview")
def get_dashboard_overview(
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

    mensal = get_resumo_mensal(db=db, usuario_logado=usuario_logado)
    categorias = get_resumo_por_categoria(db=db, usuario_logado=usuario_logado)
    recentes = get_recent_movimentacoes(limit=6, db=db, usuario_logado=usuario_logado)

    return {
        "summary": {
            "receitas": float(receitas),
            "despesas": float(despesas),
            "saldo": float(saldo),
            "total_movimentacoes": db.query(Movimentacao).filter(
                Movimentacao.usuario_id == usuario_logado.id
            ).count()
        },
        "mensal": mensal,
        "categorias": categorias,
        "recentes": recentes
    }