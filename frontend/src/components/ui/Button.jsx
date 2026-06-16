const VARIANTS = {
  primary: `
    bg-np-accent text-np-bg font-semibold
    hover:bg-np-accent-hover hover:shadow-[0_0_20px_var(--np-accent-glow)]
    active:bg-np-accent-press active:translate-y-px
  `,
  ghost: `
    bg-transparent text-np-text border border-np-border-strong
    hover:border-np-accent hover:text-np-accent hover:bg-np-overlay
    active:translate-y-px
  `,
  warning: `
    bg-transparent text-[#b07510] border border-np-border-strong
    hover:bg-[#8D5D04] hover:text-np-bg hover:border-[#8D5D04]
    active:translate-y-px
  `,
  danger: `
    bg-transparent text-np-danger border border-np-border-strong
    hover:bg-np-danger hover:text-np-bg hover:border-np-danger
    active:translate-y-px
  `,
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-sm',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  icon = null,
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        font-mono uppercase tracking-wider
        inline-flex items-center justify-center gap-2
        transition-all duration-150 ease-out
        rounded-sm
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none
        focus:outline-none focus:ring-2 focus:ring-np-accent focus:ring-offset-2 focus:ring-offset-np-bg
        ${SIZES[size]}
        ${VARIANTS[variant]}
        ${className}
      `}
      {...rest}
    >
      {loading ? (
        <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  )
}
