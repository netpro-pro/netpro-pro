import React from 'react'

export default function AnimatedPacket({ x1, y1, x2, y2, color, delay = 0, duration = 1.8 }) {
  return (
    <circle cx={x1} cy={y1} r="4" fill={color} opacity="0.9">
      <animateMotion
        dur={`${duration}s`}
        repeatCount="indefinite"
        begin={`${delay}s`}
        calcMode="spline"
        keySplines="0.4 0 0.6 1"
      >
        <mpath>
          <path d={`M ${x1} ${y1} L ${x2} ${y2}`} />
        </mpath>
      </animateMotion>
      <animate attributeName="opacity" values="0;0.9;0" dur={`${duration}s`} repeatCount="indefinite" begin={`${delay}s`} />
    </circle>
  )
}
