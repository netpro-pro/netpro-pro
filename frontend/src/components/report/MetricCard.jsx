import React from 'react'

export default function MetricCard({ label, value, unit, icon, color }) {
  return (
    <div style={{
      flex: '1 1 200px',
      minWidth: 200,
      background: 'var(--np-surface)',
      border: '1px solid var(--np-border-strong)',
      borderRadius: 10,
      padding: '18px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      transition: 'border-color 200ms, transform 200ms',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = color
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--np-border-strong)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '1rem', lineHeight: 1 }}>{icon}</span>
        <span style={{
          fontSize: '0.72rem',
          color: 'var(--np-text-muted)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}>
          {label}
        </span>
      </div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '1.6rem',
        color: color,
        fontWeight: 700,
        lineHeight: 1.1,
        marginTop: 2,
      }}>
        {value}
        {unit && (
          <span style={{
            fontSize: '0.85rem',
            fontWeight: 500,
            color: 'var(--np-text-dim)',
            marginLeft: 6,
          }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}
