import { useEffect, useRef, useState } from 'react'

export default function ProyectoCard({
  proyecto,
  onAbrir,
  onCopiar,
  onEliminar,
  onRenombrar,
}) {
  const { id_proyecto, nombre } = proyecto

  const [editando, setEditando] = useState(false)
  const [borrador, setBorrador] = useState(nombre)
  const inputRef = useRef(null)

  useEffect(() => { setBorrador(nombre) }, [nombre])
  useEffect(() => { if (editando) inputRef.current?.select() }, [editando])

  function confirmar() {
    const limpio = borrador.trim()
    setEditando(false)
    if (!limpio || limpio === nombre || !onRenombrar) {
      setBorrador(nombre)
      return
    }
    onRenombrar(id_proyecto, limpio)
  }

  function cancelar() {
    setBorrador(nombre)
    setEditando(false)
  }

  return (
    <div style={{
      background: 'var(--np-surface)',
      border: '1px solid var(--np-border-strong)',
      borderRadius: '6px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <button
        onClick={() => onAbrir(id_proyecto)}
        style={{
          background: 'var(--np-card-preview)',
          border: 'none',
          cursor: 'pointer',
          display: 'block',
          width: '100%',
          height: '110px',
          padding: 0,
        }}
        title="Abrir Workspace"
      />

      <div style={{ padding: '8px 10px 6px', borderTop: '1px solid var(--np-border)' }}>
        {editando ? (
          <input
            ref={inputRef}
            value={borrador}
            onChange={e => setBorrador(e.target.value)}
            onBlur={confirmar}
            onKeyDown={e => {
              if (e.key === 'Enter') confirmar()
              else if (e.key === 'Escape') cancelar()
            }}
            style={{
              width: '100%',
              background: 'var(--np-elevated)',
              border: '1px solid var(--np-accent)',
              borderRadius: '4px',
              color: 'var(--np-text)',
              fontSize: '0.78rem',
              padding: '3px 6px',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        ) : (
          <p
            onDoubleClick={() => onRenombrar && setEditando(true)}
            title={onRenombrar ? 'Doble-click para renombrar' : nombre}
            style={{
              color: 'var(--np-text)',
              fontSize: '0.78rem',
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              cursor: onRenombrar ? 'text' : 'default',
              userSelect: 'none',
            }}
          >
            {nombre}
          </p>
        )}
      </div>

      {/* Acciones */}
      <div style={{
        display: 'flex',
        gap: '6px',
        padding: '0 10px 10px',
      }}>
        <ActionBtn
          color="var(--np-danger)"
          hoverColor="#f01a1a"
          onClick={() => onEliminar(proyecto)}
        >
          Eliminar
        </ActionBtn>
        <ActionBtn
          color="var(--np-accent)"
          hoverColor="var(--np-accent-hover)"
          onClick={() => onCopiar(proyecto)}
        >
          Copiar
        </ActionBtn>
      </div>
    </div>
  )
}

function ActionBtn({ children, color, hoverColor, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        background: color,
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '5px 0',
        fontSize: '0.72rem',
        fontWeight: '600',
        cursor: 'pointer',
        letterSpacing: '0.04em',
        transition: 'background 120ms',
      }}
      onMouseEnter={e => e.currentTarget.style.background = hoverColor}
      onMouseLeave={e => e.currentTarget.style.background = color}
    >
      {children}
    </button>
  )
}
