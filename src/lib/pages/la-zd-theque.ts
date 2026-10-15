import { z } from 'astro/zod'
import donnees from '../../content/pages/la-zd-theque.json'
import { bouton, carteIcone, seo } from '../schemas'

const schema = z.object({
  seo,
  hero: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    cercleLabel: z.string().min(1),
    texte: z.string().min(1),
    ctaLabel: z.string().min(1),
  }),
  propositions: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    texte: z.string().min(1),
    cartes: z.array(carteIcone).length(3),
  }),
  sessions: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    texte: z.string().min(1),
    horaire: z.string().min(1),
    labelReservation: z.string().min(1),
    carteFinale: z.object({
      surtitre: z.string().min(1),
      titre: z.string().min(1),
      texte: z.string().min(1),
      bouton: z.string().min(1),
    }),
  }),
  ateliers: z.object({
    titre: z.string().min(1),
    texte: z.string().min(1),
    cartes: z.array(carteIcone).length(4),
  }),
  cta: z.object({
    titre: z.string().min(1),
    texte: z.string().min(1),
    boutons: z.array(bouton).min(1),
  }),
})

export const laZdTheque = schema.parse(donnees)
