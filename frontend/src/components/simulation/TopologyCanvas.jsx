import React, { useState, useRef, useEffect } from 'react'
import { ICONS, DEFAULT_ICON } from '../icons/SimulationIcons'
import { applyCollisions } from '../../utils/netpro-canvas'

export default function TopologyCanvas({ nodes, links, obstacles = [], onClickNode }) {
  const svgRef = useRef(null)
  const [dims, setDims] = useState({ w: 500, h: 400 })

  useEffect(() => {
    if (!svgRef.current) return
    const ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        setDims({ w: entry.contentRect.width, h: entry.contentRect.height })
      }
    })
    ro.observe(svgRef.current.parentElement)
    return () => ro.disconnect()
  }, [])

  // Use the robust applyCollisions from utils
  const positionedNodes = applyCollisions(nodes)
  const positions = {}
  positionedNodes.forEach(n => {
    positions[n.id] = { x: n.x, y: n.y }
  })

  const toAbsolute = (pct, dim) => (pct / 100) * dim

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${dims.w} ${dims.h}`}
      style={{ display: 'block' }}
    >
      <defs>
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(83,238,255,0.04)" strokeWidth="0.5"/>
        </pattern>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)"/>

      {obstacles.map((o, i) => {
        const MATERIAL_COLORS = {
          drywall:  { fill: 'rgba(168,180,160,0.18)', stroke: '#a8b4a0' },
          madera:   { fill: 'rgba(141, 93,  4,0.22)', stroke: '#8D5D04' },
          vidrio:   { fill: 'rgba(83,238,255,0.12)',  stroke: '#53EEFF' },
          ladrillo: { fill: 'rgba(212, 87, 47,0.22)', stroke: '#d4572f' },
          concreto: { fill: 'rgba(140,140,140,0.24)', stroke: '#8c8c8c' },
          metal:    { fill: 'rgba(212, 15, 15,0.18)', stroke: '#D40F0F' },
        }
        const c = MATERIAL_COLORS[o.material] || MATERIAL_COLORS.drywall
        const x = toAbsolute(o.x ?? 0, dims.w)
        const y = toAbsolute(o.y ?? 0, dims.h)
        const w = toAbsolute(o.w ?? 10, dims.w)
        const h = toAbsolute(o.h ?? 4,  dims.h)
        return (
          <g key={`obs-${i}`}>
            <rect x={x} y={y} width={w} height={h}
              fill={c.fill} stroke={c.stroke} strokeWidth="1.2"
              strokeDasharray="3,2" rx="2"/>
            <text x={x + w/2} y={y + h/2 + 3}
              fill={c.stroke} fontSize="8" textAnchor="middle"
              fontFamily="JetBrains Mono, monospace" opacity="0.9">
              {o.material}{o.thicknessCm ? ` ${o.thicknessCm}cm` : ''}
            </text>
          </g>
        )
      })}

      {links.map((e, i) => {
        const from = positions[e.origin]
        const to   = positions[e.destination]
        if (!from || !to) return null
        const x1 = toAbsolute(from.x, dims.w)
        const y1 = toAbsolute(from.y, dims.h)
        const x2 = toAbsolute(to.x, dims.w)
        const y2 = toAbsolute(to.y, dims.h)
        const color = e.medium === 'fiber' ? '#53EEFF' : '#8D5D04'
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2}
               stroke={color} strokeWidth="1.5" strokeDasharray={e.medium === 'fiber' ? 'none' : '5,3'} opacity="0.7"/>
              <text x={(x1+x2)/2} y={(y1+y2)/2 - 4}
                fill={color} fontSize="9" textAnchor="middle" opacity="0.7"
                fontFamily="JetBrains Mono, monospace">
                {e.medium}
            </text>
          </g>
        )
      })}

      {nodes.map((node) => {
        const pos = positions[node.id]
        if (!pos) return null
        const cx = toAbsolute(pos.x, dims.w)
        const cy = toAbsolute(pos.y, dims.h)
        const type = node.type?.toLowerCase() || 'pc'
        const icon = ICONS[type] || DEFAULT_ICON
        const label = node.label || node.id

        return (
          <g
            key={node.id}
            transform={`translate(${cx - 20}, ${cy - 20})`}
            style={{ cursor: 'pointer' }}
            onClick={() => onClickNode(node)}
            filter="url(#glow)"
          >
            {icon}
             <text
                x="20" y="52"
               fill="#FFFFFF"
               fontSize="9"
               textAnchor="middle"
               fontFamily="JetBrains Mono, monospace"
               fontWeight="500"
             >
               {label.length > 14 ? label.slice(0, 13) + '…' : label}
             </text>
             {node.ip && (
               <text                 x="20" y="62" fill="#53EEFF" fontSize="8" textAnchor="middle" fontFamily="JetBrains Mono, monospace" opacity="0.75">
                 {node.ip}
               </text>
             )}
          </g>
        )
      })}

      {nodes.length === 0 && (
        <text x={dims.w / 2} y={dims.h / 2}
          fill="rgba(116,110,110,0.6)" fontSize="12" textAnchor="middle"
          fontFamily="JetBrains Mono, monospace">
          Escribe código DSL para visualizar la topología
        </text>
      )}
    </svg>
  )
}
