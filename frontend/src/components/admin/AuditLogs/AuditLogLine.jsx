export default function AuditLogLine({ detail }) {
  if (!detail) return null

  const lines = detail.split('\n')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
      {lines.map((line, idx) => {
        const isNested = line.trimStart().startsWith('---')
        return (
          <div
            key={idx}
            style={{
              color: isNested ? 'var(--np-text-dim)' : 'var(--np-text)',
              fontSize: '0.84rem',
              fontFamily: "'JetBrains Mono', monospace",
              paddingLeft: isNested ? '20px' : '0',
              letterSpacing: '0.01em',
              lineHeight: 1.6,
            }}
          >
            {line}
          </div>
        )
      })}
    </div>
  )
}
