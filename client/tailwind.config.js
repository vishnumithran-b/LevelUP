/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--color-bg-rgb) / <alpha-value>)',
        'background-secondary': 'rgb(var(--color-bg-secondary-rgb) / <alpha-value>)',
        card: 'rgb(var(--color-card-rgb) / <alpha-value>)',
        'card-elevated': 'rgb(var(--color-card-elevated-rgb) / <alpha-value>)',
        border: 'rgb(var(--color-border-rgb) / <alpha-value>)',
        'text-primary': 'rgb(var(--color-text-primary-rgb) / <alpha-value>)',
        'text-secondary': 'rgb(var(--color-text-secondary-rgb) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
          hover: 'rgb(var(--color-accent-hover-rgb) / <alpha-value>)',
          secondary: 'rgb(var(--color-accent-secondary-rgb) / <alpha-value>)',
          subtle: 'rgb(var(--color-accent-subtle-rgb) / <alpha-value>)',
          border: 'rgb(var(--color-accent-border-rgb) / <alpha-value>)',
        },
        neon: {
          green: 'rgb(var(--color-neon-green-rgb) / <alpha-value>)',
          cyan: 'rgb(var(--color-neon-cyan-rgb) / <alpha-value>)',
          purple: 'rgb(var(--color-neon-purple-rgb) / <alpha-value>)',
          amber: 'rgb(var(--color-neon-amber-rgb) / <alpha-value>)',
          rose: 'rgb(var(--color-neon-rose-rgb) / <alpha-value>)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glass-ambient': 'var(--theme-shadow-ambient)',
        'glass-surface': 'var(--theme-shadow-surface)',
        'glass-elevated': 'var(--theme-shadow-elevated)',
        'neon-green': '0 0 25px -5px rgb(var(--color-neon-green-rgb) / 0.25)',
        'neon-cyan': '0 0 25px -5px rgb(var(--color-neon-cyan-rgb) / 0.25)',
        'neon-purple': '0 0 25px -5px rgb(var(--color-neon-purple-rgb) / 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
        'float-slow': 'floatSlow 8s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { opacity: '0.4' },
          '100%': { opacity: '0.8' },
        },
        floatSlow: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '100%': { transform: 'translate(30px, 20px) scale(1.08)' },
        }
      }
    },
  },
  plugins: [],
}
