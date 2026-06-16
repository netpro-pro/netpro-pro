import { useState } from 'react'
import Modal from '../ui/Modal'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function VersionInspectionModal({ version, onClose }) {
  const [searchTerm, setSearchTerm] = useState('')

  const snapshot = version?.data_json ?? {}
  const snapshotStr = JSON.stringify(snapshot, null, 2)

  const lines = snapshotStr.split('\n').filter(l =>
    searchTerm ? l.toLowerCase().includes(searchTerm.toLowerCase()) : true
  )

  return (
    <Modal
      open={!!version}
      title={`Detalle Técnico — ${version?.numero_version ?? `v${version?.id_version}`}`}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-np-text-muted">
            {lines.length} {searchTerm ? 'líneas encontradas' : 'líneas totales'}
          </span>
          <Button onClick={onClose} size="sm">
            Cerrar Detalles
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Buscar atributo en el snapshot..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full"
        />

        <div style={{
          flex: 1,
          maxHeight: '60vh',
          overflowY: 'auto',
          padding: '12px',
          background: 'var(--np-bg)',
          border: '1px solid var(--np-border)',
          borderRadius: '4px',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: '0.82rem',
          color: 'var(--np-text-dim)',
          lineHeight: 1.7,
          whiteSpace: 'pre',
        }}>
          {lines.length === 0 ? (
            <span style={{ color: 'var(--np-text-muted)' }}>Sin resultados para «{searchTerm}»</span>
          ) : (
            lines.map((line, i) => {
              const isKey = /^\s*"[\w_]+"\s*:/.test(line) && !line.includes('{') && !line.includes('[')
              const isObj = line.includes('{') || line.includes('}') || line.includes('[') || line.includes(']')
              const matches = searchTerm && line.toLowerCase().includes(searchTerm.toLowerCase())
              return (
                <div
                  key={i}
                  style={{
                    color: matches
                      ? 'var(--np-cyan)'
                      : isKey
                        ? 'var(--np-text)'
                        : isObj
                          ? 'var(--np-accent-hover)'
                          : 'var(--np-text-dim)',
                    background: matches ? 'rgba(83,238,255,0.07)' : 'transparent',
                  }}
                >
                  {line}
                </div>
              )
            })
          )}
        </div>
      </div>
    </Modal>
  )
}
