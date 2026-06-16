import React from 'react'
import { ICONS, DEFAULT_ICON } from '../icons/SimulationIcons'

export default function SimulationNode({ node, pos, absoluteX, absoluteY, isSimulating }) {
  const type = node.type?.toLowerCase() || 'pc'
  const icon = ICONS[type] || DEFAULT_ICON
  const label = node.label || node.id

  return (
    <g filter="url(#node-glow)">
      {isSimulating && (
        <circle cx={absoluteX} cy={absoluteY} r="24" fill="rgba(83,238,255,0.04)" stroke="rgba(83,238,255,0.15)" strokeWidth="1">
          <animate attributeName="r" values="22;28;22" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite"/>
        </circle>
      )}
      <g transform={`translate(${absoluteX - 18}, ${absoluteY - 18})`}>
        {icon}
      </g>
      <text x={absoluteX} y={absoluteY + 28}
        fill="#FFFFFF" fontSize="9" textAnchor="middle"
        fontFamily="JetBrains Mono, monospace" fontWeight="500">
        {label.length > 12 ? label.slice(0, 11) + '…' : label}
      </text>
      {node.ip && (
        <text x={absoluteX} y={absoluteY + 39}
          fill="#53EEFF" fontSize="8" textAnchor="middle"
          fontFamily="JetBrains Mono, monospace" opacity="0.75">
          {node.ip}
        </text>
      )}
    </g>
  )
}
