from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, Field


class LoginRequest(BaseModel):
    """DTO de entrada para POST /auth/login."""
    nombre: str = Field(..., min_length=3, max_length=100, examples=["ing_miguel"])
    contrasena: str = Field(..., min_length=1, max_length=128)


class LoginResponse(BaseModel):
    """DTO de salida tras autenticación exitosa."""
    id_usuario: int
    nombre: str
    id_rol: int

    model_config = ConfigDict(from_attributes=True)


class UsuarioBase(BaseModel):
    nombre: str = Field(..., min_length=3, max_length=100, examples=["Ing_Miguel"])
    id_rol: int = Field(..., ge=1, examples=[1])


class UsuarioCreate(UsuarioBase):
    contrasena: str = Field(..., min_length=1, max_length=128)


class UsuarioUpdateRol(BaseModel):
    """DTO para cambiar el rol de un usuario existente."""
    id_rol: int = Field(..., ge=1, examples=[1])


class UsuarioResponse(UsuarioBase):
    id_usuario: int
    nombre_rol: str | None = None

    model_config = ConfigDict(from_attributes=True)

class ProyectoBase(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=150)


class ProyectoCreate(ProyectoBase):
    id_usuario: int = Field(..., ge=1)


class ProyectoRename(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=150)


class ProyectoResponse(ProyectoBase):
    id_proyecto: int
    id_usuario: int
    fecha_creacion: datetime

    model_config = ConfigDict(from_attributes=True)


class ProyectoDetalleResponse(ProyectoBase):
    id_proyecto: int
    id_usuario: int
    fecha_creacion: datetime
    data_json: dict[str, Any] | None = None
    numero_version: str | None = None

    model_config = ConfigDict(from_attributes=True)


class VersionBase(BaseModel):
    numero_version: str = Field(..., pattern=r"^v\d+\.\d+\.\d+$", examples=["v1.0.0"])
    data_json: dict[str, Any] = Field(...)


class VersionCreate(BaseModel):
    id_proyecto: int = Field(..., ge=1)
    data_json: dict[str, Any] = Field(...)
    numero_version: str | None = Field(None, pattern=r"^v\d+\.\d+\.\d+$")


class VersionResponse(VersionBase):
    id_version: int
    id_proyecto: int
    fecha_cambio: datetime

    model_config = ConfigDict(from_attributes=True)

class ActividadCreate(BaseModel):
    id_version: int = Field(..., ge=1)
    detalle_cambio: str = Field(
        ...,
        min_length=5,
        max_length=512,
        description=(
            "Formato: [Dispositivo] - [Tipo de Cambio] - [Anterior] - [Nuevo]"
        ),
        examples=["[Router_Principal] - [Adición de equipo] - [Ninguno] - [Router]"],
    )


class ActividadResponse(BaseModel):
    id_log: int
    id_version: int
    detalle_cambio: str
    fecha_hora: datetime

    model_config = ConfigDict(from_attributes=True)


class LogResponse(BaseModel):
    id_log: int
    id_version: int
    detalle_cambio: str
    fecha_hora: datetime

    model_config = ConfigDict(from_attributes=True)
