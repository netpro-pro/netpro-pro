import { useState, useEffect } from 'react'
import { useNetProStore } from '../store/useNetProStore'

export function useDashboardLogic() {
  const store = useNetProStore()
  
  const [isCreateModalOpen, setCreateModalOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [projectToDelete, setProjectToDelete] = useState(null)

  useEffect(() => {
    if (store.projects.length === 0) {
      store.loadProjects()
    }
  }, [store.projects.length, store.loadProjects])

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return
    try {
      await store.createProject(newProjectName)
      setNewProjectName('')
      setCreateModalOpen(false)
    } catch (err) {
      console.error('Error creating project:', err)
    }
  }

  const handleDeleteProject = async () => {
    if (!projectToDelete) return
    try {
      await store.deleteProject(projectToDelete.id_proyecto)
    } catch (err) {
      console.error('Error deleting project:', err)
    } finally {
      setProjectToDelete(null)
    }
  }

  return {
    // State from store
    userName: store.userName,
    projects: store.projects,
    isLoading: store.isLoading,
    error: store.error,
    
    // Actions from store
    copyProject: store.copyProject,
    renameProject: store.renameProject,
    openWorkspace: store.openWorkspace,
    logout: store.logout,
    
    // Local state
    isCreateModalOpen,
    setCreateModalOpen,
    newProjectName,
    setNewProjectName,
    projectToDelete,
    setProjectToDelete,
    
    // Handlers
    handleCreateProject,
    handleDeleteProject,
  }
}
