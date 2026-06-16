from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Log, Proyecto, Usuario, Version
from app.schemas import (
    ProyectoCreate,
    ProyectoDetalleResponse,
    ProyectoRename,
    ProyectoResponse,
)

router = APIRouter(prefix="/proyectos", tags=["Proyectos"])

INITIAL_VERSION_NUMBER = "v1.0.0"
INITIAL_DATA_JSON: dict = {}

@router.get(
    "/{usuario_id}",
    response_model=list[ProyectoDetalleResponse],
    summary="Pantalla 02 — Listar proyectos del ingeniero (RF-02)",
)
async def listar_proyectos(
    usuario_id: int,
    db: AsyncSession = Depends(get_db),
) -> list[ProyectoDetalleResponse]:
    user_stmt = select(Usuario.id_usuario).where(Usuario.id_usuario == usuario_id)
    if (await db.execute(user_stmt)).scalar_one_or_none() is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario {usuario_id} no encontrado.",
        )

    proyectos_stmt = (
        select(Proyecto)
        .where(Proyecto.id_usuario == usuario_id)
        .order_by(desc(Proyecto.fecha_creacion))
    )
    proyectos = (await db.execute(proyectos_stmt)).scalars().all()

    response: list[ProyectoDetalleResponse] = []
    for p in proyectos:
        ver_stmt = (
            select(Version)
            .where(Version.id_proyecto == p.id_proyecto)
            .order_by(desc(Version.fecha_cambio))
            .limit(1)
        )
        ultima = (await db.execute(ver_stmt)).scalar_one_or_none()

        response.append(
            ProyectoDetalleResponse(
                id_proyecto=p.id_proyecto,
                nombre=p.nombre,
                fecha_creacion=p.fecha_creacion,
                id_usuario=p.id_usuario,
                data_json=ultima.data_json if ultima else None,
                numero_version=ultima.numero_version if ultima else None,
            )
        )
    return response


@router.post(
    "",
    response_model=ProyectoResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Pantalla 02 — Crear proyecto (RF-03) + VERSION inicial v1.0.0",
)
async def crear_proyecto(
    payload: ProyectoCreate,
    db: AsyncSession = Depends(get_db),
) -> Proyecto:
    user_stmt = select(Usuario.id_usuario).where(Usuario.id_usuario == payload.id_usuario)
    if (await db.execute(user_stmt)).scalar_one_or_none() is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Usuario {payload.id_usuario} no encontrado.",
        )

    try:
        nuevo = Proyecto(
            nombre=payload.nombre,
            fecha_creacion=datetime.now(timezone.utc),
            id_usuario=payload.id_usuario,
        )
        db.add(nuevo)
        await db.flush()

        version_inicial = Version(
            id_proyecto=nuevo.id_proyecto,
            numero_version=INITIAL_VERSION_NUMBER,
            data_json=INITIAL_DATA_JSON,
            fecha_cambio=datetime.now(timezone.utc),
        )
        db.add(version_inicial)

        await db.commit()
        await db.refresh(nuevo)

    except SQLAlchemyError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al persistir proyecto y versión inicial: {exc}",
        )

    return nuevo


@router.patch(
    "/{proyecto_id}/nombre",
    response_model=ProyectoResponse,
    summary="Pantalla 02 — Renombrar proyecto + log automático",
)
async def renombrar_proyecto(
    proyecto_id: int,
    payload: ProyectoRename,
    db: AsyncSession = Depends(get_db),
) -> Proyecto:
    proyecto = await db.get(Proyecto, proyecto_id)
    if proyecto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Proyecto {proyecto_id} no encontrado.",
        )

    nombre_anterior = proyecto.nombre
    nombre_nuevo = payload.nombre.strip()

    if nombre_nuevo == nombre_anterior:
        return proyecto

    ver_stmt = (
        select(Version)
        .where(Version.id_proyecto == proyecto_id)
        .order_by(desc(Version.fecha_cambio))
        .limit(1)
    )
    ultima_version = (await db.execute(ver_stmt)).scalar_one_or_none()

    try:
        proyecto.nombre = nombre_nuevo

        if ultima_version is not None:
            log = Log(
                id_version=ultima_version.id_version,
                detalle_cambio=(
                    f"[Sistema_NetPro] - [Cambio de nombre al proyecto] - "
                    f"[{nombre_anterior}] - [{nombre_nuevo}]"
                ),
                fecha_hora=datetime.now(timezone.utc),
            )
            db.add(log)

        await db.commit()
        await db.refresh(proyecto)

    except SQLAlchemyError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al renombrar el proyecto: {exc}",
        )

    return proyecto

@router.delete(
    "/{proyecto_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Pantalla 02 — Borrado físico del proyecto (RF-05)",
)
async def eliminar_proyecto(
    proyecto_id: int,
    db: AsyncSession = Depends(get_db),
) -> None:
    proyecto = await db.get(Proyecto, proyecto_id)
    if proyecto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Proyecto {proyecto_id} no encontrado.",
        )

    try:
        await db.delete(proyecto)
        await db.commit()
    except SQLAlchemyError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "No se pudo eliminar el proyecto. Verifica que las FK de "
                f"VERSION/REPORTE/LOG tengan ON DELETE CASCADE. Detalle: {exc}"
            ),
        )
    return None
