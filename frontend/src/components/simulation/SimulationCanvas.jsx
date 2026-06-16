import React, { useState, useRef, useEffect } from 'react'
import { calculateNodePositions } from '../../utils/simulation-utils'
import SimulationObstacle from './SimulationObstacle'
import SimulationLink from './SimulationLink'
import SimulationNode from './SimulationNode'

export default function SimulationCanvas({ nodes, links, isSimulating, failedLinks, obstacles = [], cliConfig = {} }) {
  const svgRef = useRef(null)
  const [dimensions, setDimensions] = useState({ w: 600, h: 340 })

  useEffect(() => {
    if (!svgRef.current) return
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setDimensions({ w: entry.contentRect.width, h: entry.contentRect.height })
      }
    })
    resizeObserver.observe(svgRef.current.parentElement)
    return () => resizeObserver.disconnect()
  }, [])

  const positions = calculateNodePositions(nodes)
  const toAbsolute = (pct, dim) => (pct / 100) * dim

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={`0 0 ${dimensions.w} ${dimensions.h}`}
      style={{ display: 'block' }}
    >
      <defs>
        <pattern id="sim-grid" width="28" height="28" patternUnits="userSpaceOnUse">
          <path d="M 28 0 L 0 0 0 28" fill="none" stroke="rgba(83,238,255,0.05)" strokeWidth="0.5"/>
        </pattern>
        <filter id="sim-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="node-glow">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <radialGradient id="bg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,96,127,0.08)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#sim-grid)"/>
      <rect width="100%" height="100%" fill="url(#bg-glow)"/>

      {obstacles.map((obstacle, index) => (
        <SimulationObstacle 
          key={`obs-${index}`}
          obstacle={obstacle}
          index={index}
          absoluteX={toAbsolute(obstacle.x ?? 0, dimensions.w)}
          absoluteY={toAbsolute(obstacle.y ?? 0, dimensions.h)}
          absoluteW={toAbsolute(obstacle.w ?? 10, dimensions.w)}
          absoluteH={toAbsolute(obstacle.h ?? 4, dimensions.h)}
        />
      ))}

      {links.map((link, index) => {
        const fromPos = positions[link.origin]
        const toPos = positions[link.destination]
        if (!fromPos || !toPos) return null
        return (
          <SimulationLink 
            key={index}
            link={link}
            fromPos={fromPos}
            toPos={toPos}
            absoluteDims={dimensions}
            isSimulating={isSimulating}
            failedLinks={failedLinks}
            obstacles={obstacles}
            cliConfig={cliConfig}
          />
        )
      })}

      {nodes.map((node) => {
        const pos = positions[node.id]
        if (!pos) return null
        return (
          <SimulationNode 
            key={node.id}
            node={node}
            pos={pos}
            absoluteX={toAbsolute(pos.x, dimensions.w)}
            absoluteY={toAbsolute(pos.y, dimensions.h)}
            isSimulating={isSimulating}
          />
        )
      })}

      {nodes.length === 0 && (
        <text x={dimensions.w / 2} y={dimensions.h / 2}
          fill="rgba(116,110,110,0.5)" fontSize="12" textAnchor="middle"
          fontFamily="JetBrains Mono, monospace">
          Sin topología cargada — vuelve al Workspace y guarda tu diagrama
        </text>
      )}
    </svg>
  )
}
