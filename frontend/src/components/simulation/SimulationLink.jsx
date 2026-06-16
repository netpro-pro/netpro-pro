import React from 'react'
import AnimatedPacket from './AnimatedPacket'
import { MATERIAL_ATTENUATION_FACTORS } from '../../utils/simulation-utils'
import { segmentIntersectsRect } from '../../utils/netpro-physics'

export default function SimulationLink({ 
  link, 
  fromPos, 
  toPos, 
  absoluteDims, 
  isSimulating, 
  failedLinks, 
  obstacles, 
  cliConfig 
}) {
  const { w, h } = absoluteDims
  const toAbs = (pct, dim) => (pct / 100) * dim
  
  const x1 = toAbs(fromPos.x, w)
  const y1 = toAbs(fromPos.y, h)
  const x2 = toAbs(toPos.x, w)
  const y2 = toAbs(toPos.y, h)

    const linkKey = `${link.origin}-${link.destination}`
    const isDown = failedLinks?.includes(linkKey) || failedLinks?.includes(`${link.destination}-${link.origin}`)
    const color = isDown ? '#D40F0F' : (link.medium === 'fiber' ? '#53EEFF' : '#8D5D04')
    const dashArray = link.medium === 'fiber' ? 'none' : '6,3'

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth="3" opacity="0.12" strokeLinecap="round"/>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={color} strokeWidth={isDown ? 2 : 1.5}
        strokeDasharray={isDown ? '4,4' : dashArray}
        opacity={isDown ? 0.9 : 0.75}
        strokeLinecap="round"
      />
      <text x={(x1+x2)/2} y={(y1+y2)/2 - 5}
        fill={color} fontSize="8.5" textAnchor="middle" opacity="0.8"
        fontFamily="JetBrains Mono, monospace">
        {isDown ? '✕ caído' : link.medium}
      </text>
      {isSimulating && !isDown && (() => {
        const bwNominal = link.medium === 'fiber' ? 1000 : link.medium === 'copper' ? 100 : 54
        const bwOverride = cliConfig.bandwidth?.[link.medium] ?? cliConfig.networkSpeed?.[link.medium]
        const bwBase = bwOverride ?? bwNominal

        let attenuationDB = 0
        if (obstacles.length > 0) {
          const mediumFactor = link.medium === 'wireless' ? 1.0 : link.medium === 'copper' ? 0.20 : 0.05
          for (const o of obstacles) {
               if (segmentIntersectsRect(fromPos.x, fromPos.y, toPos.x, toPos.y, o)) {
                 attenuationDB += (MATERIAL_ATTENUATION_FACTORS[o.material] ?? 1.0) * (o.thicknessCm ?? 5) * mediumFactor
               }
          }
        }
        const factor = Math.max(0.05, 1 / (1 + attenuationDB / 30))
        const bwEffective = bwBase * factor
        const duration = Math.max(0.3, Math.min(4.0, 60 / Math.max(bwEffective, 1)))
        
        return (
          <>
            <AnimatedPacket x1={x1} y1={y1} x2={x2} y2={y2} color={color} delay={0} duration={duration} />
            <AnimatedPacket x1={x2} y1={y2} x2={x1} y2={y1} color={color} delay={duration / 2} duration={duration} />
          </>
        )
      })()}
    </g>
  )
}
