export const COLORS = {
  bgPrimary: '#f4f1ea',         
  bgSecondary: '#eae4d8',       
  bgCard: 'rgba(255,255,255,0.6)', 
  bgCardBorder: 'rgba(120,100,80,0.2)',

  gold: '#c2a878',             
  goldDim: 'rgba(194,168,120,0.2)',
  goldBorder: 'rgba(194,168,120,0.4)',
  orange: '#b86b3d',           

  textPrimary: '#2d2a26',       
  textSecondary: '#6b645c',
  textMuted: '#9c958c',

  success: '#6f8f72',           
  successDim: 'rgba(111,143,114,0.2)',
  warning: '#c9a227',          
  danger: '#b5523b',            
  dangerDim: 'rgba(181,82,59,0.15)',
  info: '#7c9aa6',              

  wallBg: '#ded6c8',
  wallBorder: '#c9bba4',
  wallOverlay: 'rgba(0,0,0,0.15)',

  tabBg: '#eae4d8',
  tabActive: '#b86b3d',
  tabInactive: '#9c958c',
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