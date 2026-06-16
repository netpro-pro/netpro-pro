import React from 'react'

const COLORS = {
  HOPS: '#53EEFF',
  LATENCY: '#E8005A',
  BG_CHART: '#eef3f8',
}

export default function PerformanceChart({ tests }) {
  const W = 760, H = 360
  const PAD = { top: 30, right: 30, bottom: 70, left: 60 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  const rawMax = Math.max(...tests.flatMap(p => [p.hops, p.latency]), 5)
  const TICK_COUNT = 5
  const step = Math.ceil(rawMax / TICK_COUNT / 5) * 5 || 5
  const yMax = step * TICK_COUNT
  const yTicks = Array.from({ length: TICK_COUNT + 1 }, (_, i) => i * step)

  const groupW = chartW / tests.length
  const barW = Math.min(groupW * 0.30, 36)
  const gap = barW * 0.35

  const toY = v => chartH - (v / yMax) * chartH

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block', maxWidth: W }}>
      <rect x={PAD.left} y={PAD.top} width={chartW} height={chartH}
        fill={COLORS.BG_CHART} rx="4" />

      {yTicks.map(t => (
        <g key={t}>
          <line
            x1={PAD.left} y1={PAD.top + toY(t)}
            x2={PAD.left + chartW} y2={PAD.top + toY(t)}
            stroke="rgba(0,0,0,0.08)" strokeWidth="1"
          />
          <text
            x={PAD.left - 8} y={PAD.top + toY(t) + 4}
            textAnchor="end" fontSize="12"
            fill="#444" fontFamily="Roboto, sans-serif">
            {t}
          </text>
        </g>
      ))}

      {tests.map((p, i) => {
        const cx = PAD.left + groupW * i + groupW / 2
        const x1 = cx - gap / 2 - barW
        const x2 = cx + gap / 2

        const hS = (p.hops / yMax) * chartH
        const hL = (p.latency / yMax) * chartH
        const yS = PAD.top + chartH - hS
        const yL = PAD.top + chartH - hL

        const minBarH = 4
        const hSvis = p.hops > 0 ? Math.max(hS, minBarH) : 0
        const hLvis = p.latency > 0 ? Math.max(hL, minBarH) : 0

        return (
          <g key={p.id}>
            <rect x={x1} y={PAD.top + chartH - hSvis} width={barW} height={hSvis}
              fill={COLORS.HOPS} rx="2" />
            {p.hops > 0 && (
              <text x={x1 + barW / 2} y={yS - 4}
                textAnchor="middle" fontSize="11" fontWeight="600"
                fill="#0c3a50" fontFamily="JetBrains Mono, monospace">
                {p.hops}
              </text>
            )}

            {p.lost ? (
              <>
                <rect x={x2} y={PAD.top + chartH - 20} width={barW} height={20}
                  fill="#888" rx="2" opacity="0.5" />
                <text x={x2 + barW / 2} y={PAD.top + chartH - 24}
                  textAnchor="middle" fontSize="13" fontWeight="700"
                  fill="#cc2244" fontFamily="JetBrains Mono, monospace">
                  ✗
                </text>
              </>
            ) : (
              <>
                <rect x={x2} y={PAD.top + chartH - hLvis} width={barW} height={hLvis}
                  fill={COLORS.LATENCY} rx="2" />
                {p.latency > 0 && (
                  <text x={x2 + barW / 2} y={yL - 4}
                    textAnchor="middle" fontSize="11" fontWeight="600"
                    fill="#7a0030" fontFamily="JetBrains Mono, monospace">
                    {p.latency}
                  </text>
                )}
              </>
            )}

            <text
              x={cx} y={PAD.top + chartH + 18}
              textAnchor="middle" fontSize="13" fontWeight="600"
              fill="#333" fontFamily="Roboto, sans-serif">
              {p.id}
            </text>
          </g>
        )
      })}

      <line
        x1={PAD.left} y1={PAD.top + chartH}
        x2={PAD.left + chartW} y2={PAD.top + chartH}
        stroke="#888" strokeWidth="1.2"
      />

      <g transform={`translate(${PAD.left + chartW / 2 - 130}, ${H - 18})`}>
        <rect x="0" y="-10" width="14" height="14" fill={COLORS.HOPS} rx="2" />
        <text x="20" y="2" fontSize="13" fill="#333" fontFamily="Roboto, sans-serif" fontWeight="500">Saltos (hops)</text>
        <rect x="115" y="-10" width="14" height="14" fill={COLORS.LATENCY} rx="2" />
        <text x="135" y="2" fontSize="13" fill="#333" fontFamily="Roboto, sans-serif" fontWeight="500">Latencia (ms)</text>
        <rect x="250" y="-10" width="14" height="14" fill="#888" rx="2" opacity="0.5" />
        <text x="270" y="2" fontSize="13" fill="#333" fontFamily="Roboto, sans-serif" fontWeight="500">Perdido</text>
      </g>
    </svg>
  )
}
