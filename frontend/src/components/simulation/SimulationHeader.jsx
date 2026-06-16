import Button from '../ui/Button'

export default function SimulationHeader({
  userName,
  isSimulating,
  isLoading,
  onNavigateToWorkspace,
  onOpenClearLogsModal,
  onNavigateToReport,
  onStopSimulation,
  onStartSimulation,
}) {
  return (
    <header className="bg-np-surface border-b border-np-border-strong px-4 py-2 flex items-center justify-between gap-2 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--np-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 a15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span className="font-bold text-np-text text-sm tracking-wide">NETPRO</span>
        <span className="text-np-text-muted text-xs">| Simulación</span>
        {userName && (
          <span className="text-np-text-dim text-xs">| Ing. {userName}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isSimulating && (
          <div className="flex items-center gap-1.5 text-[#3fb950] text-xs font-mono animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] inline-block" />
            SIMULANDO
          </div>
        )}

        <Button variant="ghost" size="sm" onClick={onNavigateToWorkspace}>
          Volver
        </Button>
        <Button variant="danger" size="sm" onClick={onOpenClearLogsModal}>
          Limpiar
        </Button>
        <Button variant="primary" size="sm" onClick={onNavigateToReport}>
          Reporte
        </Button>
        {isSimulating ? (
          <Button variant="warning" size="sm" onClick={onStopSimulation}>
            Detener
          </Button>
        ) : (
          <Button variant="primary" size="sm" onClick={onStartSimulation} disabled={isLoading}>
            Simular
          </Button>
        )}
      </div>
    </header>
  )
}