from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Literal
from datetime import date
from decimal import Decimal

from app.database import get_db
from app.models import Movimentacao, Usuario, Categoria
from app.schemas import MovimentacaoCreate, MovimentacaoUpdate, MovimentacaoResponse
from app.security import get_usuario_logado

router = APIRouter(prefix="/movimentacoes", tags=["Movimentações"])


def validar_categoria_usuario(db: Session, usuario_id: int, categoria_id: int, tipo: str):
    categoria = db.query(Categoria).filter(
        Categoria.id == categoria_id,
        Categoria.usuario_id == usuario_id
    ).first()

    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada.")

    if categoria.tipo != tipo:
        raise HTTPException(
            status_code=400,
            detail="O tipo da categoria não corresponde ao tipo da movimentação."
        )

    return categoria


@router.post("/", response_model=MovimentacaoResponse)
def create_movimentacao(
    movimentacao: MovimentacaoCreate,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    validar_categoria_usuario(
        db,
        usuario_logado.id,
        movimentacao.categoria_id,
        movimentacao.tipo
    )

    nova_movimentacao = Movimentacao(
        usuario_id=usuario_logado.id,
        categoria_id=movimentacao.categoria_id,
        tipo=movimentacao.tipo,
        descricao=movimentacao.descricao,
        valor=movimentacao.valor,
        data_movimentacao=movimentacao.data_movimentacao,
        forma_pagamento=movimentacao.forma_pagamento,
        observacao=movimentacao.observacao,
    )

    db.add(nova_movimentacao)
    db.commit()
    db.refresh(nova_movimentacao)

    return nova_movimentacao


@router.get("/", response_model=List[MovimentacaoResponse])
def list_movimentacoes(
    tipo: Optional[Literal["receita", "despesa"]] = Query(default=None),
    categoria_id: Optional[int] = Query(default=None),
    data_inicio: Optional[date] = Query(default=None),
    data_fim: Optional[date] = Query(default=None),
    valor_min: Optional[Decimal] = Query(default=None),
    valor_max: Optional[Decimal] = Query(default=None),
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    query = db.query(Movimentacao).filter(
        Movimentacao.usuario_id == usuario_logado.id
    )

    if tipo:
        query = query.filter(Movimentacao.tipo == tipo)

    if categoria_id:
        query = query.filter(Movimentacao.categoria_id == categoria_id)

    if data_inicio:
        query = query.filter(Movimentacao.data_movimentacao >= data_inicio)

    if data_fim:
        query = query.filter(Movimentacao.data_movimentacao <= data_fim)

    if valor_min:
        query = query.filter(Movimentacao.valor >= valor_min)

    if valor_max:
        query = query.filter(Movimentacao.valor <= valor_max)

    return query.order_by(Movimentacao.data_movimentacao.desc()).all()


@router.get("/{id}", response_model=MovimentacaoResponse)
def get_movimentacao(
    id: int,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    movimentacao = db.query(Movimentacao).filter(
        Movimentacao.id == id,
        Movimentacao.usuario_id == usuario_logado.id
    ).first()

    if not movimentacao:
        raise HTTPException(status_code=404, detail="Movimentação não encontrada.")

    return movimentacao


@router.put("/{id}", response_model=MovimentacaoResponse)
def update_movimentacao(
    id: int,
    dados: MovimentacaoUpdate,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    movimentacao = db.query(Movimentacao).filter(
        Movimentacao.id == id,
        Movimentacao.usuario_id == usuario_logado.id
    ).first()

    if not movimentacao:
        raise HTTPException(status_code=404, detail="Movimentação não encontrada.")

    dados_atualizados = dados.model_dump(exclude_unset=True)

    novo_tipo = dados_atualizados.get("tipo", movimentacao.tipo)
    nova_categoria_id = dados_atualizados.get("categoria_id", movimentacao.categoria_id)

    validar_categoria_usuario(
        db,
        usuario_logado.id,
        nova_categoria_id,
        novo_tipo
    )

    for campo, valor in dados_atualizados.items():
        setattr(movimentacao, campo, valor)

    db.commit()
    db.refresh(movimentacao)

    return movimentacao


@router.delete("/{id}")
def delete_movimentacao(
    id: int,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    movimentacao = db.query(Movimentacao).filter(
        Movimentacao.id == id,
        Movimentacao.usuario_id == usuario_logado.id
    ).first()

    if not movimentacao:
        raise HTTPException(status_code=404, detail="Movimentação não encontrada.")

    db.delete(movimentacao)
    db.commit()

    return {"message": "Movimentação deletada com sucesso."}