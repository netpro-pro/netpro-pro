import React from 'react'
import { MATERIAL_COLORS } from '../../utils/simulation-utils'

export default function SimulationObstacle({ obstacle, index, absoluteX, absoluteY, absoluteW, absoluteH }) {
  const color = MATERIAL_COLORS[obstacle.material] || MATERIAL_COLORS.drywall

  return (
    <g key={`obs-${index}`}>
      <rect x={absoluteX} y={absoluteY} width={absoluteW} height={absoluteH}
        fill={color.fill} stroke={color.stroke} strokeWidth="1.2"
        strokeDasharray="3,2" rx="2"/>
      <text x={absoluteX + absoluteW/2} y={absoluteY + absoluteH/2 + 3}
        fill={color.stroke} fontSize="8" textAnchor="middle"
        fontFamily="JetBrains Mono, monospace" opacity="0.9">
        {obstacle.material}{obstacle.thicknessCm ? ` ${obstacle.thicknessCm}cm` : ''}
      </text>
    </g>
  )
}
