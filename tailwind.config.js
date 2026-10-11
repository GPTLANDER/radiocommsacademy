/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        radar: {
          bg: '#080D18',
          surface: '#111B2C',
          surface2: '#18253A',
          border: '#22354F',
          text: '#F3F6FC',
          muted: '#A9B6CA',
          dim: '#62738E',
          cyan: '#35D9FF',
          'cyan-dim': '#104B5D',
          amber: '#FFC857',
          'amber-dim': '#574316',
          success: '#35D39A',
          'success-dim': '#104A35',
          error: '#FF6B78',
          'error-dim': '#581F26',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'hud-cyan': '0 0 15px rgba(53, 217, 255, 0.25)',
        'hud-amber': '0 0 15px rgba(255, 200, 87, 0.25)',
        'hud-success': '0 0 15px rgba(53, 211, 154, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}
