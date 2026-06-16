/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        np: {
          bg:           'var(--np-bg)',
          surface:      'var(--np-surface)',
          elevated:     'var(--np-elevated)',
          overlay:      'var(--np-overlay)',
          border:       'var(--np-border)',
          'border-strong': 'var(--np-border-strong)',
          text:         'var(--np-text)',
          'text-dim':   'var(--np-text-dim)',
          'text-muted': 'var(--np-text-muted)',
          accent:       'var(--np-accent)',
          'accent-hover': 'var(--np-accent-hover)',
          cyan:         'var(--np-cyan)',
          danger:       'var(--np-danger)',
          'danger-hover': 'var(--np-danger-hover)',
          success:      'var(--np-success)',
          admin:        'var(--np-admin)',
          copper:       'var(--np-copper)',
        },
      },
    },
  },
  plugins: [],
}
