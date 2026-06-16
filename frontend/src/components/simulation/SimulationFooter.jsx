import SimulationLogWindow from './SimulationLogWindow'
import SimulationControls from './SimulationControls'

export default function SimulationFooter({
  logs,
  getLogColorByType,
  sourceNodeId,
  destinationNodeId,
  packetSize,
  nodeOptions,
  isSimulating,
  onSourceChange,
  onDestinationChange,
  onPacketSizeChange,
  onAddPacket,
}) {
  return (
    <div className="mx-2.5 mb-2.5 flex gap-2.5 pt-2 flex-shrink-0">
      <SimulationLogWindow
        logs={logs}
        getLogColorByType={getLogColorByType}
      />
      <SimulationControls
        sourceNodeId={sourceNodeId}
        destinationNodeId={destinationNodeId}
        packetSize={packetSize}
        nodeOptions={nodeOptions}
        isSimulating={isSimulating}
        onSourceChange={onSourceChange}
        onDestinationChange={onDestinationChange}
        onPacketSizeChange={onPacketSizeChange}
        onAddPacket={onAddPacket}
      />
    </div>
  )
}