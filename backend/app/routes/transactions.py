from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Movimentacao, Usuario
from app.schemas import MovimentacaoCreate, MovimentacaoResponse
from app.security import get_usuario_logado

router = APIRouter(prefix="/movimentacoes", tags=["Movimentações"])


@router.post("/", response_model=MovimentacaoResponse)
def create_movimentacao(
    movimentacao: MovimentacaoCreate,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    if movimentacao.tipo not in ["receita", "despesa"]:
        raise HTTPException(
            status_code=400,
            detail="Tipo inválido. Use 'receita' ou 'despesa'."
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
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    return (
        db.query(Movimentacao)
        .filter(Movimentacao.usuario_id == usuario_logado.id)
        .order_by(Movimentacao.data_movimentacao.desc())
        .all()
    )

@router.delete("/{id}")
def delete_movimentacao(
    id: int,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    mov = db.query(Movimentacao).filter(
        Movimentacao.id == id,
        Movimentacao.usuario_id == usuario_logado.id
    ).first()

    if not mov:
        raise HTTPException(status_code=404, detail="Movimentação não encontrada")

    db.delete(mov)
    db.commit()

    return {"message": "Deletado com sucesso"}