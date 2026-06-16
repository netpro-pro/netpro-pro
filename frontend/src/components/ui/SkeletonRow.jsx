export default function SkeletonRow() {
  return (
    <div style={{
      background: 'var(--np-elevated)',
      border: '1px solid var(--np-border)',
      borderRadius: '6px',
      padding: '11px 16px',
      height: '42px',
      opacity: 0.5,
      animation: 'np-pulse 1.5s ease-in-out infinite',
    }} />
  )
}
