import React from 'react'

export default function ErrorBanner({ error, onClear }) {
  return (
    <div style={{ 
      background: 'rgba(212,15,15,0.15)', 
      border: '1px solid var(--np-danger)', 
      color: 'var(--np-danger)', 
      padding: '8px 16px', 
      fontSize: '0.8rem', 
      display: 'flex', 
      justifyContent: 'space-between' 
    }}>
      {error}
      <button 
        onClick={onClear} 
        style={{ background: 'none', border: 'none', color: 'var(--np-danger)', cursor: 'pointer' }}
      >
        ✕
      </button>
    </div>
  )
}
