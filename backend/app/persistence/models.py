from sqlalchemy import Column, Integer, String, JSON, DateTime
from datetime import datetime
from .database import Base

class ProyectoRed(Base):
    __tablename__ = "proyectos_red"

    id = Column(Integer, primary_key=True, index=True)
    nombre_equipo = Column(String) # Para saber quién hizo el cambio
    red_base = Column(String)
    detalle_tecnico = Column(JSON) # Aquí guardamos el cálculo de Miki completo
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

class Usuario(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)  # Aquí se guardará "engineer" o "supervisor"