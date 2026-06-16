function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)) }

export function applyCollisions(nodes) {
  if (!Array.isArray(nodes) || nodes.length === 0) return nodes || []
  const POS_BASE = {
    router:   [50, 18],
    firewall: [50, 18],
    switch:   [50, 45],
    server:   [20, 70],
    pc:       [70, 70],
    laptop:   [82, 42],
    wifi:     [18, 42],
    tablet:   [30, 80],
  }
  const count = {}
  const result = nodes.map((n) => {
    if (typeof n.x === 'number' && typeof n.y === 'number') return { ...n }
    const type = (n.type || 'pc').toLowerCase()
    const base = POS_BASE[type] || [50, 50]
    count[type] = (count[type] || 0) + 1
    const c = count[type] - 1
    return { ...n, x: clamp(base[0] + c * 14, 6, 94), y: clamp(base[1] + c * 8, 6, 94) }
  })

  const MIN_DIST = 12
  const MAX_ITER = 80
  for (let it = 0; it < MAX_ITER; it++) {
    let moved = false
    for (let i = 0; i < result.length; i++) {
      for (let j = i + 1; j < result.length; j++) {
        const a = result[i], b = result[j]
        const dx = b.x - a.x, dy = b.y - a.y
        const d = Math.hypot(dx, dy) || 0.001
        if (d < MIN_DIST) {
          const overlap = (MIN_DIST - d) / 2
          const ux = dx / d, uy = dy / d
          a.x = clamp(a.x - ux * overlap, 5, 95)
          a.y = clamp(a.y - uy * overlap, 5, 95)
          b.x = clamp(b.x + ux * overlap, 5, 95)
          b.y = clamp(b.y + uy * overlap, 5, 95)
          moved = true
        }
      }
    }
    if (!moved) break
  }
  return result
}
