from __future__ import annotations

from datetime import datetime
from typing import Any

from sqlalchemy import DateTime, ForeignKey, String, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

class Rol(Base):
    __tablename__ = "rol"

    id_rol: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nombre_rol: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False
    )

    usuarios: Mapped[list["Usuario"]] = relationship(
        back_populates="rol",
        cascade="save-update",
    )

    def __repr__(self) -> str:
        return f"<Rol id={self.id_rol} nombre={self.nombre_rol!r}>"

class Usuario(Base):
    __tablename__ = "usuario"

    id_usuario: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False, index=True
    )
    contrasena: Mapped[str] = mapped_column(String(255), nullable=False)

    id_rol: Mapped[int] = mapped_column(
        ForeignKey("rol.id_rol", ondelete="RESTRICT"),
        nullable=False,
    )

    rol: Mapped["Rol"] = relationship(back_populates="usuarios")
    proyectos: Mapped[list["Proyecto"]] = relationship(
        back_populates="usuario",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Usuario id={self.id_usuario} nombre={self.nombre!r}>"

class Proyecto(Base):
    __tablename__ = "proyecto"

    id_proyecto: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(150), nullable=False)
    fecha_creacion: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    id_usuario: Mapped[int] = mapped_column(
        ForeignKey("usuario.id_usuario", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    usuario: Mapped["Usuario"] = relationship(back_populates="proyectos")
    versiones: Mapped[list["Version"]] = relationship(
        back_populates="proyecto",
        cascade="all, delete-orphan",
        order_by="Version.fecha_cambio.desc()",
    )
    reportes: Mapped[list["Reporte"]] = relationship(
        back_populates="proyecto",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Proyecto id={self.id_proyecto} nombre={self.nombre!r}>"


class Version(Base):
    __tablename__ = "version"

    id_version: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    id_proyecto: Mapped[int] = mapped_column(
        ForeignKey("proyecto.id_proyecto", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    numero_version: Mapped[str] = mapped_column(String(20), nullable=False)

    data_json: Mapped[dict[str, Any]] = mapped_column(JSONB, nullable=False)

    fecha_cambio: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    proyecto: Mapped["Proyecto"] = relationship(back_populates="versiones")
    logs: Mapped[list["Log"]] = relationship(
        back_populates="version",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return (
            f"<Version id={self.id_version} "
            f"proyecto={self.id_proyecto} num={self.numero_version!r}>"
        )


class Reporte(Base):
    __tablename__ = "reporte"

    id_reporte: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    id_proyecto: Mapped[int] = mapped_column(
        ForeignKey("proyecto.id_proyecto", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    resultado_simulacion: Mapped[dict[str, Any]] = mapped_column(
        JSONB, nullable=False
    )
    fecha_generacion: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    proyecto: Mapped["Proyecto"] = relationship(back_populates="reportes")

    def __repr__(self) -> str:
        return f"<Reporte id={self.id_reporte} proyecto={self.id_proyecto}>"

class Log(Base):
    __tablename__ = "log"

    id_log: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    id_version: Mapped[int] = mapped_column(
        ForeignKey("version.id_version", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    detalle_cambio: Mapped[str] = mapped_column(Text, nullable=False)
    fecha_hora: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    version: Mapped["Version"] = relationship(back_populates="logs")

    def __repr__(self) -> str:
        return f"<Log id={self.id_log} version={self.id_version}>"
