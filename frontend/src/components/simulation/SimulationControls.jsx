import Input from '../ui/Input'
import Button from '../ui/Button'

const PACKET_SIZE_OPTIONS = ['10KB', '10MB', '100MB', '1GB', '10GB', '100GB']

export default function SimulationControls({
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
    <div className="flex flex-col gap-1.5 min-w-[460px]">
      <div className="h-4.5" />
      <div className="flex gap-2 items-end">
        <div className="flex flex-col gap-1">
          <label className="np-label text-np-text-muted font-mono tracking-wider uppercase text-[0.68rem]">
            Origen
          </label>
          <Input
            value={sourceNodeId}
            onChange={onSourceChange}
            listId="dl-source"
            options={nodeOptions}
            placeholder="PC 1"
            className="w-[140px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="np-label text-np-text-muted font-mono tracking-wider uppercase text-[0.68rem]">
            Destino
          </label>
          <Input
            value={destinationNodeId}
            onChange={onDestinationChange}
            listId="dl-destination"
            options={nodeOptions}
            placeholder="Celular 1"
            className="w-[140px]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="np-label text-np-text-muted font-mono tracking-wider uppercase text-[0.68rem]">
            Tamaño Paquete
          </label>
          <Input
            value={packetSize}
            onChange={onPacketSizeChange}
            listId="dl-packet-size"
            options={PACKET_SIZE_OPTIONS}
            placeholder="10KB"
            className="w-[130px]"
          />
        </div>
        <Button
          variant="primary"
          onClick={onAddPacket}
          disabled={isSimulating || !sourceNodeId || !destinationNodeId}
          className="h-8"
        >
          Añadir paquete
        </Button>
      </div>
    </div>
  )
}