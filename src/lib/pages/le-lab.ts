import { z } from 'astro/zod'
import donnees from '../../content/pages/le-lab.json'
import { carteIcone, lien, seo } from '../schemas'

const schema = z.object({
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
    cartes: z.array(carteIcone).length(3),
  }),
  accompagnement: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    texte: z.string().min(1),
    etapes: z
      .array(
        z.object({
          numero: z.string().min(1),
          titre: z.string().min(1),
          texte: z.string().min(1),
        })
      )
      .min(1),
  }),
  cta: z.object({
    titre: z.string().min(1),
    texte: z.string().min(1),
    bouton: lien,
  }),
})

export const leLab = schema.parse(donnees)
