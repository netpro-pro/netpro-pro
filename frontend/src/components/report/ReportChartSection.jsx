import React from 'react'
import PerformanceChart from './PerformanceChart'

export default function ReportChartSection({ chartData }) {
  return (
    <div className="bg-np-surface rounded-xl p-1 border border-np-border-strong shadow-[0_6px_28px_rgba(0,0,0,0.35)]">
      <div className="px-[22px] py-3.5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex flex-col gap-0.5">
          <span className="text-np-cyan text-[0.74rem] font-bold tracking-widest uppercase">
            Análisis Comparativo de Rendimiento
          </span>
          <span className="text-np-text text-lg font-bold">
            Saltos y Latencia por Paquete (P1 — P{chartData.length})
          </span>
        </div>
        <div className="text-[0.72rem] text-np-text-muted font-mono tracking-tight">
          {chartData.length} paquetes · última simulación
        </div>
      </div>

      <div className="bg-[#dfe7ef] rounded-lg p-6 mx-3.5 mb-3.5 flex justify-center">
        <PerformanceChart tests={chartData} />
      </div>
    </div>
  )
}
