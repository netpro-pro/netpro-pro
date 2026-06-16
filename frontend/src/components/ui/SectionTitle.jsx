export default function SectionTitle({ children }) {
  return (
    <div>
      <span style={{ color: '#fff', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.04em' }}>
        {children}
      </span>
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.3)', marginTop: '6px' }} />
    </div>
  )
}
