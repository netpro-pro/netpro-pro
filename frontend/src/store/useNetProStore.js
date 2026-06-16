import { create } from 'zustand'
import { VIEWS } from './constants'
import { createUiSlice } from './slices/uiSlice'
import { createAuthSlice } from './slices/authSlice'
import { createProjectSlice } from './slices/projectSlice'
import { createWorkspaceSlice } from './slices/workspaceSlice'
import { createAdminSlice } from './slices/adminSlice'
import { createManagementSlice } from './slices/managementSlice'

const initialState = {
  // UI
  currentView: VIEWS.LOGIN,
  isLoading: false,
  error: null,
  sessionLogs: [],
  // Auth
  userId: null,
  userName: null,
  userRole: null,
  isAuthenticated: false,
  // Project
  projects: [],
  activeProjectId: null,
  activeProjectName: null,
  // Workspace
  currentCode: '',
  currentVersion: null,
  canvasNodes: [],
  canvasLinks: [],
  canvasObstacles: [],
  cliConfig: { bandwidth: null, networkSpeed: null },
  editingNode: null,
  simulationResult: null,
  simulationResults: [],
  lastPackets: [],
  // Admin
  users: [],
  roles: [],
  // Management
  managedProjectId: null,
  managedProjectName: null,
  recentActivities: [],
  auditLogs: [],
  auditLogsFilter: '',
  versionHistory: [],
  selectedVersions: [],
  versionComparison: null,
}

export const useNetProStore = create((set, get) => ({
  ...initialState,
  ...createUiSlice(set, get),
  ...createAuthSlice(set, get),
  ...createProjectSlice(set, get),
  ...createWorkspaceSlice(set, get),
  ...createAdminSlice(set, get),
  ...createManagementSlice(set, get),

  logout: () => set(initialState), // Full reset to initial state
}))
