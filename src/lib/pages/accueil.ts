import { z } from 'astro/zod'
import donnees from '../../content/pages/accueil.json'
import { bouton, carteIcone, icone, seo } from '../schemas'

const schema = z.object({
  seo,
  hero: z.object({
    kicker: z.string().min(1),
    titreAvant: z.string(),
    titreAccent: z.string().min(1),
    titreApres: z.string(),
    texte: z.string().min(1),
    cta: z.array(bouton).min(1),
  }),
  activites: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    texte: z.string().min(1),
    cercles: z.array(z.object({
      href: z.string().min(1),
      label: z.string().min(1),
      taillePolice: z.number(),
      texte: z.string().min(1),
    })).length(3),
  }),
  engagements: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    texte: z.string().min(1),
    cartes: z.array(z.object({
      numero: z.string().min(1),
      icone,
      titre: z.string().min(1),
      paragraphes: z.array(z.string().min(1)).min(1),
    })).length(3),
  }),
  smd: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    texte: z.string().min(1),
    citation: z.string().min(1),
    cartes: z.array(carteIcone).length(4),
  }),
  apropos: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    imageAlt: z.string().min(1),
    paragraphes: z.array(z.string().min(1)).min(1),
    etiquettes: z.array(z.string().min(1)),
  }),
  cta: z.object({
    titre: z.string().min(1),
    texte: z.string().min(1),
    boutons: z.array(bouton).min(1),
  }),
})

export const accueil = schema.parse(donnees)
