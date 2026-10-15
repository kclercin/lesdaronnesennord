import { z } from 'astro/zod'
import { CLES_ICONES } from '../components/icons'

/** Clé du registre d'icônes (src/components/icons/index.ts). */
export const icone = z.enum(CLES_ICONES as [string, ...string[]])

export const lien = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
})

export const styleBouton = z.enum([
  'sombre',
  'contour-or',
  'contour-plein',
  'or',
  'or-vif',
  'fantome',
])

export const bouton = z.object({
  label: z.string().min(1),
  /** Vide si `externe` est vrai : l'URL vient alors de site.json. */
  href: z.string(),
  style: styleBouton,
  /** true → lien de réservation externe, ouvert dans un nouvel onglet. */
  externe: z.boolean().optional(),
})

export const seo = z.object({
  titre: z.string().min(1),
  description: z.string().optional(),
})

export const carteIcone = z.object({
  icone,
  titre: z.string().min(1),
  texte: z.string().min(1),
})
