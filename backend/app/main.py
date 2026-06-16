from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr

# IMPORTACIONES CORREGIDAS PARA TU ESTRUCTURA
from .persistence import models, database
from .persistence.auth_logic import verificar_password_hash, get_dashboard_redirect
from .core.network_logic import calcular_subred

# Sincroniza las tablas al iniciar
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="NetPro API")

# Sincroniza las tablas al iniciar
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="NetPro API")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# --- ENDPOINT DE AUTENTICACIÓN (Diagrama UML: Interfaz de Login) ---
@app.post("/auth/login")
def login(credentials: UserLogin, db: Session = Depends(database.get_db)):
    # 1. Backend consulta tabla DB_Usuarios en PostgreSQL
    user = db.query(models.Usuario).filter(models.Usuario.email == credentials.email).first()
    
    # 2. Rombo: ¿Usuario encontrado?
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Error de Autenticación"
        )
    
    # 3. Extraer Hash y Comparar contra Password (Bcrypt)
    password_correct = verificar_password_hash(credentials.password, user.hashed_password)
    
    # 4. Rombo: ¿Coincidencia de Hash?
    if not password_correct:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Error de Autenticación"
        )
    
    # 5. RESULTADO: Acceso Concedido & Aplicar RBAC (Control de Acceso)
    # Redirigir según rol (Ingeniero -> Pantalla 02 / Supervisor -> Pantalla 07)
    redirect_to = get_dashboard_redirect(user.role)
    
    return {
        "status": "Acceso Concedido",
        "access_token": "token_generado_aqui", 
        "role": user.role,
        "redirect_to": redirect_to
    }

# --- ENDPOINTS DE RED (Sin interrupciones) ---

@app.post("/guardar-calculo")
def guardar_red(nombre: str, ip: str, hosts: int, db: Session = Depends(database.get_db)):

    resultado = calcular_subred(ip, hosts)
    

    nuevo_proyecto = models.ProyectoRed(
        nombre_equipo=nombre,
        red_base=ip,
        detalle_tecnico=resultado
    )
    
    db.add(nuevo_proyecto)
    db.commit()
    db.refresh(nuevo_proyecto)
    
    return {"status": "Guardado en NetPro DB", "id": nuevo_proyecto.id, "datos": resultado}

@app.get("/proyectos")
def listar_proyectos(db: Session = Depends(database.get_db)):
    proyectos = db.query(models.ProyectoRed).all()
    return {
        "total": len(proyectos),
        "proyectos": proyectos
    }