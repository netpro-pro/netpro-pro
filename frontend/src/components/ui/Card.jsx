export default function Card({
  children,
  interactive = false,
  corners = false,
  className = '',
  onClick,
  ...rest
}) {
  const Tag = interactive ? 'button' : 'div'
  return (
    <Tag
      onClick={onClick}
      className={`
        relative
        bg-np-surface
        border border-np-border
        rounded-sm
        ${corners ? 'np-corners' : ''}
        ${interactive ? `
          text-left w-full
          cursor-pointer
          transition-all duration-200 ease-out
          hover:border-np-border-strong hover:bg-np-elevated
          hover:-translate-y-0.5
          active:translate-y-0
          focus:outline-none focus:border-np-accent
          focus:shadow-[0_0_0_3px_var(--np-accent-glow)]
        ` : ''}
        ${className}
      `}
      {...rest}
    >
      {children}
    </Tag>
  )
}
