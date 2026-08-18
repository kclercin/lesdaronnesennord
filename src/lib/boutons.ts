export const CLASSES_BOUTON = {
  sombre: 'dc-btn dc-btn-dark',
  'contour-or': 'dc-btn dc-btn-outline dc-btn-outline-gold',
  'contour-plein': 'dc-btn dc-btn-outline dc-btn-outline-fill',
  or: 'dc-btn dc-btn-gold',
  'or-vif': 'dc-btn dc-btn-gold-bright',
  fantome: 'dc-btn dc-btn-ghost-light',
} as const

export type StyleBouton = keyof typeof CLASSES_BOUTON
