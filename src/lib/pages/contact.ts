import { z } from 'astro/zod'
import donnees from '../../content/pages/contact.json'
import { seo } from '../schemas'

const schema = z.object({
  seo,
  hero: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    texte: z.string().min(1),
  }),
  formulaire: z
    .object({
      kicker: z.string().min(1),
      titre: z.string().min(1),
      labelNom: z.string().min(1),
      placeholderNom: z.string().min(1),
      labelEmail: z.string().min(1),
      placeholderEmail: z.string().min(1),
      labelSujet: z.string().min(1),
      labelMessage: z.string().min(1),
      placeholderMessage: z.string().min(1),
      labelBouton: z.string().min(1),
      mentionSmd: z.string().min(1),
      sujets: z.array(z.string().min(1)).min(1),
      sujetLab: z.string().min(1),
    })
    .refine((f) => f.sujets.includes(f.sujetLab), {
      message: "sujetLab doit être l'un des sujets de la liste",
      path: ['sujetLab'],
    }),
  coordonnees: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
  }),
  ouTrouver: z.object({
    titre: z.string().min(1),
    texte: z.string().min(1),
  }),
  encartLab: z.object({
    titre: z.string().min(1),
    texte: z.string().min(1),
    bouton: z.string().min(1),
  }),
})

export const contact = schema.parse(donnees)
