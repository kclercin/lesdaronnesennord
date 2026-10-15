// src/components/icons/index.ts
import IconTransmission from './IconTransmission.astro'
import IconPartage from './IconPartage.astro'
import IconExperience from './IconExperience.astro'
import IconMailGold from './IconMailGold.astro'
import IconFileGold from './IconFileGold.astro'
import IconBroomGold from './IconBroomGold.astro'
import IconLeafGold from './IconLeafGold.astro'
import IconCosmetic from './IconCosmetic.astro'
import IconSpray from './IconSpray.astro'
import IconChalk from './IconChalk.astro'
import IconRecycle from './IconRecycle.astro'
import IconLeafLab from './IconLeafLab.astro'
import IconTools from './IconTools.astro'
import IconSpark from './IconSpark.astro'
import IconRecipe from './IconRecipe.astro'
import IconKey from './IconKey.astro'
import IconFamily from './IconFamily.astro'
import IconGender from './IconGender.astro'
import IconLevel from './IconLevel.astro'
import IconPro from './IconPro.astro'
import IconCycle from './IconCycle.astro'
import IconImpact from './IconImpact.astro'

/** Clés utilisables dans les fichiers de contenu JSON. */
export const ICONES = {
  transmission: IconTransmission,
  partage: IconPartage,
  experience: IconExperience,
  'mail-or': IconMailGold,
  fichier: IconFileGold,
  balai: IconBroomGold,
  feuille: IconLeafGold,
  cosmetique: IconCosmetic,
  spray: IconSpray,
  craie: IconChalk,
  recyclage: IconRecycle,
  'feuille-lab': IconLeafLab,
  outils: IconTools,
  etincelle: IconSpark,
  recette: IconRecipe,
  cle: IconKey,
  famille: IconFamily,
  genre: IconGender,
  niveau: IconLevel,
  pro: IconPro,
  cycle: IconCycle,
  impact: IconImpact,
} as const

export type CleIcone = keyof typeof ICONES

/** Liste des clés — sert à générer les options du CMS et le schéma Zod. */
export const CLES_ICONES = Object.keys(ICONES) as CleIcone[]
