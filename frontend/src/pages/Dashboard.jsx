import { useDashboardLogic } from '../hooks/useDashboard'
import ProyectoCard from '../components/dashboard/ProyectoCard'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import ConfirmModal from '../components/ui/ConfirmModal'
import Modal from '../components/ui/Modal'

export default function Dashboard() {
  const {
    userName,
    projects,
    isLoading,
    error,
    copyProject,
    renameProject,
    openWorkspace,
    logout,
    isCreateModalOpen,
    setCreateModalOpen,
    newProjectName,
    setNewProjectName,
    projectToDelete,
    setProjectToDelete,
    handleCreateProject,
    handleDeleteProject,
  } = useDashboardLogic()

  return (
    <div className="min-h-screen bg-np-bg">
      <header className="bg-np-surface border-b border-np-border-strong px-5 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="primary" size="sm" onClick={logout}>
            Cerrar Sesión
          </Button>

          <div className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="var(--np-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            <span className="text-np-text font-bold text-sm tracking-wider">
              NETPRO
            </span>
            <span className="text-np-text-muted text-xs">
              | Dashboard de Proyectos | {userName && `Ing. ${userName}`}
            </span>
          </div>
        </div>

        <Button variant="primary" size="sm" onClick={() => setCreateModalOpen(true)}>
          + Agregar Proyecto
        </Button>
      </header>

      <main className="p-6">
        {error && (
          <div className="mb-4 p-2.5 bg-red-500/15 border border-np-danger rounded-sm text-np-danger text-xs">
            {error}
          </div>
        )}

        {isLoading && projects.length === 0 ? (
          <div className="text-center py-16 text-np-text-muted">
            Cargando proyectos…
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-4">
            {projects.map(p => (
              <ProyectoCard
                key={p.id_proyecto}
                proyecto={p}
                onAbrir={openWorkspace}
                onCopiar={copyProject}
                onRenombrar={renameProject}
                onEliminar={setProjectToDelete}
              />
            ))}

            <button
              onClick={() => setCreateModalOpen(true)}
              className="bg-np-surface border border-dashed border-np-border-strong rounded-sm min-h-[160px] flex flex-col items-center justify-center gap-2 cursor-pointer text-np-text-muted transition-all duration-150 hover:border-np-accent hover:text-np-accent"
            >
              <span className="text-3xl font-light leading-none">+</span>
              <span className="text-xs font-medium">Nuevo Proyecto</span>
            </button>
          </div>
        )}
      </main>

      <Modal
        open={isCreateModalOpen}
        title="Crear Nuevo Proyecto"
        onClose={() => { setCreateModalOpen(false); setNewProjectName('') }}
        footer={
          <>
            <Button variant="ghost" size="md" onClick={() => { setCreateModalOpen(false); setNewProjectName('') }} className="flex-1">
              Cancelar
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleCreateProject}
              disabled={!newProjectName.trim() || isLoading}
              className="flex-1"
            >
              Crear
            </Button>
          </>
        }
      >
        <Input
          autoFocus
          placeholder="Ingrese nombre del proyecto"
          value={newProjectName}
          onChange={e => setNewProjectName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreateProject()}
        />
      </Modal>

      <ConfirmModal
        open={!!projectToDelete}
        title="¿Eliminar proyecto?"
        message={`¿Estás seguro de que deseas eliminar la topología ${projectToDelete ? `"${projectToDelete.nombre}"` : ''}? Esta acción es permanente y no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        destructive
        onConfirm={handleDeleteProject}
        onCancel={() => setProjectToDelete(null)}
      />
    </div>
  )
}
