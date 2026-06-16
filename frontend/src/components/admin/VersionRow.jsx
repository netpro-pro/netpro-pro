import Button from '../ui/Button'

export default function VersionRow({ label, isSelected, onToggle, onViewDetail }) {
  return (
    <div
      className="np-fade-up"
      style={{
        display: 'grid',
        gridTemplateColumns: '100px 1fr 180px',
        padding: '11px 20px',
        borderBottom: '1px solid var(--np-border)',
        alignItems: 'center',
        background: isSelected ? 'rgba(0,96,127,0.08)' : 'transparent',
        transition: 'background 120ms',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button
          onClick={onToggle}
          aria-pressed={isSelected}
          style={{
            width: '20px',
            height: '20px',
            background: isSelected ? 'var(--np-accent)' : 'var(--np-elevated)',
            border: `2px solid ${isSelected ? 'var(--np-accent)' : 'var(--np-border-strong)'}`,
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            transition: 'background 120ms, border-color 120ms',
          }}
        >
          {isSelected && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>

      <span style={{
        color: 'var(--np-text)',
        fontWeight: '700',
        fontSize: '0.9rem',
      }}>
        {label}
      </span>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="warning" 
          size="sm" 
          onClick={onViewDetail}
          className="text-[0.72rem] font-semibold"
        >
          Ver Detalle de la Versión
        </Button>
      </div>
    </div>
  )
}
