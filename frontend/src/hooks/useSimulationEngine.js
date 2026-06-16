import { useState, useCallback } from 'react'
import { 
  useNetProStore, 
} from '../store/useNetProStore'
import { 
  calculateLinkLatency, 
  packetSizeToBits, 
  getNodesDistance, 
  canvasDistanceToKm, 
  segmentIntersectsRect 
} from '../utils/netpro-physics'
import { findShortestPath, calculateSimulationMetrics } from '../utils/simulation-utils'

const SIM_TIMINGS = {
  ROUTE_LOG_DELAY: 300,
  METRICS_LOG_DELAY: 700,
  PACKET_START_DELAY: 900,
  PACKET_INTERVAL: 400,
  FINAL_RESULT_OFFSET: 300,
}

export function useSimulationEngine() {
  const canvasNodes = useNetProStore(s => s.canvasNodes)
  const canvasLinks = useNetProStore(s => s.canvasLinks)
  const canvasObstacles = useNetProStore(s => s.canvasObstacles) || []
  const cliConfig = useNetProStore(s => s.cliConfig) || { bandwidth: {}, networkSpeed: {} }
  const addSessionLog = useNetProStore(s => s.addSessionLog)
  const saveSimulationResult = useNetProStore(s => s.saveSimulationResult)
  const saveLastPackets = useNetProStore(s => s.saveLastPackets)
  const clearSessionLogsStore = useNetProStore(s => s.clearSessionLogs)
  const clearSimulationsStore = useNetProStore(s => s.clearSimulations)

  const [isSimulating, setIsSimulating] = useState(false)
  const [failedLinks, setFailedLinks] = useState([])
  const [localLogs, setLocalLogs] = useState([])
  const [sourceNodeId, setSourceNodeId] = useState('')
  const [destinationNodeId, setDestinationNodeId] = useState('')
  const [packetSize, setPacketSize] = useState('10KB')
  const [areaMessage, setAreaMessage] = useState('')

  const addLog = useCallback((msg, type = 'info') => {
    setLocalLogs(prev => [...prev, {
      ts: new Date().toISOString(),
      msg,
      type, 
      source: 'engine',
    }])
  }, [])

  const startSimulation = useCallback(() => {
    const src = sourceNodeId.trim()
    const dst = destinationNodeId.trim()

    if (!src || !dst) {
      addLog('⚠️  Especifica Origen y Destino antes de simular.', 'warning')
      return
    }

    if (!canvasNodes.some(n => n.id === src)) {
      addLog(`❌ Nodo origen no encontrado: ${src}`, 'error')
      return
    }
    if (!canvasNodes.some(n => n.id === dst)) {
      addLog(`❌ Nodo destino no encontrado: ${dst}`, 'error')
      return
    }

    const path = findShortestPath(src, dst, canvasLinks)

    if (!path) {
      addLog(`❌ No existe ruta entre ${src} y ${dst} — nodos inalcanzables.`, 'error')
      addSessionLog(`❌ No existe ruta entre ${src} y ${dst} — nodos inalcanzables.`)
       saveSimulationResult({
         origin: src, destination: dst,
         latency: 0, hops: 0, packetSize: packetSize,
         loss: 100, medium: 'N/A', distanceM: 0,
         effectiveBwMbps: 0, attenuationDB: 0, obstacles: 0,
       })
      return
    }

    const bitsSize = packetSizeToBits(packetSize)
    const metrics = calculateSimulationMetrics(
      path, canvasNodes, canvasLinks, canvasObstacles, cliConfig, bitsSize,
      calculateLinkLatency, getNodesDistance, canvasDistanceToKm, segmentIntersectsRect
    )

    const {
      hops,
      accumulatedLatencyMs,
      accumulatedAttenuationDB,
      minEffectiveBW,
      totalObstacles,
      usedMedia,
      totalDistanceM,
    } = metrics

    const baseLatencyMs = Math.max(1, Math.round(accumulatedLatencyMs))
    const mediaStr = [...usedMedia].join('+')

    setIsSimulating(true)
    addLog(`🔄 Iniciando simulación: ping ${src} → ${dst} (${packetSize})`, 'info')
    addSessionLog(`🔄 Iniciando simulación: ping ${src} → ${dst} (${packetSize})`)

    const packetsSent = 4
    const baseTime = baseLatencyMs
    const capturedLatencies = []
    const individualPackets = []  
    
    setTimeout(() => {
      addLog(`📡 Ruta: ${path.join(' → ')} (${hops} salto(s))`, 'info')
    }, SIM_TIMINGS.ROUTE_LOG_DELAY)

    setTimeout(() => {
      const parts = [
        `🔗 Medios: ${mediaStr}`,
        `dist ${totalDistanceM.toFixed(1)}m`,
        `BW cuello de botella ${minEffectiveBW.toFixed(1)}Mbps`,
        `lat ~${baseLatencyMs}ms`,
      ]
      if (totalObstacles > 0) parts.push(`atenuación ${accumulatedAttenuationDB.toFixed(1)}dB (${totalObstacles} obst.)`)
      
      const activeCli = [...usedMedia]
        .map(m => {
          const v = cliConfig.bandwidth?.[m] ?? cliConfig.networkSpeed?.[m]
          return v != null ? `${m}=${v}Mbps` : null
        })
        .filter(Boolean)
      if (activeCli.length) parts.push(`CLI: ${activeCli.join(', ')}`)
      
      addLog(parts.join(' · '), 'info')
      addSessionLog(`🔗 ${mediaStr} · ${hops} salto(s) · BW ${minEffectiveBW.toFixed(1)}Mbps · ${baseLatencyMs}ms`)
    }, SIM_TIMINGS.METRICS_LOG_DELAY)

    const worstMedium = [...usedMedia].reduce((worst, m) => {
      const bwN = m === 'fiber' ? 1000 : m === 'copper' ? 100 : 54
      const worstBwN = worst === 'fiber' ? 1000 : worst === 'copper' ? 100 : 54
      return bwN < worstBwN ? m : worst
    }, 'fiber')
    const nominalBwRef = worstMedium === 'fiber' ? 1000 : worstMedium === 'copper' ? 100 : 54
    const maxLostAttenuation = usedMedia.has('wireless') ? 30 : usedMedia.has('copper') ? 60 : 150

    const effectiveRatio = Math.max(0.01, minEffectiveBW / nominalBwRef)
    const bwFactor = Math.max(0.2, Math.min(4.0, 1 / effectiveRatio))

    const probLossObstacles = totalObstacles > 0
      ? Math.max(0, Math.min(0.75, (accumulatedAttenuationDB - 5) / maxLostAttenuation))
      : 0
    const probLossCongestion = effectiveRatio < 0.30
      ? Math.min(0.40, (0.30 - effectiveRatio) / 0.30 * 0.40)
      : 0
    const lossProbabilityPerPacket = Math.min(0.95, probLossObstacles * bwFactor + probLossCongestion)

    for (let i = 1; i <= packetsSent; i++) {
      setTimeout(() => {
        const isLost = Math.random() < lossProbabilityPerPacket
        const jitter = (Math.random() * 0.3 - 0.15) * baseTime
        const latency = Math.max(1, Math.round(baseTime + jitter))
        if (isLost) {
          capturedLatencies.push(null)
           individualPackets.push({ seq: i, latency: 0, hops: hops, lost: true })
          const cause = totalObstacles > 0
            ? `atenuación ${accumulatedAttenuationDB.toFixed(1)}dB`
            : `congestión BW ${minEffectiveBW.toFixed(1)}Mbps`
          const msg = `📦 Paquete ${i}/${packetsSent}: ${src} → ${dst} — ✗ perdido (${cause})`
          addLog(msg, 'warning')
          addSessionLog(msg)
        } else {
          capturedLatencies.push(latency)
           individualPackets.push({ seq: i, latency, hops: hops, lost: false })
          const msg = `📦 Paquete ${i}/${packetsSent}: ${src} → ${dst} — ${latency}ms ✓`
          addLog(msg, 'success')
          addSessionLog(msg)
        }
      }, SIM_TIMINGS.PACKET_START_DELAY + i * SIM_TIMINGS.PACKET_INTERVAL)
    }

    setTimeout(() => {
      const received = capturedLatencies.filter(l => l !== null)
      const lostCount = capturedLatencies.filter(l => l === null).length
      const lossPercent = Math.round((lostCount / packetsSent) * 100)
      const avgLatency = received.length > 0
        ? Math.round(received.reduce((s, v) => s + v, 0) / received.length)
        : baseTime
      const statusIcon = lostCount === 0 ? '✅' : lostCount === packetsSent ? '❌' : '⚠️'
      const lossStr = `, ${lossPercent}% pérdida`
      const obstStr = totalObstacles > 0 ? ` · ${totalObstacles} obst. (${accumulatedAttenuationDB.toFixed(1)}dB)` : ''
      const bwStr = ` · BW ${minEffectiveBW.toFixed(1)}Mbps`
      const msg = `${statusIcon} Ping ${src} → ${dst}: ${received.length}/${packetsSent} paquetes, ~${avgLatency}ms${lossStr}${bwStr}${obstStr}`
      addLog(msg, lostCount === 0 ? 'success' : lostCount === packetsSent ? 'error' : 'warning')
      addSessionLog(msg)
      saveLastPackets(individualPackets)
       saveSimulationResult({
         origin: src,
         destination: dst,
         latency: avgLatency,
         hops: hops,
         packetSize: packetSize,
         loss: lossPercent,
         medium: mediaStr,
         distanceM: +totalDistanceM.toFixed(1),
         effectiveBwMbps: +minEffectiveBW.toFixed(2),
         attenuationDB: +accumulatedAttenuationDB.toFixed(2),
         obstacles: totalObstacles,
       })
      setIsSimulating(false)
    }, SIM_TIMINGS.PACKET_START_DELAY + packetsSent * SIM_TIMINGS.PACKET_INTERVAL + SIM_TIMINGS.FINAL_RESULT_OFFSET)
  }, [sourceNodeId, destinationNodeId, packetSize, canvasNodes, canvasLinks, canvasObstacles, cliConfig, addLog, addSessionLog, saveSimulationResult, saveLastPackets])

  const stopSimulation = useCallback(() => {
    setIsSimulating(false)
    addLog('⏹  Simulación detenida por el usuario.', 'warning')
  }, [addLog])

  const clearSimulationLogs = useCallback(() => {
    setLocalLogs([])
    clearSessionLogsStore()
    clearSimulationsStore()
    setAreaMessage('Logs y reporte limpiados')
    setTimeout(() => setAreaMessage(''), 3000)
  }, [clearSessionLogsStore, clearSimulationsStore])

  return {
    isSimulating,
    failedLinks,
    setFailedLinks,
    localLogs,
    sourceNodeId,
    setSourceNodeId,
    destinationNodeId,
    setDestinationNodeId,
    packetSize,
    setPacketSize,
    areaMessage,
    setAreaMessage,
    addLog,
    startSimulation,
    stopSimulation,
    clearSimulationLogs,
  }
}
