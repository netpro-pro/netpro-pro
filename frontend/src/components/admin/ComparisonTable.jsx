export default function ComparisonTable({ comparison }) {
  const { anterior, actual } = comparison

  const labelAnterior = anterior.version?.numero_version ?? 'Anterior'
  const labelActual = actual.version?.numero_version ?? 'Actual'

  const metrics = [
    {
      name: 'Latencia Promedio',
      field: 'latencia_promedio',
      unit: 'ms',
      lowerIsBetter: true,
    },
    {
      name: 'Perdida de Paquetes',
      field: 'perdida_paquetes',
      unit: '%',
      lowerIsBetter: true,
    },
    {
      name: 'Ancho de Banda usado',
      field: 'ancho_banda',
      unit: 'Mbps',
      lowerIsBetter: false,
    },
    {
      name: 'Saltos Promedios',
      field: 'saltos_promedio',
      unit: '',
      lowerIsBetter: true,
    },
  ]

  function formatValue(data, field, unit) {
    const v = data?.[field]
    if (v == null) return '—'
    return `${v}${unit ? ' ' + unit : ''}`
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        padding: '10px 20px',
        background: 'var(--np-elevated)',
        borderBottom: '1px solid var(--np-border-strong)',
      }}>
        {[
          'MÉTRICA DE RED',
          `VERSIÓN [ANTERIOR] (${labelAnterior})`,
          `VERSIÓN [ACTUAL] (${labelActual})`,
        ].map((h, i) => (
          <span key={i} style={{
            fontSize: '0.72rem',
            fontWeight: '700',
            color: 'var(--np-text)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            textAlign: i > 0 ? 'center' : 'left',
          }}>
            {h}
          </span>
        ))}
      </div>

      {metrics.map((m) => {
        const valA = anterior.metricas?.[m.field]
        const valB = actual.metricas?.[m.field]
        const improved = valA != null && valB != null
          ? m.lowerIsBetter ? valB < valA : valB > valA
          : null

        return (
          <div
            key={m.field}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              padding: '12px 20px',
              borderBottom: '1px solid var(--np-border)',
              alignItems: 'center',
            }}
          >
            <span style={{ fontWeight: '700', fontSize: '0.88rem', color: 'var(--np-text)' }}>
              {m.name}
            </span>
            <span style={{
              fontWeight: '700', fontSize: '0.88rem', textAlign: 'center',
              color: 'var(--np-text)',
            }}>
              {formatValue(anterior.metricas, m.field, m.unit)}
            </span>
            <span style={{
              fontWeight: '700', fontSize: '0.88rem', textAlign: 'center',
              color: improved === true
                ? 'var(--np-success)'
                : improved === false
                  ? 'var(--np-danger)'
                  : 'var(--np-text)',
            }}>
              {formatValue(actual.metricas, m.field, m.unit)}
              {improved === true && <span style={{ marginLeft: '6px', fontSize: '0.75rem' }}>▲</span>}
              {improved === false && <span style={{ marginLeft: '6px', fontSize: '0.75rem' }}>▼</span>}
            </span>
          </div>
        )
      })}
    </div>
  )
}
