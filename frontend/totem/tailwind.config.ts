import type { Config } from 'tailwindcss';

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
        'on-primary': themeColor('--color-on-primary'),
        surface: themeColor('--color-surface'),
        'surface-container-low': themeColor('--color-surface-container-low'),
        'surface-container-high': themeColor('--color-surface-container-high'),
        'surface-tint': themeColor('--color-surface-tint'),
        background: themeColor('--color-background'),
        'on-surface': themeColor('--color-on-surface'),
        border: themeColor('--color-border'),
        'text-muted': themeColor('--color-text-muted'),
        'text-heading': themeColor('--color-text-heading'),
        error: themeColor('--color-error'),
        'error-container': themeColor('--color-error-container'),
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
        'body-md': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
} satisfies Config;
