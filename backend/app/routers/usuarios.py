from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Rol, Usuario
from app.schemas import UsuarioCreate, UsuarioResponse, UsuarioUpdateRol

router = APIRouter(prefix="/usuarios", tags=["Usuarios"])

@router.get(
    "",
    response_model=list[UsuarioResponse],
    summary="Pantalla 07 — Listar todos los usuarios (RF-01)",
)
async def listar_usuarios(
    db: AsyncSession = Depends(get_db),
) -> list[UsuarioResponse]:
    stmt = (
        select(Usuario)
        .options(selectinload(Usuario.rol))
        .order_by(Usuario.id_usuario)
    )
    usuarios = (await db.execute(stmt)).scalars().all()

    return [
        UsuarioResponse(
            id_usuario=u.id_usuario,
            nombre=u.nombre,
            id_rol=u.id_rol,
            nombre_rol=u.rol.nombre_rol if u.rol else "Desconocido",
        )
        for u in usuarios
    ]

@router.post(
    "",
    response_model=UsuarioResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Pantalla 08 — Crear usuario (RF-01)",
)
async def crear_usuario(
    payload: UsuarioCreate,
    db: AsyncSession = Depends(get_db),
) -> UsuarioResponse:
    existe = (
        await db.execute(select(Usuario).where(Usuario.nombre == payload.nombre))
    ).scalar_one_or_none()
    if existe is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Ya existe un usuario con el nombre '{payload.nombre}'.",
        )

    rol = (
        await db.execute(select(Rol).where(Rol.id_rol == payload.id_rol))
    ).scalar_one_or_none()
    if rol is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rol {payload.id_rol} no encontrado.",
        )

    try:
        nuevo = Usuario(
            nombre=payload.nombre,
            contrasena=payload.contrasena,
            id_rol=payload.id_rol,
        )
        db.add(nuevo)
        await db.commit()
        await db.refresh(nuevo)
    except SQLAlchemyError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear usuario: {exc}",
        )

    return UsuarioResponse(
        id_usuario=nuevo.id_usuario,
        nombre=nuevo.nombre,
        id_rol=nuevo.id_rol,
        nombre_rol=rol.nombre_rol,
    )

@router.patch(
    "/{usuario_id}/rol",
    response_model=UsuarioResponse,
    summary="Pantalla 07 — Editar rol de usuario (RF-04)",
)
async def actualizar_rol(
    usuario_id: int,
    payload: UsuarioUpdateRol,
    db: AsyncSession = Depends(get_db),
) -> UsuarioResponse:
    usuario = await db.get(Usuario, usuario_id)
    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario {usuario_id} no encontrado.",
        )

    rol = (
        await db.execute(select(Rol).where(Rol.id_rol == payload.id_rol))
    ).scalar_one_or_none()
    if rol is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rol {payload.id_rol} no encontrado.",
        )

    try:
        usuario.id_rol = payload.id_rol
        await db.commit()
        await db.refresh(usuario)
    except SQLAlchemyError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar rol: {exc}",
        )

    return UsuarioResponse(
        id_usuario=usuario.id_usuario,
        nombre=usuario.nombre,
        id_rol=usuario.id_rol,
        nombre_rol=rol.nombre_rol,
    )

@router.delete(
    "/{usuario_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Pantalla 07/08 — Eliminar usuario (RF-03)",
)
async def eliminar_usuario(
    usuario_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    usuario = await db.get(Usuario, usuario_id)
    if usuario is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario {usuario_id} no encontrado.",
        )

    try:
        await db.delete(usuario)
        await db.commit()
    except SQLAlchemyError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"No se pudo eliminar el usuario: {exc}",
        )
    return None

@router.get(
    "/roles/lista",
    summary="Listar roles disponibles",
)
async def listar_roles(db: AsyncSession = Depends(get_db)):
    """Devuelve el catálogo de roles para poblar los dropdowns de la UI."""
    roles = (await db.execute(select(Rol).order_by(Rol.id_rol))).scalars().all()
    return [{"id_rol": r.id_rol, "nombre_rol": r.nombre_rol} for r in roles]
