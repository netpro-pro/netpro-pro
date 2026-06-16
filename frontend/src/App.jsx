import { useNetProStore } from './store/useNetProStore'
import { VIEWS } from './store/constants'
import Login            from './pages/Login'
import Dashboard        from './pages/Dashboard'
import Workspace        from './pages/Workspace'
import Editor           from './pages/Editor'
import Simulation       from './pages/Simulation'
import Report          from './pages/Report'
import Monitor          from './pages/Monitor'
import ConfigurationPage from './pages/ConfigurationPage'
import ProjectManagementPage from './pages/ProjectManagementPage'
import VisorLogs        from './pages/VisorLogs'
import VersionHistory from './pages/VersionHistory'

export default function App() {
  const vista = useNetProStore(s => s.currentView)
  const editingNode = useNetProStore(s => s.editingNode)

  switch (vista) {
    case VIEWS.LOGIN:               return <Login />
    case VIEWS.DASHBOARD:           return <Dashboard />
    case VIEWS.WORKSPACE:           return <Workspace />
    case VIEWS.EDITOR:              return <Editor key={editingNode?.id} />
    case VIEWS.SIMULATION:          return <Simulation />
    case VIEWS.REPORT:              return <Report />
    case VIEWS.MONITOR:             return <Monitor />
    case VIEWS.CONFIGURATION:       return <ConfigurationPage />
    case VIEWS.PROJECT_MANAGEMENT:   return <ProjectManagementPage />
    case VIEWS.LOG_VIEWER:          return <VisorLogs />
    case VIEWS.VERSION_HISTORY: return <VersionHistory />
    default:                         return <Login />
  }
}
