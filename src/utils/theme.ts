export const COLORS = {
  bgPrimary: '#f2eedc',
  bgSecondary: '#e8e2cc',

  bgCard: 'rgba(242,238,220,0.85)',
  bgCardBorder: 'rgba(80,55,30,0.18)',

  gold: '#c17f2a',
  goldDim: 'rgba(193,127,42,0.18)',
  goldBorder: 'rgba(193,127,42,0.4)',
  orange: '#c45e2a',

  textPrimary: '#1e1a0e',
  textSecondary: '#4a3f28',
  textMuted: '#7a6e54',

  success: '#4a7c4e',
  successDim: 'rgba(74,124,78,0.15)',
  warning: '#c49a1a',
  danger: '#9c3528',
  dangerDim: 'rgba(156,53,40,0.12)',
  info: '#3a6b7a',

  wallBg: 'rgba(220,210,185,0.7)',
  wallBorder: '#c4b48a',
  wallOverlay: 'rgba(0,0,0,0.12)',

  tabBg: 'rgba(232,226,204,0.95)',
  tabActive: '#c17f2a',
  tabInactive: '#7a6e54',
} as const;

export const FONT_SIZE = {
  xs: 9,
  sm: 11,
  md: 13,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 22,
  '3xl': 26,
  '4xl': 32,
  hero: 56,
} as const;

export const FONT_WEIGHT = {
  normal: '400' as const,
  semibold: '600' as const,
  bold: '700' as const,
  black: '900' as const,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  full: 9999,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
} as const;