from __future__ import annotations

import re
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import desc, select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Log, Proyecto, Version
from app.schemas import VersionCreate, VersionResponse

router = APIRouter(prefix="/versiones", tags=["Versiones"])



def _incrementar_semver(numero: str) -> str:
    m = re.fullmatch(r"v(\d+)\.(\d+)\.(\d+)", numero)
    if not m:
        return "v1.0.1"
    major, minor, patch = int(m.group(1)), int(m.group(2)), int(m.group(3))
    return f"v{major}.{minor}.{patch + 1}"

@router.post(
    "",
    response_model=VersionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Pantalla 03 — Guardar nueva versión inmutable (RF-08)",
)
async def guardar_version(
    payload: VersionCreate,
    db: AsyncSession = Depends(get_db),
) -> Version:
    proyecto = await db.get(Proyecto, payload.id_proyecto)
    if proyecto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Proyecto {payload.id_proyecto} no encontrado.",
        )

    ultima_stmt = (
        select(Version)
        .where(Version.id_proyecto == payload.id_proyecto)
        .order_by(desc(Version.fecha_cambio))
        .limit(1)
    )
    ultima = (await db.execute(ultima_stmt)).scalar_one_or_none()
    siguiente_num = (
        _incrementar_semver(ultima.numero_version) if ultima else "v1.0.1"
    )

    try:
        nueva = Version(
            id_proyecto=payload.id_proyecto,
            numero_version=siguiente_num,
            data_json=payload.data_json,
            fecha_cambio=datetime.now(timezone.utc),
        )
        db.add(nueva)
        await db.flush() 

        log = Log(
            id_version=nueva.id_version,
            detalle_cambio=(
                f"[Proyecto {proyecto.nombre}] - [Guardado de versión] - "
                f"[{ultima.numero_version if ultima else 'N/A'}] - "
                f"[{siguiente_num}]"
            ),
            fecha_hora=datetime.now(timezone.utc),
        )
        db.add(log)
        await db.commit()
        await db.refresh(nueva)

    except SQLAlchemyError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al persistir versión: {exc}",
        )

    return nueva

@router.get(
    "/{proyecto_id}/ultima",
    response_model=VersionResponse,
    summary="Pantalla 03 — Obtener última versión del proyecto",
)
async def ultima_version(
    proyecto_id: int,
    db: AsyncSession = Depends(get_db),
) -> Version:
    proyecto = await db.get(Proyecto, proyecto_id)
    if proyecto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Proyecto {proyecto_id} no encontrado.",
        )

    stmt = (
        select(Version)
        .where(Version.id_proyecto == proyecto_id)
        .order_by(desc(Version.fecha_cambio))
        .limit(1)
    )
    version = (await db.execute(stmt)).scalar_one_or_none()
    if version is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El proyecto no tiene versiones.",
        )
    return version

@router.get(
    "/{proyecto_id}",
    response_model=list[VersionResponse],
    summary="Historial de versiones de un proyecto",
)
async def listar_versiones(
    proyecto_id: int,
    db: AsyncSession = Depends(get_db),
) -> list[Version]:
    stmt = (
        select(Version)
        .where(Version.id_proyecto == proyecto_id)
        .order_by(desc(Version.fecha_cambio))
    )
    versiones = (await db.execute(stmt)).scalars().all()
    return versiones
