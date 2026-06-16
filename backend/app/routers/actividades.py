from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Log, Version, Proyecto
from app.schemas import (
    ActividadCreate,
    ActividadResponse,
)

router = APIRouter(prefix="/actividades", tags=["Actividades"])


@router.get(
    "/{proyecto_id}",
    response_model=list[ActividadResponse],
    summary="Pantalla 09 — Actividades recientes del proyecto (RF-03, máx. 5)",
)
async def listar_actividades(
    proyecto_id: int,
    db: AsyncSession = Depends(get_db),
) -> list[ActividadResponse]:
    proyecto = await db.get(Proyecto, proyecto_id)
    if proyecto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Proyecto {proyecto_id} no encontrado.",
        )

    stmt = (
        select(Log)
        .join(Version, Log.id_version == Version.id_version)
        .where(Version.id_proyecto == proyecto_id)
        .order_by(desc(Log.fecha_hora))
        .limit(5)
    )
    logs = (await db.execute(stmt)).scalars().all()
    return [
        ActividadResponse(
            id_log=log.id_log,
            id_version=log.id_version,
            detalle_cambio=log.detalle_cambio,
            fecha_hora=log.fecha_hora,
        )
        for log in logs
    ]


@router.post(
    "",
    response_model=ActividadResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Pantalla 09 — Registrar actividad (RF-04) con formato estándar",
)
async def registrar_actividad(
    payload: ActividadCreate,
    db: AsyncSession = Depends(get_db),
) -> ActividadResponse:
    version = await db.get(Version, payload.id_version)
    if version is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Versión {payload.id_version} no encontrada.",
        )

    try:
        nuevo_log = Log(
            id_version=payload.id_version,
            detalle_cambio=payload.detalle_cambio,
            fecha_hora=datetime.now(timezone.utc),
        )
        db.add(nuevo_log)
        await db.commit()
        await db.refresh(nuevo_log)
    except SQLAlchemyError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al persistir el log de actividad: {exc}",
        )

    return ActividadResponse(
        id_log=nuevo_log.id_log,
        id_version=nuevo_log.id_version,
        detalle_cambio=nuevo_log.detalle_cambio,
        fecha_hora=nuevo_log.fecha_hora,
    )
