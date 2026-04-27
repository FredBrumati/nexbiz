from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from decimal import Decimal
from typing import Optional


class UsuarioCreate(BaseModel):
    nome: str
    email: EmailStr
    senha: str


class UsuarioResponse(BaseModel):
    id: int
    nome: str
    email: EmailStr
    criado_em: Optional[datetime] = None

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: EmailStr
    senha: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    usuario: UsuarioResponse


class MovimentacaoCreate(BaseModel):
    categoria_id: int
    tipo: str
    descricao: str
    valor: Decimal
    data_movimentacao: date
    forma_pagamento: Optional[str] = None
    observacao: Optional[str] = None


class MovimentacaoResponse(MovimentacaoCreate):
    id: int
    usuario_id: int
    criado_em: Optional[datetime] = None

    class Config:
        from_attributes = True

class CategoriaCreate(BaseModel):
    nome: str
    tipo: str


class CategoriaResponse(CategoriaCreate):
    id: int
    usuario_id: int
    criado_em: Optional[datetime] = None

    class Config:
        from_attributes = True