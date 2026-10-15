import { z } from 'astro/zod'
import data from '../content/site.json'

const schema = z.object({
  email: z.string().email(),
  siteUrl: z.string().url(),
  zone: z.string().min(1),
  baseline: z.string().min(1),
  mentionLegale: z.string().min(1),
  mentionSmd: z.string().min(1),
  reservationZdtheque: z.string().url(),
  reservationAteliers: z.string().url(),
})

export const site = schema.parse(data)
