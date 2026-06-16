export function calculateVLSM(requiredHosts, baseIp = '192.168.1.0') {
  const n = parseInt(requiredHosts, 10)
  if (isNaN(n) || n < 1) throw new Error('Ingresa un número válido de hosts (≥ 1)')
  if (n > 16777214) throw new Error('Máximo soportado: 16 777 214 hosts')

  let bits = 1
  while (Math.pow(2, bits) - 2 < n) bits++

  const prefix = 32 - bits
  const totalAddresses = Math.pow(2, bits)
  const usableHosts = totalAddresses - 2

  const maskInt = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0
  const m = [
    (maskInt >>> 24) & 0xFF,
    (maskInt >>> 16) & 0xFF,
    (maskInt >>> 8)  & 0xFF,
    maskInt          & 0xFF,
  ]
  const mask = m.join('.')

  const parts = baseIp.split('.').map(Number)
  if (parts.length !== 4 || parts.some(isNaN)) {
    throw new Error('IP base inválida')
  }
  const ipInt = (parts[0] << 24 | parts[1] << 16 | parts[2] << 8 | parts[3]) >>> 0
  const networkInt = (ipInt & maskInt) >>> 0
  const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0

  const intToIp = v => [
    (v >>> 24) & 0xFF, (v >>> 16) & 0xFF, (v >>> 8) & 0xFF, v & 0xFF,
  ].join('.')

  const network       = intToIp(networkInt)
  const broadcast = intToIp(broadcastInt)
  const start    = intToIp(networkInt + 1)
  const end       = intToIp(broadcastInt - 1)

  return {
    requiredHosts: n,
    usableHosts,
    totalAddresses,
    prefix,
    mask,
    network,
    broadcast,
    start,
    end,
    baseIp,
  }
}
