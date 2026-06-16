import Button from './Button'

export default function Modal({
  open,
  title,
  children,
  footer,
  onClose,
  destructive = false,
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-np-bg/80 backdrop-blur-sm np-fade-up"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-md bg-np-elevated border border-np-border-strong rounded-sm np-corners shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3 border-b border-np-border flex items-center gap-2">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${destructive ? 'bg-np-danger' : 'bg-np-accent'} np-pulse`} />
          <span className="np-label">{destructive ? 'Atención' : 'Operación'}</span>
        </div>

        {title && (
          <div className="px-5 py-3">
            <h3 className="font-mono text-base text-np-text">{title}</h3>
          </div>
        )}

        <div className="p-6">
          {children}
        </div>

        {footer && (
          <div className="flex gap-2 px-5 py-4 border-t border-np-border bg-np-surface/50">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
