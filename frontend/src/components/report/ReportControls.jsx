import React from 'react'
import Button from '../ui/Button'

export default function ReportControls({ activeProjectName, currentVersion, onBack, onExport }) {
  return (
    <div className="flex justify-between items-center gap-4 flex-wrap">
      <Button variant="ghost" onClick={onBack}>← Volver</Button>

      {activeProjectName && (
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[0.72rem] text-np-text-muted tracking-widest uppercase font-semibold">
            Proyecto
          </span>
          <span className="text-lg text-np-text font-bold">
            {activeProjectName}
            {currentVersion?.numero_version && (
              <span className="ml-2.5 text-sm text-np-cyan font-medium font-mono">
                {currentVersion.numero_version}
              </span>
            )}
          </span>
        </div>
      )}

      <Button variant="primary" onClick={onExport}>📄 Exportar PDF</Button>
    </div>
  )
}
