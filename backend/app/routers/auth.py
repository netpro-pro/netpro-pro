from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models import Usuario
from app.schemas import LoginRequest, LoginResponse

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post(
    "/login",
    response_model=LoginResponse,
    status_code=status.HTTP_200_OK,
    summary="Pantalla 01 — Validar credenciales y devolver rol (RBAC)",
)
async def login(
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db),
) -> LoginResponse:
    stmt = select(Usuario).where(Usuario.nombre == payload.nombre)
    result = await db.execute(stmt)
    usuario = result.scalar_one_or_none()

    if usuario is None or usuario.contrasena != payload.contrasena:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos.",
        )

    return LoginResponse(
        id_usuario=usuario.id_usuario,
        nombre=usuario.nombre,
        id_rol=usuario.id_rol,
    )
