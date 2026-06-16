import { useState, useEffect } from 'react'
import { useNetProStore } from '../store/useNetProStore'
import { VIEWS, ROLES } from '../store/constants'

export function useVersionHistory() {
  const userRole = useNetProStore(s => s.userRole)
  const versionHistory = useNetProStore(s => s.versionHistory)
  const selectedVersions = useNetProStore(s => s.selectedVersions)
  const versionComparison = useNetProStore(s => s.versionComparison)
  const isLoading = useNetProStore(s => s.isLoading)
  const error = useNetProStore(s => s.error)
  
  const toggleVersionSelection = useNetProStore(s => s.toggleVersionSelection)
  const compareSelectedVersions = useNetProStore(s => s.compareSelectedVersions)
  const openVersionHistory = useNetProStore(s => s.openVersionHistory)
  const navigateTo = useNetProStore(s => s.navigateTo)
  const clearError = useNetProStore(s => s.clearError)

  const [inspectedVersion, setInspectedVersion] = useState(null)

  useEffect(() => {
    if (userRole === ROLES.ENGINEER) {
      navigateTo(VIEWS.DASHBOARD)
    }
  }, [userRole, navigateTo])

  useEffect(() => {
    if (!isLoading && versionHistory.length === 0) {
      openVersionHistory()
    }
  }, [isLoading, versionHistory.length, openVersionHistory])

  const canCompare = selectedVersions.length === 2

  const handleCompare = () => {
    if (canCompare) {
      compareSelectedVersions()
    }
  }

  const handleViewDetail = (version) => {
    setInspectedVersion(version)
  }

  const closeInspection = () => {
    setInspectedVersion(null)
  }

  return {
    state: {
      versionHistory,
      selectedVersions,
      versionComparison,
      isLoading,
      error,
      inspectedVersion,
      canCompare,
    },
    actions: {
      toggleVersionSelection,
      handleCompare,
      handleViewDetail,
      closeInspection,
      clearError,
      navigateTo,
    }
  }
}
