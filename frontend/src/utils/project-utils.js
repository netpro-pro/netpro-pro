export function generateUniqueName(base, existingNames) {
  if (!existingNames.has(base)) return base
  const m = base.match(/^(.*?)(?:\s*\((\d+)\))?\s*$/)
  const root = (m?.[1] ?? base).trim()
  let i = 1
  while (existingNames.has(`${root} (${i})`)) i++
  return `${root} (${i})`
}
