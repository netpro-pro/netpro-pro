import { calculateLinkLatency, packetSizeToBits, getNodesDistance, canvasDistanceToKm, segmentIntersectsRect } from './netpro-physics'

export const NODE_TYPE_POSITIONS = {
  router:   { base: [50, 14] },
  firewall: { base: [50, 14] },
  switch:   { base: [50, 42] },
  server:   { base: [18, 68] },
  pc:       { base: [65, 70] },
  laptop:   { base: [82, 44] },
  wifi:     { base: [18, 44] },
  tablet:   { base: [30, 80] },
}

export const MATERIAL_COLORS = {
  drywall:  { fill: 'rgba(168,180,160,0.18)', stroke: '#a8b4a0' },
  madera:   { fill: 'rgba(141, 93,  4,0.22)', stroke: '#8D5D04' },
  vidrio:   { fill: 'rgba(83,238,255,0.12)',  stroke: '#53EEFF' },
  ladrillo: { fill: 'rgba(212, 87, 47,0.22)', stroke: '#d4572f' },
  concreto: { fill: 'rgba(140,140,140,0.24)', stroke: '#8c8c8c' },
  metal:    { fill: 'rgba(212, 15, 15,0.18)', stroke: '#D40F0F' },
}

export const MATERIAL_ATTENUATION_FACTORS = { 
  drywall: 0.4, madera: 0.6, vidrio: 0.8, ladrillo: 2.0, concreto: 3.5, metal: 6.0 
}

export function calculateNodePositions(nodes) {
  const positioned = {}
  const counters = {}
  nodes.forEach((node) => {
    const type = node.type?.toLowerCase() || 'pc'
    const base = NODE_TYPE_POSITIONS[type]?.base || [50, 50]
    counters[type] = (counters[type] || 0) + 1
    const count = counters[type]
    const offsetX = (count - 1) * 20
    const offsetY = (count - 1) * 8
    positioned[node.id] = {
      x: Math.min(Math.max(base[0] + offsetX, 6), 92),
      y: Math.min(Math.max(base[1] + offsetY, 6), 92),
    }
  })
  return positioned
}

export function findShortestPath(src, dst, links) {
  if (src === dst) return [src]
  const adj = {}
  links.forEach(e => {
    if (!adj[e.origin])  adj[e.origin]  = []
    if (!adj[e.destination]) adj[e.destination] = []
    adj[e.origin].push(e.destination)
    adj[e.destination].push(e.origin)
  })
  const visited = new Set([src])
  const queue = [[src, [src]]]
  while (queue.length > 0) {
    const [current, path] = queue.shift()
    for (const neighbor of (adj[current] || [])) {
      if (neighbor === dst) return [...path, dst]
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push([neighbor, [...path, neighbor]])
      }
    }
  }
  return null
}

export function findLinkBetweenNodes(a, b, links) {
  return links.find(
    e => (e.origin === a && e.destination === b) || (e.destination === a && e.origin === b)
  )
}

export function calculateSimulationMetrics(
  path, 
  nodes, 
  links, 
  obstacles, 
  cliConfig, 
  packetSizeBits
) {
  const hops = path.length - 1
  let accumulatedLatencyMs = 0
  let accumulatedAttenuationDB = 0
  let minEffectiveBW = Infinity
  let totalObstacles = 0
  const usedMedia = new Set()
  let totalDistanceM = 0

  for (let h = 0; h < hops; h++) {
    const nodeA = nodes.find(n => n.id === path[h])
    const nodeB = nodes.find(n => n.id === path[h + 1])
    const link = findLinkBetweenNodes(path[h], path[h + 1], links)
    const medium = link?.medium || 'copper'
    usedMedia.add(medium)

    const distKm = (nodeA && nodeB)
      ? canvasDistanceToKm(getNodesDistance(nodeA, nodeB))
      : 0.05
    totalDistanceM += distKm * 1000

    const hopObstacles = (nodeA && nodeB)
      ? obstacles.filter(o => segmentIntersectsRect(
          nodeA.x ?? 50, nodeA.y ?? 50,
          nodeB.x ?? 50, nodeB.y ?? 50, o
        ))
      : []
    totalObstacles += hopObstacles.length

    const bwOvr = cliConfig.bandwidth?.[medium] ?? cliConfig.networkSpeed?.[medium]

    const physicalHop = calculateLinkLatency({
      medium: medium,
      distanceKm: distKm,
      packetSizeBits: packetSizeBits,
      obstacles: hopObstacles,
      bandwidthOverride: bwOvr,
    })

    accumulatedLatencyMs += physicalHop.totalLatencyMs
    accumulatedAttenuationDB += physicalHop.attenuationDB
    minEffectiveBW = Math.min(minEffectiveBW, physicalHop.effectiveBwMbps)
  }

  return {
    hops,
    accumulatedLatencyMs,
    accumulatedAttenuationDB,
    minEffectiveBW: isFinite(minEffectiveBW) ? minEffectiveBW : 0,
    totalObstacles,
    usedMedia,
    totalDistanceM,
  }
}

export function calculateVersionMetrics(simulationResults) {
  if (!simulationResults || simulationResults.length === 0) return null
  const last = simulationResults.slice(-5)
  const lat = last.reduce((s, r) => s + (r.latencia || 0), 0) / last.length
  const hop = last.reduce((s, r) => s + (r.saltos || 0), 0) / last.length
  return {
    avgLatency: Math.round(lat),
    avgHops: Math.round(hop * 10) / 10,
    tests: last,
  }
}

export function performPingSimulation({ canvasNodes, canvasLinks, canvasObstacles, cliConfig, currentCode }) {
  const pingMatch = currentCode.match(/simulate ping from (\S+) to (\S+)/)
  if (!pingMatch) {
    return {
      success: false,
      msg: '⚠️  Sin comando simulate. Agrega: simulate ping from X to Y',
    }
  }

  const [, origin, destination] = pingMatch
  const nodeOrig = canvasNodes.find(n => n.id === origin)
  const nodeDst  = canvasNodes.find(n => n.id === destination)

  if (!nodeOrig || !nodeDst) {
    return {
      success: false,
      msg: `❌ Nodo no encontrado: ${!nodeOrig ? origin : destination}`,
    }
  }

  const linkRoute = canvasLinks.find(
    e => (e.origin === origin && e.destination === destination) ||
          (e.destination === origin && e.origin === destination)
  )

  const mediumRoute = linkRoute?.medium || 'copper'
  const distKm = canvasDistanceToKm(getNodesDistance(nodeOrig, nodeDst))
  const bwOverride = cliConfig?.bandwidth?.[mediumRoute] ?? cliConfig?.networkSpeed?.[mediumRoute]
  const obstaclesAffecting = (canvasObstacles || []).filter(o => segmentIntersectsRect(
      nodeOrig.x ?? 50, nodeOrig.y ?? 50,
      nodeDst.x  ?? 50, nodeDst.y  ?? 50,
      o
    ))

  const physical = calculateLinkLatency({
    medium: mediumRoute,
    distanceKm: distKm,
    packetSizeBits: packetSizeToBits('10KB'),
    obstacles: obstaclesAffecting,
    bandwidthOverride: bwOverride,
  })

  const latMs = Math.max(1, Math.round(physical.totalLatencyMs))
  const maxLossAtten = mediumRoute === 'wireless' ? 30 : mediumRoute === 'copper' ? 60 : 150
  const nominalBw = mediumRoute === 'fiber' ? 1000 : mediumRoute === 'copper' ? 100 : 54
  const effectiveRatio = Math.max(0.01, physical.effectiveBwMbps / nominalBw)
  const bwFactor = Math.max(0.2, Math.min(4.0, 1 / effectiveRatio))
  const probLossObstacles = obstaclesAffecting.length > 0
    ? Math.max(0, Math.min(0.75, (physical.attenuationDB - 5) / maxLossAtten))
    : 0
  const probLossCongestion = effectiveRatio < 0.30
    ? Math.min(0.40, (0.30 - effectiveRatio) / 0.30 * 0.40)
    : 0
  const probLoss = Math.min(0.95, probLossObstacles * bwFactor + probLossCongestion)
  const packetsLost = [1,2,3,4].filter(() => Math.random() < probLoss).length
  const received = 4 - packetsLost
  const lossPct = Math.round(packetsLost / 4 * 100)

  const result = received > 0
    ? `✅ Ping ${origin} → ${destination}: ${received}/4 paquetes · ~${latMs}ms · ${lossPct}% pérdida · BW ${physical.effectiveBwMbps}Mbps${obstaclesAffecting.length ? ` · ${obstaclesAffecting.length} obst.` : ''}`
    : `❌ Ping ${origin} → ${destination}: 0/4 paquetes · 100% pérdida (señal bloqueada ${physical.attenuationDB}dB)`

  return {
    success: true,
    msg: result,
  }
}
