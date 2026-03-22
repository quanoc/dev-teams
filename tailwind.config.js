/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        // 深色主题背景色阶
        bg: {
          0: '#0d0e11',
          1: '#13151a',
          2: '#1a1d24',
          3: '#22262f',
          4: '#2a2f3a',
        },
        // 边框和线条
        line: {
          DEFAULT: '#2e3340',
          2: '#383e4d',
        },
        // 文字色阶
        text: {
          0: '#e8eaf0',
          1: '#a8adb8',
          2: '#666d7e',
          3: '#404654',
        },
        // 主题色 - Blue
        blue: {
          DEFAULT: '#4a9eff',
          dark: '#1a3d6e',
          bg: '#0e1e38',
        },
        // 主题色 - Purple
        purple: {
          DEFAULT: '#9b7dff',
          dark: '#3d2e6e',
          bg: '#1a1230',
        },
        // 主题色 - Green
        green: {
          DEFAULT: '#3dd68c',
          dark: '#1a5c3a',
          bg: '#0a2018',
        },
        // 主题色 - Amber
        amber: {
          DEFAULT: '#f5a623',
          dark: '#6b4510',
          bg: '#241600',
        },
        // 主题色 - Red
        red: {
          DEFAULT: '#ff5c5c',
          dark: '#6b1a1a',
          bg: '#200a0a',
        },
        // 主题色 - Teal
        teal: {
          DEFAULT: '#2dd4bf',
        },
        // 主题色 - Cyan
        cyan: {
          DEFAULT: '#22d3ee',
          dark: '#0e7490',
          bg: '#083344',
        },
        // Sidebar 颜色
        sidebar: {
          DEFAULT: '#13151a',
          hover: '#22262f',
          active: '#2a2f3a',
          border: '#2e3340',
          text: '#a8adb8',
          'text-active': '#e8eaf0',
        },
        // 状态颜色
        status: {
          'running-bg': '#0a2018',
          'running-text': '#3dd68c',
          'running-border': '#1a5c3a',
          'waiting-bg': '#241600',
          'waiting-text': '#f5a623',
          'waiting-border': '#6b4510',
          'blocked-bg': '#200a0a',
          'blocked-text': '#ff5c5c',
          'blocked-border': '#6b1a1a',
          'idle-bg': '#1a1d24',
          'idle-text': '#666d7e',
          'idle-border': '#2e3340',
          'analyzing-bg': '#1a1230',
          'analyzing-text': '#9b7dff',
          'analyzing-border': '#3d2e6e',
          'reviewing-bg': '#0e1e38',
          'reviewing-text': '#4a9eff',
          'reviewing-border': '#1a3d6e',
        },
      },
      borderRadius: {
        'DEFAULT': '6px',
        'lg': '10px',
      },
      animation: {
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'fade-up': 'fadeUp 0.3s ease both',
        'pip-run': 'pipRun 1.8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn: { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pipRun: { 
          '0%': { width: '20%' }, 
          '50%': { width: '75%' }, 
          '100%': { width: '20%' } 
        },
      },
    },
  },
  plugins: [],
}
