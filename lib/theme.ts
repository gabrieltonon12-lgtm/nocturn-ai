// Shared design tokens — use these everywhere, never hardcode colors
export const C = {
  void:    '#0C0F1A',
  base:    '#090C14',
  layer:   '#0F1320',
  card:    '#141828',
  raised:  '#1B2035',
  focus:   'rgba(122,92,252,.14)',
  line:    'rgba(255,255,255,.07)',
  lineHi:  'rgba(255,255,255,.13)',
  red:     '#7A5CFC',
  redDim:  'rgba(122,92,252,.12)',
  redGlow: 'rgba(122,92,252,.22)',
  violet:  '#A78BFA',
  vDim:    'rgba(167,139,250,.12)',
  green:   '#34D399',
  gDim:    'rgba(52,211,153,.10)',
  amber:   '#FBBF24',
  aDim:    'rgba(251,191,36,.10)',
  t1:      '#ECEEF8',
  t2:      '#7A8099',
  t3:      '#363D55',
} as const

export const F = {
  body: "'Figtree',system-ui,sans-serif",
  head: "'Syne',system-ui,sans-serif",
  mono: "'JetBrains Mono',monospace",
} as const

export const shadow = {
  card:  '0 1px 3px rgba(0,0,0,.4)',
  float: '0 4px 20px rgba(0,0,0,.5),0 1px 4px rgba(0,0,0,.3)',
  modal: '0 16px 60px rgba(0,0,0,.7),0 4px 16px rgba(0,0,0,.4)',
  red:   '0 4px 20px rgba(122,92,252,.35)',
} as const
