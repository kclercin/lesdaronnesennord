import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const sessions = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/sessions' }),
  schema: z.object({
    ordre: z.number(),
    jour: z.string().min(1),
    mois: z.string().min(1),
    lieu: z.string().min(1),
    ville: z.string().min(1),
    /** Optionnel : page de réservation propre à cette session. */
    lienReservation: z.string().url().optional(),
  }),
})

const ateliers = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/ateliers' }),
  schema: z.object({
    ordre: z.number(),
    numero: z.string().min(1),
    titre: z.string().min(1),
    description: z.string().min(1),
    image: z.string().startsWith('/uploads/'),
    /** Obligatoire : un alt vide passerait inaperçu au CMS mais casserait l'accessibilité. */
    imageAlt: z.string().min(1),
    cotePhoto: z.enum(['gauche', 'droite']),
    tags: z.array(z.string().min(1)).min(1),
    repartezAvec: z.array(z.string().min(1)).min(1),
    deroule: z.array(
      z.object({
        numero: z.string().min(1),
        titre: z.string().min(1),
        texte: z.string().min(1),
      })
    ).min(1),
  }),
})

export const collections = { sessions, ateliers }
