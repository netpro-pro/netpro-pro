export default function ActivityRow({ detail }) {
  return (
    <div
      className="np-fade-up"
      style={{
        background: 'var(--np-elevated)',
        border: '1px solid var(--np-border-strong)',
        borderRadius: '6px',
        padding: '11px 16px',
        color: 'var(--np-text-dim)',
        fontSize: '0.84rem',
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: '0.01em',
        lineHeight: 1.5,
        wordBreak: 'break-word',
      }}
    >
      {detail}
    </div>
  )
}
