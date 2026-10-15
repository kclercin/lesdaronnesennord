// src/components/icons/_stroke.ts
export const INK = '#1B1A17'
export const GOLD = '#E8BE36'

/**
 * Attributs de tracé communs à toutes les icônes.
 * Clés en kebab-case : contrairement à React, Astro ne convertit pas
 * camelCase → kebab-case pour les attributs SVG.
 */
export const s = (w: number, c: string = INK) => ({
  fill: 'none',
  stroke: c,
  'stroke-width': w,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
})
