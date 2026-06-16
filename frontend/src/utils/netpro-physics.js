import { MEDIUM_PROPS, OBSTACLE_ATTENUATION } from '../store/constants'

export function packetSizeToBits(size) {
  if (typeof size === 'number') return size * 8
  const m = String(size).trim().match(/^([\d.]+)\s*(KB|MB|GB|TB|B)?$/i)
  if (!m) return 10 * 1024 * 8 // default 10KB
  const n = parseFloat(m[1])
  const unit = (m[2] || 'B').toUpperCase()
  const bytes = n * ({ B: 1, KB: 1024, MB: 1024**2, GB: 1024**3, TB: 1024**4 }[unit] || 1)
  return bytes * 8
}

export function getNodesDistance(a, b) {
  const ax = a?.x ?? 0, ay = a?.y ?? 0
  const bx = b?.x ?? 0, by = b?.y ?? 0
  return Math.hypot(bx - ax, by - ay)
}

export function canvasDistanceToKm(distPct, canvasWidthM = 50) {
  return (distPct / 100) * canvasWidthM / 1000
}

export function calculateLinkLatency({
  medium = 'copper',
  distanceKm = 0.05,          
  packetSizeBits,               
  obstacles = [],               
  bandwidthOverride = null,      
}) {
  const props = MEDIUM_PROPS[medium] || MEDIUM_PROPS.copper
  const bits = packetSizeBits || packetSizeToBits('10KB')

  let attenuationDB = props.atenDB_per_km * distanceKm
  const mediumFactor = medium === 'wireless' ? 1.0 : medium === 'copper' ? 0.20 : 0.05
  for (const o of obstacles) {
    const a = (OBSTACLE_ATTENUATION[o.material] ?? 1.0) * (o.thicknessCm ?? 5)
    attenuationDB += a * mediumFactor
  }

  const bwBase = bandwidthOverride ?? props.bw
  const factor = Math.max(0.05, 1 / (1 + attenuationDB / 30))
  const bwEfMbps = bwBase * factor

  const tPropMs = (distanceKm / props.vProp) * 1000
  const tTxMs   = (bits / (bwEfMbps * 1e6)) * 1000
  const tInterfMs = obstacles.length > 0
    ? Math.min(medium === 'wireless' ? 50 : medium === 'copper' ? 10 : 2, attenuationDB * (medium === 'wireless' ? 0.15 : 0.03))
    : 0

  return {
    medium,
    distanceKm,
    attenuationDB: Math.round(attenuationDB * 10) / 10,
    effectiveBwMbps: Math.round(bwEfMbps * 10) / 10,
    tPropMs:   Math.round(tPropMs   * 1000) / 1000,
    tTxMs:     Math.round(tTxMs     * 1000) / 1000,
    tInterfMs: Math.round(tInterfMs * 1000) / 1000,
    totalLatencyMs: Math.max(0.1, Math.round((tPropMs + tTxMs + tInterfMs) * 100) / 100),
  }
}

export function segmentIntersectsRect(ax, ay, bx, by, obs) {
  const { x, y, w, h } = obs
  const minX = Math.min(ax, bx), maxX = Math.max(ax, bx)
  const minY = Math.min(ay, by), maxY = Math.max(ay, by)
  if (maxX < x || minX > x + w) return false
  if (maxY < y || minY > y + h) return false

  const t0 = 0, t1 = 1
  const dx = bx - ax, dy = by - ay
  const p = [-dx, dx, -dy, dy]
  const q = [ax - x, x + w - ax, ay - y, y + h - ay]
  let u0 = t0, u1 = t1
  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) {
      if (q[i] < 0) return false
    } else {
      const r = q[i] / p[i]
      if (p[i] < 0) { if (r > u1) return false; if (r > u0) u0 = r }
      else          { if (r < u0) return false; if (r < u1) u1 = r }
    }
  }
  return u0 <= u1
}
