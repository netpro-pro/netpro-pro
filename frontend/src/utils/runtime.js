export const isTauri =
  typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

export async function invokeTauri(command, args) {
  if (!isTauri) return null
  const { invoke } = await import('@tauri-apps/api/core')
  return invoke(command, args)
}

export async function getRuntimeInfo() {
  return invokeTauri('runtime_info')
}
