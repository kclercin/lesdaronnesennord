import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { CLES_ICONES } from './components/icons'

const icone = z.enum(CLES_ICONES as [string, ...string[]])
const lien = z.object({ label: z.string().min(1), href: z.string().min(1) })

const seo = z.object({
  titre: z.string().min(1),
  description: z.string().optional(),
})

const leLab = z.object({
  seo,
  hero: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    cercleLabel: z.string().min(1),
    texte: z.string().min(1),
    cta: lien,
  }),
  pourQui: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    cartes: z.array(
      z.object({ icone, titre: z.string().min(1), texte: z.string().min(1) })
    ).length(3),
  }),
  accompagnement: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    texte: z.string().min(1),
    etapes: z.array(
      z.object({ numero: z.string().min(1), titre: z.string().min(1), texte: z.string().min(1) })
    ).min(1),
  }),
  cta: z.object({
    titre: z.string().min(1),
    texte: z.string().min(1),
    bouton: lien,
  }),
})

const pages = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/pages' }),
  // Astro 7.2.2 n'appelle un schéma-fonction qu'avec `{ image }` (voir
  // node_modules/astro/dist/content/utils.js, getEntryData) : jamais `{ id }`.
  // Un `schema: ({ id }) => …` reçoit donc toujours `id === undefined` et retombe
  // silencieusement sur la branche par défaut — aucune erreur, la validation stricte
  // ne s'exécute jamais. Une seule page existe pour l'instant : le schéma s'applique
  // directement. À la page suivante, dispatcher via `z.union([leLab, laProchaine])`.
  schema: leLab,
})

export const collections = { pages }
