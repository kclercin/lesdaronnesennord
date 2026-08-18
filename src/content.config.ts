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

export const collections = { sessions }
