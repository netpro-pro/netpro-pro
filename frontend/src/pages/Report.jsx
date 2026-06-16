import { useRef } from 'react'
import { useNetProStore } from '../store/useNetProStore'
import { VIEWS } from '../store/constants'
import { useReportMetrics } from '../hooks/useReportMetrics'
import Button from '../components/ui/Button'
import ReportHeader from '../components/report/ReportHeader'
import ReportControls from '../components/report/ReportControls'
import ReportChartSection from '../components/report/ReportChartSection'
import ReportMetricsSection from '../components/report/ReportMetricsSection'

export default function Report() {
  const navigateTo = useNetProStore(s => s.navigateTo)
  const {
    userName,
    activeProjectName,
    currentVersion,
    metrics,
    chartData,
    noData,
    exportToPDF,
  } = useReportMetrics()

  const printRef = useRef(null)

  if (noData) {
    return (
      <div className="min-h-screen bg-np-bg flex flex-col items-center justify-center font-mono p-10 text-center">
        <div className="text-6xl mb-3 opacity-70">📊</div>
        <h2 className="text-np-accent text-2xl mb-2.5 tracking-wider">
          REPORTE NO DISPONIBLE
        </h2>
        <p className="text-np-text-muted text-sm max-w-lg leading-relaxed mb-6">
          No hay datos para generar el reporte. Ejecuta al menos una simulación
          en la pantalla de <strong className="text-white">Simulación</strong> para
          recolectar métricas.
        </p>
        <div className="flex gap-2.5">
           <Button variant="ghost" onClick={() => navigateTo(VIEWS.WORKSPACE)}>← Volver al Workspace</Button>
           <Button variant="primary" onClick={() => navigateTo(VIEWS.SIMULATION)}>Ir a Simulación →</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-np-bg flex flex-col font-sans">
      <ReportHeader userName={userName} />

      <main 
        ref={printRef}
        className="flex-1 p-6 pb-8 flex flex-col gap-5 max-w-6xl mx-auto w-full"
      >
        <ReportControls 
          activeProjectName={activeProjectName}
          currentVersion={currentVersion}
          onBack={() => navigateTo(VIEWS.WORKSPACE)}
          onExport={exportToPDF}
        />

        <ReportChartSection chartData={chartData} />
        
        <ReportMetricsSection metrics={metrics} />
      </main>
    </div>
  )
}
