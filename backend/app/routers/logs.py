from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import desc, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Log, Proyecto, Version
from app.schemas import LogResponse

router = APIRouter(prefix="/logs", tags=["Logs"])


@router.get(
    "/{proyecto_id}",
    response_model=list[LogResponse],
    summary="Pantalla 10 — Historial completo de logs del proyecto (RF-03)",
)
async def listar_logs_proyecto(
    proyecto_id: int,
    q: str | None = Query(
        default=None,
        max_length=200,
        description=(
            "Filtro libre opcional. Aplica ILIKE sobre detalle_cambio. "
            "Soporta categorías (Router/Switch/PC) y atributos (IP/VLAN/Velocidad) "
            "según el diagrama UML 'Filtrado' de Pantalla 10."
        ),
        examples=["Router", "VLAN", "192.168"],
    ),
    db: AsyncSession = Depends(get_db),
) -> list[LogResponse]:
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
    )

    if q:
        patron = f"%{q.strip()}%"
        stmt = stmt.where(Log.detalle_cambio.ilike(patron))

    stmt = stmt.order_by(desc(Log.fecha_hora))

    logs = (await db.execute(stmt)).scalars().all()

    return [
        LogResponse(
            id_log=log.id_log,
            id_version=log.id_version,
            detalle_cambio=log.detalle_cambio,
            fecha_hora=log.fecha_hora,
        )
        for log in logs
    ]
