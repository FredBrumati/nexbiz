from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Literal

from app.database import get_db
from app.models import Categoria, Usuario, Movimentacao
from app.schemas import CategoriaCreate, CategoriaUpdate, CategoriaResponse
from app.security import get_usuario_logado

router = APIRouter(prefix="/categorias", tags=["Categorias"])


@router.post("/", response_model=CategoriaResponse)
def create_categoria(
    categoria: CategoriaCreate,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    categoria_existente = db.query(Categoria).filter(
        Categoria.usuario_id == usuario_logado.id,
        Categoria.nome == categoria.nome,
        Categoria.tipo == categoria.tipo
    ).first()

    if categoria_existente:
        raise HTTPException(status_code=400, detail="Essa categoria já existe.")

    nova_categoria = Categoria(
        usuario_id=usuario_logado.id,
        nome=categoria.nome,
        tipo=categoria.tipo
    )

    db.add(nova_categoria)
    db.commit()
    db.refresh(nova_categoria)

    return nova_categoria


@router.get("/", response_model=List[CategoriaResponse])
def list_categorias(
    tipo: Optional[Literal["receita", "despesa"]] = Query(default=None),
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    query = db.query(Categoria).filter(Categoria.usuario_id == usuario_logado.id)

    if tipo:
        query = query.filter(Categoria.tipo == tipo)

    return query.order_by(Categoria.nome.asc()).all()


@router.put("/{id}", response_model=CategoriaResponse)
def update_categoria(
    id: int,
    dados: CategoriaUpdate,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    categoria = db.query(Categoria).filter(
        Categoria.id == id,
        Categoria.usuario_id == usuario_logado.id
    ).first()

    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada.")

    dados_atualizados = dados.model_dump(exclude_unset=True)

    for campo, valor in dados_atualizados.items():
        setattr(categoria, campo, valor)

    db.commit()
    db.refresh(categoria)

    return categoria


@router.delete("/{id}")
def delete_categoria(
    id: int,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    categoria = db.query(Categoria).filter(
        Categoria.id == id,
        Categoria.usuario_id == usuario_logado.id
    ).first()

    if not categoria:
        raise HTTPException(status_code=404, detail="Categoria não encontrada.")

    possui_movimentacoes = db.query(Movimentacao).filter(
        Movimentacao.categoria_id == id,
        Movimentacao.usuario_id == usuario_logado.id
    ).first()

    if possui_movimentacoes:
        raise HTTPException(
            status_code=400,
            detail="Não é possível excluir categoria com movimentações vinculadas."
        )

    db.delete(categoria)
    db.commit()

    return {"message": "Categoria deletada com sucesso."}