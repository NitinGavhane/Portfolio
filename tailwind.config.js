/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Minimal monochrome palette
        ink: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
        // Keep for dark-mode fallback references
        primary: {
          500: '#171717',
          600: '#0a0a0a',
        },
        accent: {
          500: '#404040',
          600: '#262626',
        },
        dark: {
          900: '#0f172a',
          950: '#020617',
        },
      },
      fontFamily: {
        'display':  ['"DM Serif Display"', 'Georgia', 'serif'],
        'body':     ['"DM Sans"', 'system-ui', 'sans-serif'],
        'sans':     ['"DM Sans"', 'system-ui', 'sans-serif'],
        'serif':    ['"DM Serif Display"', 'Georgia', 'serif'],
        'mono':     ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'xs':    ['0.75rem',   { lineHeight: '1.1rem' }],
        'sm':    ['0.875rem',  { lineHeight: '1.4rem' }],
        'base':  ['1rem',      { lineHeight: '1.6rem' }],
        'lg':    ['1.125rem',  { lineHeight: '1.75rem' }],
        'xl':    ['1.25rem',   { lineHeight: '1.85rem' }],
        '2xl':   ['1.5rem',    { lineHeight: '2rem' }],
        '3xl':   ['1.875rem',  { lineHeight: '2.2rem' }],
        '4xl':   ['2.25rem',   { lineHeight: '2.5rem' }],
        '5xl':   ['3rem',      { lineHeight: '1.05' }],
        '6xl':   ['3.75rem',   { lineHeight: '1.02' }],
        '7xl':   ['4.5rem',    { lineHeight: '1' }],
        '8xl':   ['6rem',      { lineHeight: '0.95' }],
        '9xl':   ['8rem',      { lineHeight: '0.9' }],
      },
      spacing: {
        '18':  '4.5rem',
        '88':  '22rem',
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'fade-in':       'fadeIn 0.5s ease-out',
        'fade-in-up':    'fadeInUp 0.7s ease-out',
        'fade-in-down':  'fadeInDown 0.7s ease-out',
        'slide-in-left': 'slideInLeft 0.7s ease-out',
        'float':         'float 6s ease-in-out infinite',
        'blink':         'blink 1s infinite',
        'breathe':       'breathe 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%':   { opacity: '0', transform: 'translateY(-24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        blink: {
          '0%, 50%':   { borderColor: 'transparent' },
          '51%, 100%': { borderColor: 'currentColor' },
        },
        breathe: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.6' },
        },
      },
      boxShadow: {
        'minimal': '0 1px 3px 0 rgba(0,0,0,0.08)',
        'card':    '0 4px 24px -4px rgba(0,0,0,0.10)',
        'lift':    '0 12px 40px -8px rgba(0,0,0,0.14)',
      },
      letterSpacing: {
        'tightest': '-0.04em',
        'tighter':  '-0.03em',
        'tight':    '-0.02em',
        'normal':   '0em',
        'wide':     '0.04em',
        'wider':    '0.08em',
        'widest':   '0.16em',
      },
    },
  },
  plugins: [],
};