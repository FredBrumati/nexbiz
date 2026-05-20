from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from decimal import Decimal
from typing import Optional, Literal


class UsuarioCreate(BaseModel):
    nome: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    senha: str = Field(..., min_length=6, max_length=72)


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


class CategoriaCreate(BaseModel):
    nome: str = Field(..., min_length=2, max_length=100)
    tipo: Literal["receita", "despesa"]


class CategoriaUpdate(BaseModel):
    nome: Optional[str] = Field(default=None, min_length=2, max_length=100)
    tipo: Optional[Literal["receita", "despesa"]] = None


class CategoriaResponse(BaseModel):
    id: int
    usuario_id: int
    nome: str
    tipo: str
    criado_em: Optional[datetime] = None

    class Config:
        from_attributes = True


class MovimentacaoCreate(BaseModel):
    categoria_id: int
    tipo: Literal["receita", "despesa"]
    descricao: str = Field(..., min_length=2, max_length=255)
    valor: Decimal = Field(..., gt=Decimal("0"), le=Decimal("10000000.00"))
    data_movimentacao: date
    forma_pagamento: Optional[str] = Field(default=None, max_length=50)
    observacao: Optional[str] = None


class MovimentacaoUpdate(BaseModel):
    categoria_id: Optional[int] = None
    tipo: Optional[Literal["receita", "despesa"]] = None
    descricao: Optional[str] = Field(default=None, min_length=2, max_length=255)
    valor: Optional[Decimal] = Field(
        default=None,
        gt=Decimal("0"),
        le=Decimal("10000000.00")
    )
    data_movimentacao: Optional[date] = None
    forma_pagamento: Optional[str] = Field(default=None, max_length=50)
    observacao: Optional[str] = None


class MovimentacaoResponse(BaseModel):
    id: int
    usuario_id: int
    categoria_id: int
    tipo: str
    descricao: str
    valor: Decimal
    data_movimentacao: date
    forma_pagamento: Optional[str] = None
    observacao: Optional[str] = None
    criado_em: Optional[datetime] = None

    class Config:
        from_attributes = True