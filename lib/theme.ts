// Shared design tokens — use these everywhere, never hardcode colors
export const C = {
  void:    '#FFFFFF',
  base:    '#FAFAFA',
  layer:   '#F4F4F5',
  card:    '#FFFFFF',
  raised:  '#F4F4F5',
  focus:   '#EEE9FE',
  line:    '#E4E4E7',
  lineHi:  '#D4D4D8',
  red:     '#6E56CF',
  redDim:  'rgba(110,86,207,.08)',
  redGlow: 'rgba(110,86,207,.12)',
  violet:  '#4C3899',
  vDim:    'rgba(110,86,207,.06)',
  green:   '#16A34A',
  gDim:    'rgba(22,163,74,.08)',
  amber:   '#CA8A04',
  aDim:    'rgba(202,138,4,.08)',
  t1:      '#09090B',
  t2:      '#52525B',
  t3:      '#A1A1AA',
} as const

export const F = {
  body: "'Inter',system-ui,sans-serif",
  head: "'Space Grotesk',system-ui,sans-serif",
  mono: "'JetBrains Mono',monospace",
} as const

export const shadow = {
  card:  '0 1px 2px rgba(0,0,0,.05)',
  float: '0 2px 8px rgba(0,0,0,.06),0 1px 2px rgba(0,0,0,.04)',
  modal: '0 8px 24px rgba(0,0,0,.08),0 2px 8px rgba(0,0,0,.04)',
  red:   '0 4px 14px rgba(110,86,207,.3)',
} as const
