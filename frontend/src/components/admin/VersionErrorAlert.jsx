export default function VersionErrorAlert({ error, onClose }) {
  if (!error) return null
  
  return (
    <div style={{
      marginBottom: '16px', padding: '10px 14px',
      background: 'rgba(212,15,15,0.15)',
      border: '1px solid var(--np-danger)',
      borderRadius: '6px', color: 'var(--np-danger)', fontSize: '0.82rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span>{error}</span>
      <button 
        onClick={onClose} 
        style={{ background: 'none', border: 'none', color: 'var(--np-danger)', cursor: 'pointer', fontSize: '1rem' }}
      >
        ✕
      </button>
    </div>
  )
}
