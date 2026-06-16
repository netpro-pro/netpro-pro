import { useMemo } from 'react'
import { useNetProStore } from '../store/useNetProStore'

const COLORS = {
  HOPS: '#53EEFF',
  LATENCY: '#E8005A',
  BG_CHART: '#eef3f8',
}

function calculateMetrics(canvasNodes, canvasLinks, sessionLogs, simulationResults) {
  const numLinks = canvasLinks.length || 0

  let tests
  let avgLatency, avgHops

  if (simulationResults && simulationResults.length > 0) {
    tests = simulationResults.map((r, i) => ({
      id: `P${i + 1}`,
      hops: Math.min(Math.max(r.hops >= 0 ? r.hops : 1, 1), 9999),
      latency: Math.min(Math.max(r.latency >= 0 ? r.latency : 2, 1), 99999),
    }))
    avgLatency = Math.round(simulationResults.reduce((s, r) => s + r.latency, 0) / simulationResults.length)
    avgHops = Math.round(simulationResults.reduce((s, r) => s + r.hops, 0) / simulationResults.length * 10) / 10
  } else {
    tests = Array.from({ length: 5 }, (_, i) => ({
      id: `P${i + 1}`, hops: 0, latency: 0,
    }))
    avgLatency = 0
    avgHops = 0
  }

  const lost = (simulationResults && simulationResults.length > 0)
    ? simulationResults.reduce((acc, r) => acc + (r.loss ?? 0), 0)
    : 0
  const lossRate = (simulationResults && simulationResults.length > 0)
    ? Math.round(lost / simulationResults.length)
    : 0

  let bandwidth
  if (simulationResults && simulationResults.length > 0) {
    const bwSum = simulationResults.reduce((acc, r) => acc + (r.effectiveBwMbps ?? 0), 0)
    bandwidth = Math.round(bwSum / simulationResults.length * 10) / 10
  } else {
    bandwidth = numLinks > 0
      ? canvasLinks.reduce((acc, e) => acc + (e.medio === 'fiber' ? 1000 : e.medio === 'copper' ? 100 : 54), 0)
      : 0
  }

  return { tests, avgLatency, avgHops, lossRate, bandwidth }
}

export function useReportMetrics() {
  const userName = useNetProStore(s => s.userName)
  const activeProjectName = useNetProStore(s => s.activeProjectName)
  const canvasNodes = useNetProStore(s => s.canvasNodes)
  const canvasLinks = useNetProStore(s => s.canvasLinks)
  const sessionLogs = useNetProStore(s => s.sessionLogs)
  const currentVersion = useNetProStore(s => s.currentVersion)
  const simulationResults = useNetProStore(s => s.simulationResults)
  const lastPackets = useNetProStore(s => s.lastPackets)

  const metrics = useMemo(
    () => calculateMetrics(canvasNodes, canvasLinks, sessionLogs, simulationResults),
    [canvasNodes, canvasLinks, sessionLogs, simulationResults]
  )

  const chartData = useMemo(() => {
    if (lastPackets && lastPackets.length > 0) {
      return lastPackets.map((p, i) => ({
        id: `P${i + 1}`,
        hops: p.hops,
        latency: p.lost ? 0 : p.latency,
        lost: p.lost,
      }))
    }
    return metrics.tests.slice(-1).map((p, i) => ({ ...p, id: `P${i + 1}` }))
  }, [lastPackets, metrics.tests])

  const hasSavedMetrics = !!(currentVersion?.data_json?.metricas)
  const noData = (!simulationResults || simulationResults.length === 0) && !hasSavedMetrics

  const exportToPDF = () => {
    const date = new Date().toLocaleString('es-MX')
    const version = currentVersion?.numero_version ?? '—'

    const tableRows = metrics.tests.map(p =>
      `<tr><td>${p.id}</td><td>${p.hops}</td><td>${p.latency} ms</td></tr>`
    ).join('')

    const svgBars = metrics.tests.map(p => {
      const maxV = Math.max(...metrics.tests.flatMap(q => [q.hops, q.latency]), 5)
      const wHops = Math.round((p.hops / maxV) * 200)
      const wLat = Math.round((p.latency / maxV) * 200)
      return `
        <tr>
          <td style="padding:4px 8px;font-weight:bold">${p.id}</td>
          <td style="padding:4px 8px">
            <div style="background:${COLORS.HOPS};width:${wHops}px;height:14px;display:inline-block;border-radius:2px"></div>
            <span style="margin-left:6px;font-size:11px">${p.hops}</span>
          </td>
          <td style="padding:4px 8px">
            <div style="background:${COLORS.LATENCY};width:${wLat}px;height:14px;display:inline-block;border-radius:2px"></div>
            <span style="margin-left:6px;font-size:11px">${p.latency} ms</span>
          </td>
        </tr>`
    }).join('')

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Reporte NetPro — ${activeProjectName ?? 'Proyecto'}</title>
  <style>
    body { font-family: 'Roboto', Arial, sans-serif; margin: 32px; color: #111; }
    h1   { color: #00607F; font-size: 22px; margin-bottom: 4px; }
    h2   { font-size: 14px; color: #444; margin: 20px 0 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
    table{ border-collapse: collapse; width: 100%; font-size: 13px; }
    th   { background: #00607F; color: #fff; padding: 6px 12px; text-align: left; }
    td   { padding: 5px 12px; border-bottom: 1px solid #eee; }
    .meta{ font-size: 12px; color: #666; margin-bottom: 20px; }
    .metricas { display: flex; gap: 24px; flex-wrap: wrap; margin-top: 16px; }
    .met-card { background: #f0f7ff; border: 1px solid #aad4e8; border-radius: 6px; padding: 10px 16px; min-width: 130px; }
    .met-label { font-size: 11px; color: #666; margin-bottom: 4px; }
    .met-val   { font-size: 18px; font-weight: 700; color: #00607F; }
  </style>
</head>
<body>
  <h1>🌐 NETPRO — Reporte Técnico de Simulación</h1>
  <div class="meta">
    Proyecto: <strong>${activeProjectName ?? '—'}</strong> &nbsp;|&nbsp;
    Versión: <strong>${version}</strong> &nbsp;|&nbsp;
    Ingeniero: <strong>${userName ?? '—'}</strong> &nbsp;|&nbsp;
    Fecha: <strong>${date}</strong>
  </div>

  <h2>Métricas Globales de Rendimiento</h2>
  <div class="metricas">
    <div class="met-card"><div class="met-label">Paquetes Perdidos</div><div class="met-val">${metrics.lossRate}%</div></div>
    <div class="met-card"><div class="met-label">Ancho de Banda Efectivo</div><div class="met-val">${metrics.bandwidth > 0 ? metrics.bandwidth + ' Mbps' : '—'}</div></div>
    <div class="met-card"><div class="met-label">Latencia Promedio</div><div class="met-val">${metrics.avgLatency} ms</div></div>
    <div class="met-card"><div class="met-label">Saltos Promedio</div><div class="met-val">${metrics.avgHops}</div></div>
    <div class="met-card"><div class="met-label">Nodos</div><div class="met-val">${canvasNodes.length}</div></div>
    <div class="met-card"><div class="met-label">Enlaces</div><div class="met-val">${canvasLinks.length}</div></div>
  </div>

  <h2>Análisis por Prueba (P1 – P${metrics.tests.length})</h2>
  <table>
    <thead><tr><th>Prueba</th><th>Saltos (Hops)</th><th>Latencia</th></tr></thead>
    <tbody>${tableRows}</tbody>
  </table>

  <h2>Histograma de Rendimiento</h2>
  <table style="border:none">
    <thead>
      <tr>
        <th style="background:transparent;color:#444">Prueba</th>
        <th style="background:${COLORS.HOPS};color:#000">Saltos</th>
        <th style="background:${COLORS.LATENCY};color:#fff">Latencia</th>
      </tr>
    </thead>
    <tbody>${svgBars}</tbody>
  </table>

  <h2>Log de Eventos de Simulación</h2>
  <table>
    <thead><tr><th>Timestamp</th><th>Evento</th></tr></thead>
    <tbody>
      ${sessionLogs.slice(-20).map(l =>
        `<tr><td style="white-space:nowrap;font-family:monospace;font-size:11px">${l.ts?.split('T')[1]?.slice(0,8) ?? '—'}</td><td>${l.msg}</td></tr>`
      ).join('') || '<tr><td colspan="2" style="color:#999">Sin eventos registrados</td></tr>'}
    </tbody>
  </table>
</body>
</html>`

    const blob = new Blob([html], { type: 'text/html; charset=utf-8' })
    const blobUrl = URL.createObjectURL(blob)

    const iframe = document.createElement('iframe')
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none;'
    document.body.appendChild(iframe)

    iframe.onload = () => {
      try {
        iframe.contentWindow.focus()
        iframe.contentWindow.print()
      } catch (e) {
        console.error('Error al imprimir:', e)
      }
      setTimeout(() => {
        document.body.removeChild(iframe)
        URL.revokeObjectURL(blobUrl)
      }, 3000)
    }

    iframe.src = blobUrl
  }

  return {
    userName,
    activeProjectName,
    currentVersion,
    metrics,
    chartData,
    noData,
    exportToPDF,
    canvasNodes,
    canvasLinks
  }
}
