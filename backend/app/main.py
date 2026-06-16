from __future__ import annotations

import asyncio
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, text

from app.database import AsyncSessionLocal, engine, init_db
from app.models import Rol, Usuario
from app.routers import auth, proyectos, versiones, usuarios, actividades, logs

logger = logging.getLogger("netpro.startup")

async def wait_for_db(retries: int = 15, delay: float = 2.0) -> None:
    for attempt in range(1, retries + 1):
        try:
            async with engine.connect() as conn:
                await conn.execute(text("SELECT 1"))
            logger.info("✅ Postgres listo (intento %d/%d)", attempt, retries)
            return
        except Exception as exc:
            logger.warning(
                "⏳ Postgres no disponible aún (intento %d/%d): %s",
                attempt, retries, exc,
            )
            await asyncio.sleep(delay)
    raise RuntimeError(
        f"No se pudo conectar a Postgres después de {retries} intentos."
    )

async def seed_initial_data() -> None:
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Rol))
        if result.scalars().first() is not None:
            return  

        roles = [
            Rol(nombre_rol="Ingeniero"),
            Rol(nombre_rol="Supervisor"),
            Rol(nombre_rol="Superadmin"),
        ]
        db.add_all(roles)
        await db.flush()

        db.add_all([
            Usuario(nombre="admin",    contrasena="admin123", id_rol=roles[2].id_rol),
            Usuario(nombre="ing_demo", contrasena="demo1234", id_rol=roles[0].id_rol),
            Usuario(nombre="supervisor", contrasena="super123", id_rol=roles[1].id_rol),
        ])
        await db.commit()
        logger.info("✅ Seed aplicado: roles + usuarios de desarrollo creados.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    await wait_for_db()        # Espera activa hasta conexión real
    await init_db()            # CREATE TABLE IF NOT EXISTS
    await seed_initial_data()  # Datos iniciales
    yield

app = FastAPI(
    title="NetPro API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(proyectos.router)
app.include_router(versiones.router)
app.include_router(usuarios.router)
app.include_router(actividades.router)
app.include_router(logs.router)


@app.get("/health", tags=["Sistema"])
async def health_check():
    return {"status": "ok"}
