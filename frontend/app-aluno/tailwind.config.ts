import type { Config } from 'tailwindcss';

// Cada cor referencia uma variável CSS (definida em src/styles/index.css, em :root/.dark)
// no formato "R G B", para o toggle de tema funcionar de verdade e ainda suportar
// modificadores de opacidade do Tailwind (ex: bg-error-container/40).
function themeColor(variable: string) {
  return `rgb(var(${variable}) / <alpha-value>)`;
}

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: themeColor('--color-primary'),
        'primary-container': themeColor('--color-primary-container'),
        'primary-fixed': themeColor('--color-primary-fixed'),
        'on-primary': themeColor('--color-on-primary'),
        'on-primary-container': themeColor('--color-on-primary-container'),
        secondary: themeColor('--color-secondary'),
        'secondary-container': themeColor('--color-secondary-container'),
        'on-secondary-container': themeColor('--color-on-secondary-container'),
        tertiary: themeColor('--color-tertiary'),
        surface: themeColor('--color-surface'),
        'surface-bright': themeColor('--color-surface-bright'),
        'surface-container': themeColor('--color-surface-container'),
        'surface-container-low': themeColor('--color-surface-container-low'),
        'surface-container-high': themeColor('--color-surface-container-high'),
        'surface-tint': themeColor('--color-surface-tint'),
        background: themeColor('--color-background'),
        'on-background': themeColor('--color-on-background'),
        'on-surface': themeColor('--color-on-surface'),
        'on-surface-variant': themeColor('--color-on-surface-variant'),
        border: themeColor('--color-border'),
        'text-muted': themeColor('--color-text-muted'),
        'text-heading': themeColor('--color-text-heading'),
        error: themeColor('--color-error'),
        'error-container': themeColor('--color-error-container'),
        'on-error': themeColor('--color-on-error'),
        warning: themeColor('--color-warning'),
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        base: '4px',
        md: '16px',
        gutter: '16px',
        lg: '24px',
        xl: '32px',
        'container-padding': '24px',
      },
      fontFamily: {
        'card-header': ['"Plus Jakarta Sans"', 'sans-serif'],
        'label-caps': ['"Source Sans 3"', 'sans-serif'],
        'stat-value': ['"Source Sans 3"', 'sans-serif'],
        'status-display': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-md': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-lg': ['"Plus Jakarta Sans"', 'sans-serif'],
        'headline-lg-mobile': ['"Plus Jakarta Sans"', 'sans-serif'],
        'body-md': ['"Source Sans 3"', 'sans-serif'],
        'body-sm': ['"Source Sans 3"', 'sans-serif'],
      },
      fontSize: {
        'card-header': ['18px', { lineHeight: '1.2', letterSpacing: '1px', fontWeight: '700' }],
        'label-caps': ['12px', { lineHeight: '1', fontWeight: '700' }],
        'stat-value': ['24px', { lineHeight: '1', fontWeight: '700' }],
        'status-display': ['20px', { lineHeight: '1.4', fontWeight: '700' }],
        'headline-md': ['22px', { lineHeight: '1.3', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '1.2', fontWeight: '700' }],
        'headline-lg-mobile': ['24px', { lineHeight: '1.2', fontWeight: '700' }],
        'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
} satisfies Config;
