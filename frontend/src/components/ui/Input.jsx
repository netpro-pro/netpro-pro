import { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, hint, error, type = 'text', className = '', listId = null, options = [], ...rest },
  ref,
) {
  return (
    <label className={`block ${className}`}>
      {label && (
        <span className="np-label block mb-1.5">
          {label}
        </span>
      )}
      <input
        ref={ref}
        type={type}
        list={listId}
        className={`
          w-full px-3 py-2.5
          bg-np-surface text-np-text
          font-mono text-sm
          border ${error ? 'border-np-danger' : 'border-np-border'}
          rounded-sm
          placeholder:text-np-text-muted
          transition-colors duration-150
          focus:outline-none focus:border-np-accent
          focus:shadow-[0_0_0_3px_var(--np-accent-glow)]
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        {...rest}
      />
      {listId && (
        <datalist id={listId}>
          {options.map((opt, i) => (
            <option key={i} value={opt} />
          ))}
        </datalist>
      )}
      {error ? (
        <span className="np-mono block mt-1.5 text-xs text-np-danger">
          {'> '}{error}
        </span>
      ) : hint ? (
        <span className="np-mono block mt-1.5 text-xs text-np-text-muted">
          {hint}
        </span>
      ) : null}
    </label>
  )
})

export default Input
