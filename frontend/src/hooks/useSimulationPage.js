import { useState, useCallback } from 'react'
import { useNetProStore } from '../store/useNetProStore'
import { VIEWS } from '../store/constants'
import { useSimulationEngine } from '../hooks/useSimulationEngine'

export function useSimulationPage() {
  const userName = useNetProStore(s => s.userName)
  const sessionLogs = useNetProStore(s => s.sessionLogs)
  const isLoading = useNetProStore(s => s.isLoading)
  const navigateTo = useNetProStore(s => s.navigateTo)

  const {
    isSimulating,
    failedLinks,
    localLogs,
    sourceNodeId,
    setSourceNodeId,
    destinationNodeId,
    setDestinationNodeId,
    packetSize,
    setPacketSize,
    areaMessage,
    startSimulation,
    stopSimulation,
    clearSimulationLogs,
  } = useSimulationEngine()

  const canvasNodes = useNetProStore(s => s.canvasNodes)
  const canvasLinks = useNetProStore(s => s.canvasLinks)
  const canvasObstacles = useNetProStore(s => s.canvasObstacles) || []
  const cliConfig = useNetProStore(s => s.cliConfig) || { bandwidth: {}, networkSpeed: {} }

  const [isClearLogsModalOpen, setIsClearLogsModalOpen] = useState(false)

  const allLogs = [
    ...sessionLogs.map(l => ({ ...l, source: 'store' })),
    ...localLogs,
  ].sort((a, b) => new Date(a.ts) - new Date(b.ts))

  const navigateToReport = useCallback(() => navigateTo(VIEWS.REPORT), [navigateTo])

  const getLogColorByType = useCallback((type) => {
    switch (type) {
      case 'success': return '#3fb950'
      case 'error': return '#D40F0F'
      case 'warning': return '#e3a520'
      default: return '#a8b8c8'
    }
  }, [])

  const nodeOptions = canvasNodes.map(n => n.id)

  const openClearLogsModal = useCallback(() => setIsClearLogsModalOpen(true), [])
  const cancelClearLogs = useCallback(() => setIsClearLogsModalOpen(false), [])
  const confirmClearLogs = useCallback(() => {
    clearSimulationLogs()
    setIsClearLogsModalOpen(false)
  }, [clearSimulationLogs])

  return {
    userName,
    isSimulating,
    failedLinks,
    areaMessage,
    isLoading,
    isClearLogsModalOpen,
    allLogs,
    sourceNodeId,
    destinationNodeId,
    packetSize,
    nodeOptions,
    canvasNodes,
    canvasLinks,
    canvasObstacles,
    cliConfig,
    getLogColorByType,
    navigateToReport,
    openClearLogsModal,
    cancelClearLogs,
    confirmClearLogs,
    setSourceNodeId,
    setDestinationNodeId,
    setPacketSize,
    startSimulation,
    stopSimulation,
  }
}