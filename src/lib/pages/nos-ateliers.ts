import { z } from 'astro/zod'
import donnees from '../../content/pages/nos-ateliers.json'
import { carteIcone, seo } from '../schemas'

const schema = z.object({
  seo,
  hero: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    cercleLabel: z.string().min(1),
    texte: z.string().min(1),
    ctaLabel: z.string().min(1),
  }),
  cercleVertueux: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    texte: z.string().min(1),
    cartes: z.array(carteIcone).length(3),
  }),
  transmission: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    texte: z.string().min(1),
    cartes: z.array(carteIcone).length(3),
  }),
  pourTous: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    texte: z.string().min(1),
    cartes: z.array(carteIcone).length(3),
  }),
  catalogue: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    labelDeroule: z.string().min(1),
    labelDerouleOuvert: z.string().min(1),
    titreDeroule: z.string().min(1),
    titreRepartez: z.string().min(1),
    labelReservation: z.string().min(1),
  }),
  cta: z.object({
    titre: z.string().min(1),
    texte: z.string().min(1),
    labelBouton: z.string().min(1),
  }),
})

export const nosAteliers = schema.parse(donnees)
