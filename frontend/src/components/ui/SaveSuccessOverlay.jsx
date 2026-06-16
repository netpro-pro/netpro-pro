import React from 'react'

export default function SaveSuccessOverlay() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none">
      <div className="bg-np-bg/90 border border-np-accent/25 rounded-xl px-12 py-7 shadow-2xl backdrop-blur-md text-center np-fade-up">
        <div className="text-4xl mb-2">✅</div>
        <div className="text-white font-bold text-lg tracking-wide font-mono">
          Proyecto guardado correctamente
        </div>
      </div>
    </div>
  )
}
