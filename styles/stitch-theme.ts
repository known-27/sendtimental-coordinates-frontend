/**
 * Stitch Theme Configuration
 * Tailwind CSS theme extension based on Stitch design tokens
 * Semi-3D Brutalist meets Luxury Editorial aesthetic
 */

export const stitchTheme = {
  colors: {
    bg: {
      primary: '#191a1f',
      secondary: '#24252a',
      tertiary: '#2d2e33',
      card: '#1f2025',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b8b8b8',
      muted: '#6b6c70',
    },
    accent: {
      gold: '#c9a962',
      goldMuted: '#a88f52',
      rose: '#d4a574',
    },
    border: {
      subtle: '#3a3b40',
      medium: '#4a4b50',
      strong: '#5a5b60',
    },
    shadow: {
      hard: '#1a1a1a',
    },
  },
  fontFamily: {
    primary: ['Google Sans', 'Inter', 'sans-serif'],
    editorial: ['Playfair Display', 'Georgia', 'serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    md: ['1.125rem', { lineHeight: '1.625rem' }],
    lg: ['1.25rem', { lineHeight: '1.75rem' }],
    xl: ['1.5rem', { lineHeight: '2rem' }],
    '2xl': ['2rem', { lineHeight: '2.25rem' }],
    '3xl': ['2.5rem', { lineHeight: '2.75rem' }],
    '4xl': ['3.5rem', { lineHeight: '3.75rem' }],
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  boxShadow: {
    '3d-hard-sm': '4px 4px 0px #1a1a1a',
    '3d-hard-md': '6px 6px 0px #1a1a1a',
    '3d-hard-lg': '8px 8px 0px #1a1a1a',
    '3d-hard-xl': '10px 10px 0px #1a1a1a',
    '3d-hard-2xl': '12px 12px 0px #1a1a1a',
    '3d-pressed-sm': '2px 2px 0px #1a1a1a',
    '3d-pressed-md': '4px 4px 0px #1a1a1a',
    '3d-pressed-lg': '6px 6px 0px #1a1a1a',
    layered: '4px 4px 0px #1a1a1a, 8px 8px 0px rgba(26, 26, 26, 0.5)',
    tilted: '0 0 0 1px #4a4b50, 12px 12px 0px #1a1a1a',
  },
  transitionDuration: {
    fast: '150ms',
    base: '250ms',
    slow: '400ms',
    flip: '800ms',
  },
  animation: {
    'gps-pulse': 'gps-pulse 2s infinite ease-out',
    'gps-ping': 'gps-ping 1.5s infinite ease-in-out',
    'card-flip': 'card-flip 0.8s ease-in-out',
    shake: 'shake 0.5s ease-in-out',
  },
  keyframes: {
    'gps-pulse': {
      '0%': { transform: 'scale(0.5)', opacity: '1' },
      '100%': { transform: 'scale(1.5)', opacity: '0' },
    },
    'gps-ping': {
      '0%, 100%': { opacity: '0.3' },
      '50%': { opacity: '1' },
    },
    shake: {
      '0%, 100%': { transform: 'translateX(0)' },
      '20%': { transform: 'translateX(-8px)' },
      '40%': { transform: 'translateX(8px)' },
      '60%': { transform: 'translateX(-4px)' },
      '80%': { transform: 'translateX(4px)' },
    },
  },
  perspective: {
    1200: '1200px',
    800: '800px',
  },
  backdropBlur: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '16px',
  },
}

export default stitchTheme
