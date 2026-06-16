import { useRef, useEffect, forwardRef } from 'react'

const SimulationLogWindow = forwardRef(function SimulationLogWindow({ logs, getLogColorByType }, ref) {
  const logEndRef = useRef(null)

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs.length])

  return (
    <div
      ref={ref}
      className="flex-1 min-w-0 flex flex-col"
    >
      <div className="np-label font-mono np-label text-np-text-muted tracking-wider uppercase text-[0.68rem] mb-1">
        Log
      </div>
      <div className="bg-[#0c1e2e] border border-np-border-strong rounded-sm h-[90px] overflow-y-auto p-1.5">
        {logs.length === 0 ? (
          <div className="np-mono text-np-text-muted text-[0.72rem] font-mono">
            Destino | Origen | Estado | Tiempo
          </div>
        ) : (
          logs.map((log, i) => (
            <div
              key={i}
              className="font-mono text-[0.72rem] leading-snug mb-0.5"
              style={{
                color: log.source === 'engine' ? getLogColorByType(log.type) : 'var(--np-text-dim)',
              }}
            >
              <span className="text-np-text-muted mr-1.5">
                {log.ts?.split('T')[1]?.slice(0, 8) ?? '\u2014'}
              </span>
              {log.msg}
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  )
})

export default SimulationLogWindow