from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List

from app.database import get_db
from app.models import Usuario, Categoria, Movimentacao
from app.security import get_usuario_logado
from app.services.groq_ai import (
    classificar_movimentacao,
    gerar_comentarios_dashboard,
    conversar_chat_financeiro,
)

router = APIRouter(prefix="/ia", tags=["IA Groq"])


class ChatMensagem(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    mensagem: str = Field(..., min_length=1, max_length=1000)
    historico: Optional[List[ChatMensagem]] = []


def montar_contexto_financeiro(db: Session, usuario_id: int):
    receitas = db.query(func.sum(Movimentacao.valor)).filter(
        Movimentacao.usuario_id == usuario_id,
        Movimentacao.tipo == "receita"
    ).scalar() or 0

    despesas = db.query(func.sum(Movimentacao.valor)).filter(
        Movimentacao.usuario_id == usuario_id,
        Movimentacao.tipo == "despesa"
    ).scalar() or 0

    saldo = receitas - despesas

    total_movimentacoes = db.query(Movimentacao).filter(
        Movimentacao.usuario_id == usuario_id
    ).count()

    resumo = {
        "receitas": float(receitas),
        "despesas": float(despesas),
        "saldo": float(saldo),
        "total_movimentacoes": total_movimentacoes
    }

    mensal_query = db.query(
        func.date_format(Movimentacao.data_movimentacao, "%Y-%m").label("mes"),
        Movimentacao.tipo.label("tipo"),
        func.sum(Movimentacao.valor).label("total")
    ).filter(
        Movimentacao.usuario_id == usuario_id
    ).group_by(
        "mes",
        Movimentacao.tipo
    ).order_by("mes").all()

    mensal_dict = {}

    for item in mensal_query:
        if item.mes not in mensal_dict:
            mensal_dict[item.mes] = {
                "mes": item.mes,
                "receitas": 0,
                "despesas": 0,
                "saldo": 0
            }

        if item.tipo == "receita":
            mensal_dict[item.mes]["receitas"] = float(item.total)

        if item.tipo == "despesa":
            mensal_dict[item.mes]["despesas"] = float(item.total)

        mensal_dict[item.mes]["saldo"] = (
            mensal_dict[item.mes]["receitas"] -
            mensal_dict[item.mes]["despesas"]
        )

    mensal = list(mensal_dict.values())

    categorias_query = db.query(
        Categoria.nome.label("categoria"),
        Movimentacao.tipo.label("tipo"),
        func.sum(Movimentacao.valor).label("total")
    ).join(
        Categoria,
        Categoria.id == Movimentacao.categoria_id
    ).filter(
        Movimentacao.usuario_id == usuario_id
    ).group_by(
        Categoria.nome,
        Movimentacao.tipo
    ).order_by(
        func.sum(Movimentacao.valor).desc()
    ).all()

    categorias = [
        {
            "categoria": item.categoria,
            "tipo": item.tipo,
            "total": float(item.total)
        }
        for item in categorias_query
    ]

    recentes_query = db.query(Movimentacao).filter(
        Movimentacao.usuario_id == usuario_id
    ).order_by(
        Movimentacao.data_movimentacao.desc(),
        Movimentacao.id.desc()
    ).limit(20).all()

    recentes = [
        {
            "id": mov.id,
            "tipo": mov.tipo,
            "descricao": mov.descricao,
            "valor": float(mov.valor),
            "data_movimentacao": str(mov.data_movimentacao),
            "forma_pagamento": mov.forma_pagamento,
            "observacao": mov.observacao
        }
        for mov in recentes_query
    ]

    return resumo, mensal, categorias, recentes


@router.get("/classificar")
def classificar_descricao(
    descricao: str,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado),
):
    categorias = db.query(Categoria).filter(
        Categoria.usuario_id == usuario_logado.id
    ).all()

    categorias_payload = [
        {
            "id": categoria.id,
            "nome": categoria.nome,
            "tipo": categoria.tipo,
        }
        for categoria in categorias
    ]

    resultado = classificar_movimentacao(
        descricao=descricao,
        categorias=categorias_payload,
    )

    categoria_encontrada = None

    if resultado.get("categoria_nome"):
        categoria_encontrada = db.query(Categoria).filter(
            Categoria.usuario_id == usuario_logado.id,
            Categoria.nome == resultado.get("categoria_nome"),
        ).first()

    return {
        "descricao": descricao,
        "resultado": resultado,
        "categoria_id": categoria_encontrada.id if categoria_encontrada else None,
    }


@router.get("/dashboard-comentarios")
def dashboard_comentarios_ia(
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado),
):
    resumo, mensal, categorias, recentes = montar_contexto_financeiro(
        db=db,
        usuario_id=usuario_logado.id
    )

    analise = gerar_comentarios_dashboard(
        resumo=resumo,
        mensal=mensal,
        categorias=categorias,
        recentes=recentes
    )

    return {
        "resumo": resumo,
        "analise": analise
    }


@router.post("/chat")
def chat_com_groq(
    dados: ChatRequest,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado),
):
    resumo, mensal, categorias, recentes = montar_contexto_financeiro(
        db=db,
        usuario_id=usuario_logado.id
    )

    historico = [
        {
            "role": item.role,
            "content": item.content
        }
        for item in dados.historico or []
    ]

    resposta = conversar_chat_financeiro(
        mensagem=dados.mensagem,
        resumo=resumo,
        mensal=mensal,
        categorias=categorias,
        recentes=recentes,
        historico=historico
    )

    return {
        "resposta": resposta,
        "resumo": resumo
    }