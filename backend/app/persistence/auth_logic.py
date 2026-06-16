from passlib.context import CryptContext

# Configuración de Bcrypt para cumplir con el proceso "Bcrypt/Argon2" del diagrama
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verificar_password_hash(password_plana: str, hash_almacenado: str) -> bool:
    """
    Compara la contraseña recibida contra el Hash usando Bcrypt
    como indica el rombo '¿Coincidencia de Hash?' del diagrama.
    """
    return pwd_context.verify(password_plana, hash_almacenado)

def get_dashboard_redirect(role: str) -> str:
    """
    Configura el control de acceso por roles (RBAC) para redirigir automáticamente:
    - Ingenieros a la Pantalla 02 (Dashboard).
    - Supervisores a la Pantalla 07 (Monitor de Usuarios).
    """
    if role == "engineer":
        return "/dashboard/p2"  # Pantalla 02
    elif role == "supervisor":
        return "/monitor/p7"    # Pantalla 07
    return "/login"