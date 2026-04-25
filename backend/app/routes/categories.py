from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import Categoria, Usuario
from app.schemas import CategoriaCreate, CategoriaResponse
from app.security import get_usuario_logado

router = APIRouter(prefix="/categorias", tags=["Categorias"])


@router.post("/", response_model=CategoriaResponse)
def create_categoria(
    categoria: CategoriaCreate,
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    if categoria.tipo not in ["receita", "despesa"]:
        raise HTTPException(
            status_code=400,
            detail="Tipo inválido. Use 'receita' ou 'despesa'."
        )

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
    db: Session = Depends(get_db),
    usuario_logado: Usuario = Depends(get_usuario_logado)
):
    return (
        db.query(Categoria)
        .filter(Categoria.usuario_id == usuario_logado.id)
        .order_by(Categoria.nome.asc())
        .all()
    )