import React from 'react'
import { useNetProStore } from '../store/useNetProStore'
import { VIEWS } from '../store/constants'
import ConfirmModal from '../components/ui/ConfirmModal'
import SimulationCanvas from '../components/simulation/SimulationCanvas'
import SimulationHeader from '../components/simulation/SimulationHeader'
import SimulationFooter from '../components/simulation/SimulationFooter'
import { useSimulationPage } from '../hooks/useSimulationPage'

const STYLES = {
  page: {
    minHeight: '100vh',
    background: 'var(--np-bg)',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Roboto, system-ui, sans-serif',
  },
  canvasContainer: {
    margin: '10px 10px 0',
    flex: '1 0 0',
    minHeight: 0,
    background: '#0c1e2e',
    border: '1px solid var(--np-border-strong)',
    borderRadius: '4px',
    position: 'relative',
    overflow: 'hidden',
  },
  areaMessage: {
    position: 'absolute',
    top: 10,
    right: 12,
    background: 'rgba(0,96,127,0.85)',
    border: '1px solid var(--np-accent)',
    borderRadius: 3,
    padding: '3px 10px',
    fontSize: '0.72rem',
    fontFamily: 'JetBrains Mono, monospace',
    color: '#53EEFF',
    backdropFilter: 'blur(4px)',
  },
}

export default function Simulation() {
  const { userName, navigateTo } = useNetProStore()

  const {
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
  } = useSimulationPage()

  return (
    <div style={STYLES.page}>
      <ConfirmModal
        open={isClearLogsModalOpen}
        title="¿Limpiar logs y reporte?"
        message="Se eliminarán todos los logs de simulación y los resultados del reporte. La topología del diagrama no se modifica. ¿Deseas continuar?"
        confirmText="Sí, limpiar todo"
        cancelText="Cancelar"
        destructive={true}
        onConfirm={confirmClearLogs}
        onCancel={cancelClearLogs}
      />

      <SimulationHeader
        userName={userName}
        isSimulating={isSimulating}
        isLoading={isLoading}
        onNavigateToWorkspace={() => navigateTo(VIEWS.WORKSPACE)}
        onOpenClearLogsModal={openClearLogsModal}
        onNavigateToReport={navigateToReport}
        onStopSimulation={stopSimulation}
        onStartSimulation={startSimulation}
      />

      <div style={STYLES.canvasContainer}>
        <SimulationCanvas
          nodes={canvasNodes}
          links={canvasLinks}
          isSimulating={isSimulating}
          failedLinks={failedLinks}
          obstacles={canvasObstacles}
          cliConfig={cliConfig}
        />
        {areaMessage && <div style={STYLES.areaMessage}>{areaMessage}</div>}
      </div>

      <SimulationFooter
        logs={allLogs}
        getLogColorByType={getLogColorByType}
        sourceNodeId={sourceNodeId}
        destinationNodeId={destinationNodeId}
        packetSize={packetSize}
        nodeOptions={nodeOptions}
        isSimulating={isSimulating}
        onSourceChange={e => setSourceNodeId(e.target.value)}
        onDestinationChange={e => setDestinationNodeId(e.target.value)}
        onPacketSizeChange={e => setPacketSize(e.target.value)}
        onAddPacket={startSimulation}
      />
    </div>
  )
}