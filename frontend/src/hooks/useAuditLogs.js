import { useEffect, useMemo } from 'react'
import { useNetProStore } from '../store/useNetProStore'
import { VIEWS, ROLES } from '../store/constants'

export function useAuditLogs() {
  const userRole = useNetProStore(s => s.userRole)
  const auditLogs = useNetProStore(s => s.auditLogs)
  const auditLogsFilter = useNetProStore(s => s.auditLogsFilter)
  const isLoading = useNetProStore(s => s.isLoading)
  const error = useNetProStore(s => s.error)
  const setAuditLogsFilter = useNetProStore(s => s.setAuditLogsFilter)
  const exportLogsCsv = useNetProStore(s => s.exportLogsCsv)
  const openLogViewer = useNetProStore(s => s.openLogViewer)
  const navigateTo = useNetProStore(s => s.navigateTo)
  const clearError = useNetProStore(s => s.clearError)

  useEffect(() => {
    if (userRole === ROLES.ENGINEER) navigateTo(VIEWS.DASHBOARD)
  }, [userRole, navigateTo])

  useEffect(() => {
    if (!isLoading && auditLogs.length === 0) {
      openLogViewer()
    }
  }, [isLoading, auditLogs.length, openLogViewer])

  const filteredLogs = useMemo(() => {
    const filter = auditLogsFilter.toLowerCase().trim()
    if (!filter) return auditLogs
    return auditLogs.filter(log => {
      const text = (log.detalle_cambio ?? '') + (log.fecha_hora ?? '')
      return text.toLowerCase().includes(filter)
    })
  }, [auditLogs, auditLogsFilter])

  const groupedLogs = useMemo(() => {
    const map = {}
    for (const log of filteredLogs) {
      const key = log.fecha_hora?.slice(0, 16) ?? 'Sin fecha'
      if (!map[key]) map[key] = []
      map[key].push(log)
    }
    return Object.entries(map)
  }, [filteredLogs])

  return {
    state: {
      auditLogs,
      auditLogsFilter,
      isLoading,
      error,
      filteredLogs,
      groupedLogs,
    },
    actions: {
      setAuditLogsFilter,
      exportLogsCsv,
      clearError,
      navigateTo,
    }
  }
}
