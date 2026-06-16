import { useState } from 'react'
import { useNetProStore } from '../store/useNetProStore'
import { VIEWS } from '../store/constants'

export function useWorkspace() {
  const userName = useNetProStore(s => s.userName)
  const projectName = useNetProStore(s => s.activeProjectName)
  const code = useNetProStore(s => s.currentCode)
  const canvasNodes = useNetProStore(s => s.canvasNodes)
  const canvasLinks = useNetProStore(s => s.canvasLinks)
  const canvasObstacles = useNetProStore(s => s.canvasObstacles) || []
  const sessionLogs = useNetProStore(s => s.sessionLogs)
  const currentVersion = useNetProStore(s => s.currentVersion)
  const isLoading = useNetProStore(s => s.isLoading)
  const error = useNetProStore(s => s.error)
  
  const updateCode = useNetProStore(s => s.updateCode)
  const saveVersion = useNetProStore(s => s.saveVersion)
  const openEditor = useNetProStore(s => s.openEditor)
  const navigateTo = useNetProStore(s => s.navigateTo)
  const clearError = useNetProStore(s => s.clearError)
  const simulationResults = useNetProStore(s => s.simulationResults) || []

  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [tab, setTab] = useState('canvas') // 'canvas' | 'logs'

  const hasMetrics = !!(currentVersion?.data_json?.metricas)
  const canReport = simulationResults.length > 0 || hasMetrics

  async function handleSave() {
    setIsSaving(true)
    try {
      await saveVersion()
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2800)
    } finally {
      setIsSaving(false)
    }
  }

  return {
    state: {
      userName,
      projectName,
      code,
      canvasNodes,
      canvasLinks,
      canvasObstacles,
      sessionLogs,
      currentVersion,
      isLoading,
      error,
      isSaving,
      saveSuccess,
      tab,
      canReport,
    },
    actions: {
      updateCode,
      handleSave,
      setTab,
      openEditor,
      navigateTo,
      clearError,
    }
  }
}
