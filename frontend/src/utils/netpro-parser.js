export function parseNetProCode(code) {
  const nodes = [], links = [], obstacles = []
  const cli = { bandwidth: null, networkSpeed: null }
  if (!code?.trim()) return { nodes, links, obstacles, cli }

  for (const line of code.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('//')) continue

    const dm = t.match(/^device\s+(\S+)\s+type\s+(\w+)\s*\{([^}]*)\}/)
    if (dm) { nodes.push({ id: dm[1], type: dm[2], ...parseAttrs(dm[3]) }); continue }

    const cm = t.match(/^conectar\s+(\S+)\s+a\s+(\S+)\s+medio\s+(\w+)(.*)$/)
    if (cm) {
      const extra = parseLinearAttrs(cm[4] || '')
      links.push({
        origin: cm[1],
        destination: cm[2],
        medium: cm[3],
        distanceKm: extra.distancia ?? extra.distanciaKm ?? null,
      })
      continue
    }

    const wm = t.match(/^(?:wall|obstaculo)\s+(\S+)\s+at\s+(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)\s+size\s+(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)\s+material\s+(\w+)(?:\s+grosor\s+(\d+(?:\.\d+)?))?/i)
    if (wm) {
      obstacles.push({
        id: wm[1],
        x: parseFloat(wm[2]), y: parseFloat(wm[3]),
        w: parseFloat(wm[4]), h: parseFloat(wm[5]),
        material: wm[6].toLowerCase(),
        thicknessCm: wm[7] ? parseFloat(wm[7]) : 10,
      })
      continue
    }

    const bm = t.match(/^bandwidth\s+(\w+)\s+(\d+(?:\.\d+)?)\s*(mbps|gbps)?/i)
    if (bm) {
      const val = parseFloat(bm[2]) * (bm[3]?.toLowerCase() === 'gbps' ? 1000 : 1)
      cli.bandwidth = { ...(cli.bandwidth || {}), [bm[1].toLowerCase()]: val }
      continue
    }

    const nm = t.match(/^network\s+speed\s+(\w+)\s+(\d+(?:\.\d+)?)\s*(mbps|gbps)?/i)
    if (nm) {
      const val = parseFloat(nm[2]) * (nm[3]?.toLowerCase() === 'gbps' ? 1000 : 1)
      cli.networkSpeed = { ...(cli.networkSpeed || {}), [nm[1].toLowerCase()]: val }
      continue
    }
  }
  return { nodes, links, obstacles, cli }
}

function parseAttrs(attrStr) {
  const attrs = {}
  if (!attrStr?.trim()) return attrs
  for (const pair of attrStr.split(',')) {
    const [key, ...rest] = pair.split(':')
    if (!key) continue
    const k = key.trim()
    const val = rest.join(':').trim().replace(/^["']|["']$/g, '')
    if (val === 'true') attrs[key] = true
    else if (val === 'false') attrs[key] = false
    else if (!isNaN(Number(val)) && val !== '') attrs[key] = Number(val)
    else attrs[key] = val
  }
  return attrs
}

function parseLinearAttrs(s) {
  const out = {}
  const re = /(\w+)\s*[:=]\s*([^\s,]+)/g
  let m
  while ((m = re.exec(s))) {
    const k = m[1], v = m[2].replace(/^["']|["']$/g, '')
    out[k] = isNaN(Number(v)) ? v : Number(v)
  }
  return out
}

function capitalize(s) {
  if (!s) return ''
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
}

export function diffTopologies(oldCode, newCode) {
  const prev = parseNetProCode(oldCode)
  const current = parseNetProCode(newCode)
  const changes = []

  const index = (arr) => Object.fromEntries(arr.map(n => [n.id, n]))
  const prevNodes = index(prev.nodes)
  const currentNodes = index(current.nodes)

  for (const id of Object.keys(currentNodes)) {
    if (!prevNodes[id]) {
      const type = capitalize(currentNodes[id].type)
      changes.push(`[${id}] - [Adición de equipo] - [Ninguno] - [${type}]`)
      if (currentNodes[id].ip) {
        changes.push(
          `--- [${id}] - [Modificación Dirección IP] - [0.0.0.0] - [${currentNodes[id].ip}]`
        )
      }
    }
  }

  for (const id of Object.keys(prevNodes)) {
    if (!currentNodes[id]) {
      const type = capitalize(prevNodes[id].type)
      changes.push(`[${id}] - [Eliminación de equipo] - [${type}] - [Ninguno]`)
    }
  }

  for (const id of Object.keys(currentNodes)) {
    if (!prevNodes[id]) continue
    const a = prevNodes[id], b = currentNodes[id]
    if ((a.ip ?? '') !== (b.ip ?? '')) {
      changes.push(
        `[${id}] - [Modificación Dirección IP] - [${a.ip || '0.0.0.0'}] - [${b.ip || '0.0.0.0'}]`
      )
    }
    if ((a.mask ?? '') !== (b.mask ?? '')) {
      changes.push(
        `[${id}] - [Modificación Máscara] - [${a.mask || '—'}] - [${b.mask || '—'}]`
      )
    }
    if ((a.label ?? '') !== (b.label ?? '')) {
      changes.push(
        `[${id}] - [Cambio de etiqueta] - [${a.label || '—'}] - [${b.label || '—'}]`
      )
    }
  }

  const linkKey = (e) => `${e.origin}-${e.destination}-${e.medium}`
  const prevLinks = new Set(prev.links.map(linkKey))
  const currentLinks = new Set(current.links.map(linkKey))
  for (const e of current.links) {
    if (!prevLinks.has(linkKey(e))) {
      changes.push(
        `[${e.origin}↔${e.destination}] - [Adición de enlace] - [Ninguno] - [${e.medium}]`
      )
    }
  }
  for (const e of prev.links) {
    if (!currentLinks.has(linkKey(e))) {
      changes.push(
        `[${e.origin}↔${e.destination}] - [Eliminación de enlace] - [${e.medium}] - [Ninguno]`
      )
    }
  }

  if (changes.length === 0 && oldCode.trim() !== newCode.trim()) {
    changes.push(
      `[Engine_CLI] - [Modificación de código NetPro Engine] - [Script_Anterior] - [Script_Actual]`
    )
  }

  return changes
}

export function updateGlobalIPs(currentCode, { search, replacement, transformFn }) {
  if (!currentCode) return { ok: false, error: 'No hay código que modificar' }
  let count = 0
  const updatedCode = currentCode.replace(/ip:\s*"([^"]+)"/g, (m, ip) => {
    let newValue = ip
    if (typeof transformFn === 'function') {
      const r = transformFn(ip)
      if (r && r !== ip) newValue = r
    } else if (search && replacement !== undefined && ip.startsWith(search)) {
      newValue = replacement + ip.slice(search.length)
    }
    if (newValue !== ip) count++
    return `ip: "${newValue}"`
  })
  return { ok: true, count, updatedCode }
}
