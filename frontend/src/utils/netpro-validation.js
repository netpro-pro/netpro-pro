import { ROLES } from '../store/constants'

export function isProtectedSuperadmin(u) {
  if (!u) return false
  if (typeof u.name === 'string' && u.name.trim().toLowerCase() === 'superadmin') return true
  if (u.id_rol === ROLES.SUPERADMIN) return true
  return false
}

export function validateNodeConfig(changes) {
  const ip = (changes?.ip ?? '').trim()
  const mask = (changes?.mask ?? '').trim()
  if (!ip)   return { ok: false, error: 'La IP es obligatoria antes de transferir.' }
  if (!mask) return { ok: false, error: 'La Máscara de Red es obligatoria antes de transferir.' }
  if (!isValidIPv4(ip))   return { ok: false, error: `IP inválida: ${ip}` }
  if (!isValidMask(mask)) return { ok: false, error: `Máscara inválida: ${mask}` }
  if (changes?.dhcp === true) {
    return { ok: false, error: 'DHCP debe estar DESACTIVADO antes de transferir.' }
  }
  return { ok: true }
}

export function isValidIPv4(ip) {
  const m = String(ip).match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (!m) return false
  return m.slice(1, 5).every(p => {
    const n = +p
    return n >= 0 && n <= 255
  })
}

export function isValidMask(mask) {
  if (!isValidIPv4(mask)) return false
  const parts = mask.split('.').map(Number)
  const bin = parts.map(p => p.toString(2).padStart(8, '0')).join('')
  // Debe ser N unos seguidos de M ceros (contigua)
  return /^1*0*$/.test(bin)
}
