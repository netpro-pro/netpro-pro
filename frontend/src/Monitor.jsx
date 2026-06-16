import { useState, useEffect, useMemo } from 'react'
import { useNetProStore } from '../store/useNetProStore'
import { VIEWS, ROLES } from '../store/constants'
import { proyectosApi } from '../api/netproApi'

export default function Monitor() {
  const userName               = useNetProStore(s => s.userName)
  const userRole                    = useNetProStore(s => s.userRole)
  const users                       = useNetProStore(s => s.users)
  const roles                  = useNetProStore(s => s.roles)
  const isLoading               = useNetProStore(s => s.isLoading)
  const error                  = useNetProStore(s => s.error)
  const loadUsers         = useNetProStore(s => s.loadUsers)
  const updateUserRole          = useNetProStore(s => s.updateUserRole)
  const deleteUser        = useNetProStore(s => s.deleteUser)
  const navigateTo                    = useNetProStore(s => s.navigateTo)
  const logout           = useNetProStore(s => s.logout)
  const openUserProjects = useNetProStore(s => s.openUserProjects)

  const [busqueda,        setBusqueda]        = useState('')
  const [filtroRol,       setFiltroRol]       = useState('Todos')
  const [editandoId,      setEditandoId]      = useState(null)
  const [rolEditando,     setRolEditando]     = useState(null)
  const [confirmarElim,   setConfirmarElim]   = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const usuariosFiltrados = useMemo(() => {
    return users.filter(u => {
      const matchBusqueda = u.nombre.toLowerCase().includes(busqueda.toLowerCase())
      const matchRol = filtroRol === 'Todos' || u.nombre_rol === filtroRol
      return matchBusqueda && matchRol
    })
  }, [users, busqueda, filtroRol])

  function iniciarEdicion(u) {
    setEditandoId(u.id_usuario)
    setRolEditando(u.id_rol)
  }

  function cancelarEdicion() {
    setEditandoId(null)
    setRolEditando(null)
  }

  async function aplicarCambioRol(usuarioId) {
    try {
      await updateUserRole(usuarioId, rolEditando)
      cancelarEdicion()
    } catch {}
  }

  async function confirmarEliminar() {
    if (!confirmarElim) return
    try {
      await deleteUser(confirmarElim.id_usuario)
    } finally {
      setConfirmarElim(null)
    }
  }

  // Iniciales para avatar
  function iniciales(nombre) {
    return nombre.split(/[\s_]/).map(p => p[0]?.toUpperCase()).slice(0, 2).join('')
  }

  const avatarColors = [
    '#00607F', '#1557A8', '#8D5D04', '#3fb950', '#6f42c1', '#d63384',
  ]
  function avatarColor(id) {
    return avatarColors[id % avatarColors.length]
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--np-bg)' }}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <header style={{
        background: 'var(--np-surface)',
        borderBottom: '1px solid var(--np-border-strong)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="var(--np-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
          </svg>
          <span style={{ color: 'var(--np-text)', fontWeight: '700', fontSize: '0.9rem', letterSpacing: '0.04em' }}>
            NETPRO
          </span>
            <span style={{ color: 'var(--np-text-muted)', fontSize: '0.82rem' }}>
              | Monitor de Usuarios | Admin. {userName}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Solo superadmin puede acceder a Configuración */}
            {userRole === ROLES.SUPERADMIN && (
              <HeaderBtn
                color="var(--np-accent)"
                hoverColor="var(--np-accent-hover)"
                onClick={() => navigateTo(VIEWS.CONFIGURATION)}
              >
                Configuracion
              </HeaderBtn>
            )}
            <HeaderBtn
              color="var(--np-danger)"
              hoverColor="var(--np-danger-hover)"
              onClick={logout}
            >
              Cerrar Sesion
            </HeaderBtn>
          </div>
      </header>

      {/* ── CONTENIDO PRINCIPAL ─────────────────────────────────── */}
      <main style={{ padding: '24px 20px', maxWidth: '860px', margin: '0 auto' }}>

        {error && (
          <div style={{
            marginBottom: '16px', padding: '10px 14px',
            background: 'rgba(212,15,15,0.15)',
            border: '1px solid var(--np-danger)',
            borderRadius: '6px', color: 'var(--np-danger)', fontSize: '0.82rem',
          }}>
            {error}
          </div>
        )}

        {/* ── BARRA BÚSQUEDA Y FILTRO ── */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <input
            placeholder="Buscar por tipo o por nombre..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            style={inputStyle}
          />
          <select
            value={filtroRol}
            onChange={e => setFiltroRol(e.target.value)}
            style={{ ...inputStyle, width: 'auto', minWidth: '130px', cursor: 'pointer' }}
          >
            <option value="Todos">Todos</option>
            {roles.map(r => (
              <option key={r.id_rol} value={r.nombre_rol}>{r.nombre_rol}</option>
            ))}
          </select>
        </div>

        {/* ── TABLA ── */}
        <div style={{
          background: 'var(--np-surface)',
          border: '1px solid var(--np-border-strong)',
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          {/* Encabezado de tabla */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '56px 1fr 160px 200px 180px',
            padding: '10px 16px',
            borderBottom: '1px solid var(--np-border-strong)',
            background: 'var(--np-elevated)',
          }}>
            {['FOTO', 'GESTION DE NOMBRE', 'TIPO', 'EDICIÓN', 'OPCIONES'].map((col, i) => (
              <span key={i} style={{
                fontSize: '0.72rem', fontWeight: '700',
                color: 'var(--np-text-muted)', letterSpacing: '0.05em',
                display: 'flex', alignItems: 'center', gap: '4px',
              }}>
                {col}
                {col === 'TIPO' && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 3h6M3 5h4M4 7h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                )}
              </span>
            ))}
          </div>

          {/* Filas */}
           {isLoading && users.length === 0 ? (
             <div style={{ padding: '40px', textAlign: 'center', color: 'var(--np-text-muted)', fontSize: '0.85rem' }}>
               Cargando usuarios…
             </div>
           ) : usuariosFiltrados.length === 0 ? (
             <div style={{ padding: '40px', textAlign: 'center', color: 'var(--np-text-muted)', fontSize: '0.85rem' }}>
               No se encontraron usuarios.
             </div>
           ) : (
            usuariosFiltrados.map((u, idx) => {
              const estaEditando = editandoId === u.id_usuario
              return (
                <div
                  key={u.id_usuario}
                  className="np-fade-up"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr 160px 200px 180px',
                    padding: '10px 16px',
                    alignItems: 'center',
                    borderBottom: idx < usuariosFiltrados.length - 1
                      ? '1px solid var(--np-border)'
                      : 'none',
                    background: estaEditando ? 'rgba(0,96,127,0.08)' : 'transparent',
                    transition: 'background 150ms',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%',
                    background: avatarColor(u.id_usuario),
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: '700', color: '#fff',
                    flexShrink: 0,
                  }}>
                    {iniciales(u.nombre)}
                  </div>

                  {/* Nombre */}
                  <span style={{ fontSize: '0.85rem', color: 'var(--np-text)', fontWeight: '500' }}>
                    {u.nombre}
                  </span>

                  {/* Tipo / Rol */}
                  {estaEditando ? (
                    <div style={{ position: 'relative' }}>
                      <select
                        autoFocus
                        value={rolEditando}
                        onChange={e => setRolEditando(Number(e.target.value))}
                        style={{
                          ...inputStyle,
                          fontSize: '0.8rem', padding: '5px 8px',
                          cursor: 'pointer', width: '100%',
                        }}
                      >
                        {roles.map(r => (
                          <option key={r.id_rol} value={r.id_rol}>{r.nombre_rol}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.82rem', color: 'var(--np-text-dim)' }}>
                      {u.nombre_rol}
                    </span>
                  )}

                  {/* Edición */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {estaEditando ? (
                      <>
                        <SmallBtn color="var(--np-accent)" hoverColor="var(--np-accent-hover)"
                          onClick={() => aplicarCambioRol(u.id_usuario)}>
                          Aplicar cambio
                        </SmallBtn>
                        <SmallBtn color="var(--np-border-strong)" hoverColor="var(--np-overlay)"
                          onClick={cancelarEdicion}>
                          Cancelar
                        </SmallBtn>
                      </>
                    ) : (
                      <SmallBtn color="var(--np-accent)" hoverColor="var(--np-accent-hover)"
                        onClick={() => iniciarEdicion(u)}>
                        Editar Rol
                      </SmallBtn>
                    )}
                  </div>

                  {/* Opciones */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                     {/* Solo mostrar "Proyectos" para usuarios con rol Ingeniero */}
                      {u.id_rol === ROLES.ENGINEER && (
                       <SmallBtn
                         color="var(--np-accent)" hoverColor="var(--np-accent-hover)"
                         onClick={() => openUserProjects(u.id_usuario)}
                       >
                         Proyectos
                       </SmallBtn>
                     )}
                    <SmallBtn
                      color="var(--np-danger)" hoverColor="var(--np-danger-hover)"
                      onClick={() => setConfirmarElim(u)}
                    >
                      Eliminar
                    </SmallBtn>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>
      
      {confirmarElim && (
        <Overlay onClick={() => setConfirmarElim(null)}>
          <Modal onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{
                fontSize: '1.1rem', fontWeight: '700', color: 'var(--np-text)',
                marginBottom: '12px',
              }}>
                ¿Eliminar usuario?
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--np-text-dim)', lineHeight: 1.6, margin: '0 0 20px' }}>
                ¿Estás seguro de que deseas eliminar a{' '}
                <strong style={{ color: 'var(--np-text)' }}>"{confirmarElim.nombre}"</strong>?
                Esta acción es permanente y no se puede deshacer.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <ModalBtn
                  onClick={() => setConfirmarElim(null)}
                  color="var(--np-border-strong)" hoverColor="var(--np-overlay)"
                  textColor="var(--np-text)"
                >
                  Cancelar
                </ModalBtn>
                <ModalBtn
                  onClick={confirmarEliminar}
                  color="var(--np-danger)" hoverColor="var(--np-danger-hover)"
                  textColor="#fff"
                >
                  Eliminar
                </ModalBtn>
              </div>
            </div>
          </Modal>
        </Overlay>
      )}
    </div>
  )
}

/* ── Sub-componentes ─────────────────────────────────────────────── */

function HeaderBtn({ children, color, hoverColor, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: color, color: '#fff', border: 'none',
      borderRadius: '5px', padding: '7px 14px',
      fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer',
      letterSpacing: '0.02em', transition: 'background 120ms',
      whiteSpace: 'nowrap',
    }}
      onMouseEnter={e => e.currentTarget.style.background = hoverColor}
      onMouseLeave={e => e.currentTarget.style.background = color}
    >
      {children}
    </button>
  )
}

function SmallBtn({ children, color, hoverColor, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: color, color: '#fff', border: 'none',
      borderRadius: '4px', padding: '5px 10px',
      fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer',
      whiteSpace: 'nowrap', transition: 'background 120ms',
    }}
      onMouseEnter={e => e.currentTarget.style.background = hoverColor}
      onMouseLeave={e => e.currentTarget.style.background = color}
    >
      {children}
    </button>
  )
}

function Overlay({ children, onClick }) {
  return (
    <div onClick={onClick} style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(8,6,22,0.85)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
    }}>
      {children}
    </div>
  )
}

function Modal({ children, onClick }) {
  return (
    <div onClick={onClick} className="np-fade-up" style={{
      background: 'var(--np-surface)',
      border: '1px solid var(--np-border-strong)',
      borderRadius: '8px',
      width: '100%', maxWidth: '400px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
    }}>
      {children}
    </div>
  )
}

function ModalBtn({ children, color, hoverColor, textColor, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: color, color: textColor, border: 'none',
      borderRadius: '5px', padding: '8px 20px',
      fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
      transition: 'background 120ms',
    }}
      onMouseEnter={e => e.currentTarget.style.background = hoverColor}
      onMouseLeave={e => e.currentTarget.style.background = color}
    >
      {children}
    </button>
  )
}

const inputStyle = {
  background: 'var(--np-elevated)',
  border: '1px solid var(--np-border-strong)',
  borderRadius: '6px',
  color: 'var(--np-text)',
  outline: 'none',
  padding: '8px 12px',
  fontSize: '0.85rem',
  width: '100%',
}
