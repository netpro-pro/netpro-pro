import React from 'react'
import MetricCard from './MetricCard'

export default function ReportMetricsSection({ metrics }) {
  return (
    <div>
      <div className="text-np-text-muted text-[0.74rem] font-bold tracking-widest uppercase mb-2.5">
        Métricas Globales
      </div>
      <div className="flex gap-3.5 flex-wrap">
        <MetricCard
          icon="📉"
          label="Paquetes Perdidos"
          value={metrics.lossRate > 0 ? metrics.lossRate : '0'}
          unit="%"
          color="#E8005A"
        />
        <MetricCard
          icon="📡"
          label="Ancho de Banda"
          value={metrics.bandwidth > 0 ? metrics.bandwidth : '—'}
          unit={metrics.bandwidth > 0 ? 'Mbps' : ''}
          color="#53EEFF"
        />
        <MetricCard
          icon="⏱"
          label="Latencia Promedio"
          value={metrics.avgLatency}
          unit="ms"
          color="#FFB454"
        />
        <MetricCard
          icon="🔗"
          label="Saltos Promedio"
          value={metrics.avgHops}
          unit=""
          color="#3fb950"
        />
      </div>
    </div>
  )
}
