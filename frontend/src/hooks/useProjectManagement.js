import { useEffect } from 'react'
import { useNetProStore } from '../store/useNetProStore'
import { VIEWS, ROLES } from '../store/constants'

export function useProjectManagementLogic() {
  const store = useNetProStore()

  const {
    userRole,
    userName,
    managedProjectId,
    managedProjectName,
    recentActivities,
    isLoading,
    error,
    reloadActivities,
    navigateTo,
    logout,
    clearError,
    openLogViewer,
    openVersionHistory,
  } = store

  useEffect(() => {
    if (userRole === ROLES.ENGINEER) {
      navigateTo(VIEWS.DASHBOARD)
    }
  }, [userRole, navigateTo])

  useEffect(() => {
    if (managedProjectId && recentActivities.length === 0 && !isLoading) {
      reloadActivities()
    }
  }, [managedProjectId, recentActivities.length, isLoading, reloadActivities])

  const handleGoToLogs = () => {
    openLogViewer()
  }

  const handleGoToVersions = () => {
    openVersionHistory()
  }

  return {
    userRole,
    userName,
    managedProjectId,
    managedProjectName,
    recentActivities,
    isLoading,
    error,
    reloadActivities,
    navigateTo,
    logout,
    clearError,
    handleGoToLogs,
    handleGoToVersions,
  }
}
