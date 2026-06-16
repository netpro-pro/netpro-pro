import React from 'react'

export default function ReportHeader({ userName }) {
  return (
    <header className="bg-np-surface border-b border-np-border-strong px-6 py-3 flex items-center gap-3 shrink-0">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
        stroke="var(--np-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2"  y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      <span className="font-black text-lg text-np-text tracking-wider font-sans">
        NETPRO
      </span>
      <span className="text-np-text-muted font-bold text-lg">
        | Reporte |
      </span>
      {userName && (
        <span className="font-bold text-lg text-np-text">
          Ing. {userName}
        </span>
      )}
    </header>
  )
}
