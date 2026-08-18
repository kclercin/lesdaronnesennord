# Migration Gatsby → Astro — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrer le site Les Daronnes en Nord de Gatsby 5 vers Astro 7, en extrayant le contenu vers des fichiers JSON éditables via Sveltia CMS et les styles inline vers du CSS, sans aucune modification du rendu visuel.

**Architecture:** Site 100 % statique, sans framework UI. Les 4 îlots React deviennent ~42 lignes de JS vanilla colocalisées. Le contenu part dans `src/content/` (validé par Zod au build, édité via Sveltia CMS avec un PAT GitHub). Les ~480 styles inline partent dans des `<style>` scoped Astro, adossés à un fichier de tokens. Déploiement Dokploy via buildpacks Heroku (`Procfile` + `serve`), Netlify conservé en cible secondaire.

**Tech Stack:** Astro 7.2.2, Node ≥ 22.12.0, Zod (via `astro/zod`), Sveltia CMS, `serve` 14, Playwright (captures de référence uniquement).

**Spec de référence:** `docs/superpowers/specs/2026-08-17-migration-gatsby-astro-design.md`

---

## Prérequis bloquant

**Node local est en v20.18.2. Astro 7 exige Node ≥ 22.12.0.** Rien ne peut démarrer sans ça.

```bash
node -v          # doit afficher v22.12.0 ou plus
```

Si ce n'est pas le cas : `nvm install 22 && nvm use 22` (ou `brew upgrade node`).
Ne pas continuer tant que `node -v` n'affiche pas ≥ 22.12.0.

---

## Note sur le niveau de détail de ce plan

Ce plan donne **intégralement** :
- tout le contenu JSON à créer (c'est une création, pas une transcription) ;
- tout le code des fichiers de configuration, des scripts JS et du CSS partagé ;
- la procédure de conversion exacte, démontrée de bout en bout sur une page pilote.

Il ne recopie **pas** les ~2 000 lignes de CSS extraites des 5 pages. La source de vérité de
ces styles est le fichier `.tsx` correspondant, que tu as sous les yeux pendant la conversion.
Chaque tâche de page liste ses sections, ses classes CSS à créer et son décompte de valeurs
numériques à corriger, pour que rien ne soit laissé à l'interprétation.

---

## Structure des fichiers

### Fichiers créés

| Fichier | Responsabilité |
|---|---|
| `astro.config.mjs` | site, intégration sitemap |
| `src/styles/tokens.css` | les 12 couleurs, 3 fontes, breakpoint — déclarés une fois |
| `src/styles/global.css` | reset, `body`, keyframes, composants partagés (`dc-*`, `rc-inp`) |
| `src/content.config.ts` | schémas Zod des collections — grandit page par page |
| `src/content/site.json` | réglages globaux (e-mail, zone, liens de réservation) |
| `src/content/pages/*.json` | 5 fichiers, un par page — sections + SEO |
| `src/content/ateliers/*.json` | 3 fichiers, collection |
| `src/content/sessions/*.json` | 5 fichiers, collection |
| `src/components/icons/*.astro` | 30 doodles, un fichier chacun |
| `src/components/icons/index.ts` | registre `ICONES` pour la résolution depuis le JSON |
| `src/lib/site.ts` | chargement + validation Zod de `site.json` |
| `src/lib/boutons.ts` | correspondance style JSON → classes CSS |
| `src/components/Layout.astro` | `<html>`, `<head>`, fontes, header + slot + footer |
| `src/components/SiteHeader.astro` | nav + burger vanilla |
| `src/components/SiteFooter.astro` | footer |
| `src/components/sections/CarteAtelier.astro` | fiche d'atelier + accordéon `<details>` |
| `src/pages/*.astro` | 6 pages |
| `public/admin/index.html` | point d'entrée Sveltia CMS |
| `public/admin/config.yml` | configuration Sveltia |
| `public/serve.json` | en-têtes de cache |
| `Procfile` | process web pour le buildpack |
| `scripts/capture-baseline.mjs` | captures de référence (jeté après usage) |

### Fichiers modifiés

| Fichier | Modification |
|---|---|
| `package.json` | scripts, `engines`, dépendances |
| `.gitignore` | retirer `public`, ajouter `dist/` |
| `netlify.toml` | `publish = "public"` → `"dist"` |
| `tsconfig.json` | remplacé par la config Astro |

### Fichiers supprimés (tâche 12)

`gatsby-config.ts`, `gatsby-browser.js`, `gatsby-ssr.js`, `postcss.config.js`, `tailwind.config.js`, `src/gatsby-types.d.ts`, `src/images.d.ts`, `src/data/sessions.json`, `src/components/doodles.tsx`, `src/components/Layout.tsx`, `src/components/SiteHeader.tsx`, `src/components/SiteFooter.tsx`, `src/pages/*.tsx`, `.cache/`

---

## Task 1: Références visuelles (le filet anti-régression)

Rien ne doit être modifié avant que les 18 références existent et soient committées. C'est la seule
protection contre les 324 valeurs numériques qui vont être retouchées à la main.

**Files:**
- Create: `scripts/capture-baseline.mjs`
- Create: `docs/superpowers/baseline/*.png` (18 fichiers)

- [ ] **Step 1: Vérifier que le build Gatsby existant est servable**

```bash
ls public/index.html && npx gatsby serve --port 9000 &
sleep 5
curl -s -o /dev/null -w 'HTTP %{http_code}\n' http://localhost:9000/
```

Expected: `HTTP 200`. Si `public/index.html` n'existe pas, lancer `npx gatsby build` d'abord.

- [ ] **Step 2: Écrire le script de capture**

```javascript
// scripts/capture-baseline.mjs
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = process.env.BASE ?? 'http://localhost:9000'
const OUT = process.env.OUT ?? 'docs/superpowers/baseline'

const PAGES = [
  ['accueil', '/'],
  ['nos-ateliers', '/nos-ateliers'],
  ['la-zd-theque', '/la-zd-theque'],
  ['le-lab', '/le-lab'],
  ['contact', '/contact'],
  ['404', '/page-qui-nexiste-pas'],
]

const WIDTHS = [360, 860, 1440]

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch()

for (const width of WIDTHS) {
  const page = await browser.newPage({ viewport: { width, height: 900 } })
  for (const [name, path] of PAGES) {
    await page.goto(BASE + path, { waitUntil: 'networkidle' })
    // les polices Google arrivent après networkidle et décalent la mise en page
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: `${OUT}/${name}-${width}.png`, fullPage: true })
    console.log(`${name}-${width}.png`)
  }
  await page.close()
}

await browser.close()
```

- [ ] **Step 3: Lancer la capture**

```bash
npx playwright install chromium
node scripts/capture-baseline.mjs
ls docs/superpowers/baseline | wc -l
```

Expected: `18`

- [ ] **Step 4: Vérifier visuellement deux références au hasard**

Ouvrir `docs/superpowers/baseline/accueil-360.png` et `nos-ateliers-1440.png`.
Elles doivent montrer le site complet, polices chargées, sans zone blanche.
Si les polices manquent, la comparaison finale sera fausse — recommencer.

- [ ] **Step 5: Arrêter le serveur Gatsby**

```bash
kill %1
```

- [ ] **Step 6: Commit**

```bash
git add scripts/capture-baseline.mjs docs/superpowers/baseline
git commit -m "chore: capturer les references visuelles avant migration"
```

---

## Task 2: Socle Astro

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`
- Create: `astro.config.mjs`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Delete: `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`, `public/`, `.cache/`

- [ ] **Step 1: Supprimer la sortie de build Gatsby et corriger le .gitignore**

`public/` est la **sortie** du build en Gatsby, mais un dossier **source** en Astro. Il doit
donc être supprimé puis dé-ignoré. À partir d'ici, ne plus jamais lancer `gatsby build` ni
`gatsby develop` : ils réécriraient dans `public/`. Les références visuelles de la tâche 1
remplacent le besoin de faire tourner Gatsby.

```bash
rm -rf public .cache
```

Nouveau contenu de `.gitignore` :

```
node_modules/
dist/
.astro/
.gstack/
.vscode/
```

> `.astro/` est le cache de types régénéré par chaque `astro build` / `astro dev`.
> Sans cette ligne, les `git add -A` des tâches suivantes le committeraient.

- [ ] **Step 2: Installer Astro et retirer Gatsby + Tailwind**

```bash
npm uninstall gatsby gatsby-plugin-image gatsby-plugin-postcss gatsby-plugin-sharp \
  gatsby-plugin-sitemap gatsby-source-filesystem gatsby-transformer-remark \
  gatsby-transformer-sharp react react-dom @types/react @types/react-dom \
  tailwindcss @tailwindcss/postcss autoprefixer postcss
npm install astro@^7 @astrojs/sitemap serve@^14
rm -f tailwind.config.js postcss.config.js tsconfig.json
```

- [ ] **Step 3: Écrire package.json**

`astro` et `serve` sont tous deux en `dependencies` — voir R6 et R10 de la spec.

```json
{
  "name": "les-daronnes-en-nord",
  "version": "2.0.0",
  "private": true,
  "type": "module",
  "description": "Site de l'association Les Daronnes en Nord",
  "author": "Kevin Clercin",
  "engines": { "node": ">=22.12.0" },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "start": "serve dist --listen tcp://0.0.0.0:$PORT --no-clipboard",
    "typecheck": "astro check"
  },
  "dependencies": {
    "@astrojs/sitemap": "^3",
    "astro": "^7",
    "serve": "^14"
  }
}
```

- [ ] **Step 4: Écrire astro.config.mjs**

```javascript
import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://lesdaronnesennord.fr',
  integrations: [sitemap()],
  build: { format: 'directory' },
})
```

- [ ] **Step 5: Écrire src/styles/tokens.css**

Les 12 couleurs relevées dans le JSX (249 occurrences), les 3 fontes (68 occurrences) et
l'unique breakpoint, déclarés une seule fois.

```css
:root {
  /* couleurs */
  --creme: #fbf6e9;
  --encre: #1b1a17;
  --encre-clair: #332f1f;
  --blanc: #ffffff;
  --or: #c9a227;
  --or-clair: #e8be36;
  --or-fonce: #b8911e;
  --or-doux: #d8b43a;
  --or-sombre: #c49c22;
  --texte: #4a463c;
  --texte-doux: #6b675c;
  --texte-or: #4a3c10;

  /* transparences récurrentes */
  --encre-08: rgba(27, 26, 23, 0.08);
  --encre-12: rgba(27, 26, 23, 0.12);
  --encre-14: rgba(27, 26, 23, 0.14);
  --creme-50: rgba(251, 246, 233, 0.5);
  --creme-66: rgba(251, 246, 233, 0.66);
  --creme-72: rgba(251, 246, 233, 0.72);
  --creme-78: rgba(251, 246, 233, 0.78);
  --creme-80: rgba(251, 246, 233, 0.8);
  --or-40: rgba(232, 190, 54, 0.4);
  --or-06: rgba(232, 190, 54, 0.06);

  /* typographie */
  --display: "Anton", sans-serif;
  --manuscrit: "Caveat", cursive;
  --corps: "Poppins", sans-serif;
}

/* Breakpoint unique du site : 860px.
   Répété littéralement dans chaque composant — les custom properties
   ne fonctionnent pas dans les conditions de media query. */
```

- [ ] **Step 6: Écrire src/styles/global.css**

Reprise intégrale de l'ancien `global.css`, **moins** `@import "tailwindcss"`, **moins** les 13
`!important`, **moins** les 9 classes `rc-*` de contournement de spécificité, **plus** un reset
explicite qui remplace le preflight Tailwind.

```css
@import "./tokens.css";

/* ---------- reset (remplace le preflight Tailwind) ---------- */
*,
*::before,
*::after {
  box-sizing: border-box;
}

body,
h1,
h2,
h3,
h4,
p,
figure,
blockquote,
dl,
dd,
ul,
ol {
  margin: 0;
}

ul,
ol {
  padding: 0;
  list-style: none;
}

button,
input,
select,
textarea {
  font: inherit;
  color: inherit;
}

img,
picture,
svg {
  display: block;
  max-width: 100%;
}

/* ---------- base ---------- */
html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--corps);
  background: var(--creme);
  color: var(--encre);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* ---------- animations ---------- */
@keyframes floaty {
  0%,
  100% {
    transform: translateY(0) rotate(var(--r, 0deg));
  }
  50% {
    transform: translateY(-10px) rotate(var(--r, 0deg));
  }
}

@keyframes twinkle {
  0%,
  100% {
    opacity: 0.35;
    transform: scale(0.85);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes rc-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.rc-rise {
  animation: rc-rise 0.7s ease both;
}

/* ---------- boutons (pilules) ---------- */
.dc-btn {
  text-decoration: none;
  display: inline-block;
  border: none;
  border-radius: 44px;
  font-family: var(--corps);
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.2s ease, border-color 0.2s ease,
    color 0.2s ease;
}
.dc-btn:active {
  transform: scale(0.95);
}
.dc-btn-dark {
  background: var(--encre);
  color: var(--creme);
}
.dc-btn-dark:hover {
  background: var(--encre-clair);
}
.dc-btn-outline {
  background: transparent;
  color: var(--encre);
  border: 2px solid var(--encre);
}
.dc-btn-outline-gold:hover {
  background: var(--or);
  border-color: var(--or);
}
.dc-btn-outline-fill:hover {
  background: var(--encre);
  color: var(--creme);
}
.dc-btn-gold {
  background: var(--or);
  color: var(--encre);
}
.dc-btn-gold:hover {
  background: var(--encre);
  color: var(--creme);
}
.dc-btn-gold-bright {
  background: var(--or);
  color: var(--encre);
}
.dc-btn-gold-bright:hover {
  background: var(--or-clair);
}
.dc-btn-ghost-light {
  background: transparent;
  color: var(--creme);
  border: 2px solid var(--creme-50);
}
.dc-btn-ghost-light:hover {
  background: rgba(251, 246, 233, 0.08);
  border-color: var(--creme);
}

/* ---------- effets de survol ---------- */
.dc-lift {
  transition: transform 0.2s ease;
}
.dc-lift:hover {
  transform: translateY(-6px);
}
.dc-lift-sm {
  transition: transform 0.2s ease;
}
.dc-lift-sm:hover {
  transform: translateY(-4px);
}
.dc-lift-sm:active {
  transform: scale(0.98);
}

/* ---------- flèches carrousel ---------- */
.dc-arrow {
  width: 50px;
  height: 50px;
  flex: none;
  cursor: pointer;
  border-radius: 50%;
  border: 2px solid var(--encre);
  font-size: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.dc-arrow:active {
  transform: scale(0.92);
}
.dc-arrow-light {
  background: var(--creme);
  color: var(--encre);
}
.dc-arrow-light:hover {
  background: var(--encre);
  color: var(--creme);
}
.dc-arrow-dark {
  background: var(--encre);
  color: var(--creme);
}
.dc-arrow-dark:hover {
  background: var(--encre-clair);
}

/* ---------- champs de formulaire ---------- */
.rc-inp {
  width: 100%;
  font-family: var(--corps);
  font-size: 15px;
  color: var(--encre);
  background: var(--blanc);
  border: 2px solid var(--encre);
  border-radius: 14px;
  padding: 13px 16px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.rc-inp:focus {
  border-color: var(--or);
  box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.25);
}
.rc-inp::placeholder {
  color: #9c978a;
}
```

- [ ] **Step 7: Vérifier que le socle construit**

```bash
npm run build
```

Expected: **succès avec avertissements** (code de sortie 0), et `dist/` vide :

```
[WARN] Unsupported file type .../src/pages/index.tsx found in pages directory.
[WARN] [@astrojs/sitemap] No pages found! `sitemap-index.xml` not created.
[build] 0 page(s) built
```

Astro 7 traite l'absence de page comme un avertissement, pas une erreur. `src/pages/` ne contient
encore que des `.tsx`, qu'Astro ignore — les pages arrivent en tâches 5 à 9.
Si le build échoue pour une **autre** raison (syntaxe CSS, module introuvable), c'est un vrai
problème à corriger.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: socle Astro (config, tokens, global.css sans Tailwind)"
```

---

## Task 3: Composants icônes

`src/components/doodles.tsx` exporte 30 composants SVG. Ils deviennent 30 fichiers `.astro` plus
un registre qui permet de les résoudre depuis une clé JSON.

**Files:**
- Create: `src/components/icons/<Nom>.astro` × 30
- Create: `src/components/icons/index.ts`

> **Cas particulier de `Logo`** (`doodles.tsx:323`) : il ne dessine pas un SVG, il affiche le PNG
> `src/images/logo-daronnes.png`. C'est une image de **design** (catégorie « non éditable au
> CMS », §5 de la spec) : elle reste dans `src/images/` et passe par `<Image>` d'Astro.
>
> ```astro
> ---
> // src/components/icons/Logo.astro
> import { Image } from 'astro:assets'
> import logo from '../../images/logo-daronnes.png'
> interface Props { height?: number }
> const { height = 54 } = Astro.props
> ---
> <Image src={logo} alt="Les Daronnes en Nord" height={height} densities={[1, 2]} />
> ```

- [ ] **Step 1: Convertir chaque doodle en composant .astro**

Les 30 exports à convertir, dans l'ordre du fichier source :

`Sparkle`, `Bottles`, `Plant`, `LogoCircle`, `IconTransmission`, `IconPartage`, `IconExperience`,
`IconMailGold`, `IconFileGold`, `IconBroomGold`, `IconLeafGold`, `IconCosmetic`, `IconSpray`,
`IconChalk`, `IconRecycle`, `IconLeafLab`, `IconTools`, `IconSpark`, `IconRecipe`, `IconKey`,
`IconFamily`, `IconGender`, `IconLevel`, `IconPro`, `IconCycle`, `IconImpact`, `IconMailLine`,
`IconGlobe`, `IconPin`, `Logo`.

Règles de conversion, appliquées à chacun :

| JSX | `.astro` |
|---|---|
| `({ size = 30 }: { size?: number })` | `const { size = 30 } = Astro.props` dans le frontmatter |
| `strokeWidth={2.2}` | `stroke-width="2.2"` |
| `strokeLinecap="round"` | `stroke-linecap="round"` |
| `fillRule` / `clipRule` | `fill-rule` / `clip-rule` |
| `aria-hidden="true"` | inchangé |
| `style={{ ... }}` | attribut CSS littéral ou `<style>` scoped |

Exemple complet, pour `Sparkle` (source : `doodles.tsx:27-45`) :

```astro
---
// src/components/icons/Sparkle.astro
interface Props {
  size?: number
  color?: string
}
const { size = 26, color = '#E8BE36' } = Astro.props
---

<svg
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  aria-hidden="true"
>
  <path
    d="M12 2 L13.8 9.2 L21 11 L13.8 12.8 L12 20 L10.2 12.8 L3 11 L10.2 9.2 Z"
    fill={color}
  />
</svg>
```

> Reprendre le tracé SVG **exact** du fichier source pour chaque icône — ne rien redessiner.

- [ ] **Step 2: Écrire le registre**

Ce registre est ce qui permet à un JSON de contenu de désigner une icône par une chaîne, sans
jamais contenir de JSX (voir §5 de la spec).

```typescript
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
```

- [ ] **Step 3: Vérifier le compte**

```bash
ls src/components/icons/*.astro | wc -l
```

Expected: `30` — `LogoCircle` et `Logo` inclus. Comparer avec la liste source :

```bash
git show HEAD:src/components/doodles.tsx | grep -cE "^export (const|function)"
```

Expected: `30` également. Les deux nombres doivent correspondre.

- [ ] **Step 4: Commit**

```bash
git add src/components/icons
git commit -m "feat: doodles convertis en composants Astro + registre d'icones"
```

---

## Task 4: Layout, header, footer et réglages du site

**Files:**
- Create: `src/content/site.json`
- Create: `src/content.config.ts`
- Create: `src/components/Layout.astro`
- Create: `src/components/SiteHeader.astro`
- Create: `src/components/SiteFooter.astro`

- [ ] **Step 1: Écrire les réglages globaux**

```json
{
  "email": "bienvenue@lesdaronnesennord.fr",
  "siteUrl": "https://lesdaronnesennord.fr",
  "zone": "Métropole lilloise · Nord (59)",
  "baseline": "Ateliers de cosmétiques maison & zéro déchet, dans la métropole lilloise. Apprendre, partager, agir — au naturel.",
  "mentionLegale": "Association loi 1901",
  "mentionSmd": "Zéro écran, 100 % humain · Site éco-conçu (SMD)",
  "reservationZdtheque": "https://booking.myrezapp.com/fr/online/booking/minisite/16074/les-daronnes-en-nord",
  "reservationAteliers": "https://wecandoo.fr/artisan/lille-cosmetique-audrey"
}
```

- [ ] **Step 2: Écrire le schéma de validation**

À ce stade, seuls les réglages du site sont validés. Ce fichier grandira à chaque page.

```typescript
// src/content.config.ts
import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const pages = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/pages' }),
  schema: z.object({
    seo: z.object({
      titre: z.string().min(1),
      description: z.string().optional(),
    }),
  }).passthrough(),
})

export const collections = { pages }
```

> `.passthrough()` laisse passer les clés de section non encore déclarées. Chaque tâche de page
> remplacera progressivement ce laissez-passer par un schéma strict.

```typescript
// src/lib/site.ts
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
```

- [ ] **Step 3: Écrire le Layout**

Les `<link>` de fontes reprennent exactement ceux de `gatsby-ssr.js` (décision D6 : Google Fonts
conservées). Les favicons pointent vers `public/` — les 6 PNG et `robots.txt` de l'ancien
`static/` doivent être déplacés dans `public/` :

```bash
mv static/* public/ && rmdir static
```

```astro
---
// src/components/Layout.astro
import SiteHeader from './SiteHeader.astro'
import SiteFooter from './SiteFooter.astro'
import '../styles/global.css'

interface Props {
  titre: string
  description?: string
  active?: '' | 'accueil' | 'zdtheque' | 'lab' | 'ateliers' | 'contact'
}

const { titre, description, active = '' } = Astro.props
---

<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{titre}</title>
    {description && <meta name="description" content={description} />}
    <link rel="sitemap" href="/sitemap-index.xml" />

    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180.png" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap"
    />
  </head>
  <body>
    <SiteHeader active={active} />
    <slot />
    <SiteFooter />
  </body>
</html>

<style>
  body {
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
  }
</style>
```

- [ ] **Step 4: Écrire le header avec le burger en vanilla**

Remplace `useState(open)` (`SiteHeader.tsx:64`). Le panneau et les deux icônes restent dans le
DOM ; c'est le CSS qui décide de l'affichage à partir de `aria-expanded`.

```astro
---
// src/components/SiteHeader.astro
import Logo from './icons/Logo.astro'

interface Props {
  active?: string
}
const { active = '' } = Astro.props

const NAV = [
  { label: 'Bienvenue', href: '/#bonjour', cle: '' },
  { label: "La ZD'thèque", href: '/la-zd-theque', cle: 'zdtheque' },
  { label: 'Le LAB', href: '/le-lab', cle: 'lab' },
  { label: 'Nos ateliers artisans', href: '/nos-ateliers', cle: 'ateliers' },
  { label: 'Contact', href: '/contact', cle: 'contact' },
]
---

<header class="entete">
  <a href="/" aria-label="Les Daronnes en Nord — accueil" class="marque">
    <Logo height={54} />
  </a>

  <nav class="liens">
    {
      NAV.map((item) => (
        <a href={item.href} class="dc-nav-link" aria-current={item.cle && item.cle === active ? 'page' : undefined}>
          {item.label}
        </a>
      ))
    }
    <a href="/la-zd-theque#sessions" class="dc-btn dc-btn-dark reserver">Réserver un atelier</a>
  </nav>

  <button type="button" class="dc-burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="menu-mobile">
    <svg class="i-ouvrir" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
      <path d="M4 7h16 M4 12h16 M4 17h16"></path>
    </svg>
    <svg class="i-fermer" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
      <path d="M5 5 19 19 M19 5 5 19"></path>
    </svg>
  </button>

  <div class="panneau" id="menu-mobile" hidden>
    {
      NAV.map((item) => (
        <a href={item.href} class="lien-mobile" aria-current={item.cle && item.cle === active ? 'page' : undefined}>
          {item.label}
        </a>
      ))
    }
    <a href="/la-zd-theque#sessions" class="dc-btn dc-btn-dark cta-mobile">Réserver un atelier</a>
  </div>
</header>

<script>
  const burger = document.querySelector<HTMLButtonElement>('.dc-burger')!
  const panneau = document.querySelector<HTMLElement>('#menu-mobile')!

  const definirEtat = (ouvert: boolean) => {
    burger.setAttribute('aria-expanded', String(ouvert))
    burger.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu')
    panneau.hidden = !ouvert
  }

  burger.addEventListener('click', () => {
    definirEtat(burger.getAttribute('aria-expanded') !== 'true')
  })

  panneau.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) definirEtat(false)
  })
</script>

<style>
  .entete {
    position: sticky;
    top: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 14px clamp(20px, 5vw, 56px);
    background: rgba(251, 246, 233, 0.92);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--encre-12);
  }

  .marque {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
  }

  .liens {
    display: flex;
    align-items: center;
    gap: 26px;
  }

  .reserver {
    font-size: 14px;
    padding: 11px 20px;
  }

  /* soulignement or de la page courante — remplaçait <Underline /> */
  .dc-nav-link[aria-current='page']::after {
    content: '';
    display: block;
    height: 2.5px;
    background: var(--or);
    border-radius: 2px;
    margin-top: 3px;
  }

  .dc-burger {
    display: none;
    align-items: center;
    justify-content: center;
    width: 46px;
    height: 46px;
    padding: 0;
    border: 2px solid var(--encre);
    border-radius: 14px;
    background: transparent;
    color: var(--encre);
    cursor: pointer;
    transition: background 0.2s ease, color 0.2s ease;
  }
  .dc-burger:hover {
    background: var(--encre);
    color: var(--creme);
  }

  .dc-burger .i-fermer {
    display: none;
  }
  .dc-burger[aria-expanded='true'] .i-ouvrir {
    display: none;
  }
  .dc-burger[aria-expanded='true'] .i-fermer {
    display: block;
  }

  .panneau {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--creme);
    border-bottom: 1px solid var(--encre-12);
    box-shadow: 0 18px 30px -22px rgba(27, 26, 23, 0.6);
    display: flex;
    flex-direction: column;
    padding: 10px clamp(20px, 5vw, 56px) 20px;
    gap: 2px;
  }
  .panneau[hidden] {
    display: none;
  }

  .lien-mobile {
    text-decoration: none;
    color: var(--encre);
    font-weight: 500;
    font-size: 17px;
    padding: 14px 4px;
    border-bottom: 1px solid var(--encre-08);
  }
  .lien-mobile:last-of-type {
    border-bottom: none;
  }
  .lien-mobile[aria-current='page'] {
    color: var(--or-fonce);
  }

  .cta-mobile {
    margin-top: 12px;
    text-align: center;
    padding: 14px 20px;
    font-size: 15px;
  }

  @media (max-width: 860px) {
    .liens {
      display: none;
    }
    .dc-burger {
      display: inline-flex;
    }
  }
</style>
```

> `.dc-nav-link` reste dans `global.css` (déjà écrit en tâche 2).

- [ ] **Step 5: Écrire le footer**

Source : `SiteFooter.tsx`. L'année est calculée au build — le site étant statique, elle se met à
jour au prochain déploiement, ce qui est le comportement actuel côté SSR.

```astro
---
// src/components/SiteFooter.astro
import Logo from './icons/Logo.astro'
import { site } from '../lib/site'

const annee = new Date().getFullYear()

const NAVIGATION = [
  { label: 'Bonjour', href: '/#bonjour' },
  { label: 'Nos engagements', href: '/#engagements' },
  { label: "La ZD'thèque", href: '/la-zd-theque' },
  { label: 'Le LAB', href: '/le-lab' },
  { label: 'Nos ateliers', href: '/nos-ateliers' },
  { label: 'À propos', href: '/#apropos' },
]
---

<footer class="pied">
  <div class="haut">
    <div>
      <span class="cartouche"><Logo height={92} /></span>
      <p class="baseline">{site.baseline}</p>
    </div>

    <div class="colonnes">
      <div>
        <div class="titre-col">Navigation</div>
        {NAVIGATION.map((l) => <a href={l.href} class="lien">{l.label}</a>)}
      </div>
      <div>
        <div class="titre-col">Contact</div>
        <a href="/contact" class="lien">Contact</a>
        <span class="zone">{site.zone}</span>
      </div>
    </div>
  </div>

  <div class="bas">
    <span>© {annee} Les Daronnes en Nord — {site.mentionLegale}</span>
    <span>{site.mentionSmd}</span>
  </div>
</footer>

<style>
  .pied {
    background: var(--encre);
    color: var(--creme);
    padding: clamp(40px, 5vw, 64px) clamp(20px, 5vw, 56px) 32px;
  }

  .haut {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.3fr 1fr;
    gap: 40px;
    align-items: start;
  }

  .cartouche {
    display: inline-block;
    background: var(--creme);
    padding: 14px 20px;
    border-radius: 20px;
  }

  .baseline {
    margin-top: 16px;
    max-width: 38ch;
    font-size: 15px;
    line-height: 1.6;
    color: var(--creme-66);
  }

  .colonnes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .titre-col {
    font-family: var(--display);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 13px;
    color: var(--or-clair);
    margin-bottom: 12px;
  }

  .lien {
    display: block;
    text-decoration: none;
    color: var(--creme-80);
    font-size: 15px;
    padding: 5px 0;
  }

  .zone {
    display: block;
    color: var(--creme-50);
    font-size: 13px;
    padding-top: 8px;
  }

  .bas {
    max-width: 1100px;
    margin: 28px auto 0;
    padding-top: 20px;
    border-top: 1px solid rgba(251, 246, 233, 0.14);
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: space-between;
    font-size: 13px;
    color: var(--creme-50);
  }

  @media (max-width: 860px) {
    .haut {
      grid-template-columns: 1fr;
    }
  }
</style>
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: layout, header (burger vanilla) et footer en Astro"
```

---

## Task 5: Page Le LAB (page pilote)

Page la plus simple : 121 lignes, 36 valeurs numériques, aucune interactivité. Elle sert à
valider le patron de conversion avant de l'appliquer aux pages complexes.

**Files:**
- Create: `src/content/pages/le-lab.json`
- Create: `src/pages/le-lab.astro`
- Modify: `src/content.config.ts`
- Delete: `src/pages/le-lab.tsx`

### Le patron de conversion (à réutiliser pour toutes les pages suivantes)

Pour chaque section du `.tsx` :

1. **Extraire le texte** vers le JSON de la page, sous une clé nommée d'après la section.
2. **Extraire les styles** : chaque objet `style={{…}}` devient une règle CSS dans le `<style>`
   du fichier. Nommer la classe d'après le rôle (`.hero`, `.carte`, `.titre`), sans préfixe : le
   scoping Astro garantit l'absence de collision.
3. **Ajouter les unités** : toute valeur numérique de style prend `px`, **sauf**
   `z-index`, `line-height`, `opacity`, `font-weight`, `flex`, `flex-grow`, `flex-shrink`,
   `order`, `aspect-ratio`. C'est le piège R3 — Astro n'ajoute pas les `px` (vérifié).
4. **Convertir le camelCase** en kebab-case (`backgroundColor` → `background-color`).
5. **Remplacer les couleurs** par les tokens de `tokens.css`.
6. **Déplacer les media queries** : les anciennes classes `rc-2`/`rc-3` deviennent une media
   query `@media (max-width: 860px)` locale, **sans `!important`**.

- [ ] **Step 1: Écrire le contenu**

```json
{
  "seo": {
    "titre": "Le LAB — Accompagnement des artisans & créateurs | Les Daronnes en Nord",
    "description": "Le LAB accompagne artisans, créateurs et porteurs de projet pour concevoir, structurer et animer leurs propres ateliers au naturel dans la métropole lilloise."
  },
  "hero": {
    "kicker": "Incubateur de partage pour artisans & créateurs",
    "titre": "Le LAB",
    "cercleLabel": "Le LAB",
    "texte": "Vous êtes artisan, créateur ou porteur de projet et vous souhaitez transmettre votre savoir-faire à travers des ateliers ? <strong>Ne restez pas seul !</strong> Le LAB met à votre disposition un lieu et une équipe pluridisciplinaire pour concevoir, structurer et animer vos propres ateliers tout naturellement.",
    "cta": { "label": "Travaillons ensemble !", "href": "/contact?sujet=lab#form" }
  },
  "pourQui": {
    "kicker": "Pour qui ?",
    "titre": "Le LAB est fait pour vous si…",
    "cartes": [
      {
        "icone": "feuille-lab",
        "titre": "Créateurs éco-responsables",
        "texte": "Cosmétiques, upcycling, zéro déchet : vous portez des produits ou un savoir-faire qui ont du sens."
      },
      {
        "icone": "outils",
        "titre": "Artisans en développement",
        "texte": "Vous voulez diversifier votre activité et créer une nouvelle source de revenus grâce à la transmission."
      },
      {
        "icone": "etincelle",
        "titre": "Futurs animateurs",
        "texte": "Vous souhaitez animer des ateliers de manière impactante et professionnelle, sans partir de zéro."
      }
    ]
  },
  "accompagnement": {
    "kicker": "Notre accompagnement",
    "titre": "De l'idée à l'atelier qui tourne",
    "texte": "Une équipe pluridisciplinaire à vos côtés, étape par étape — pour que votre atelier soit clair, fluide et fidèle à vos valeurs.",
    "etapes": [
      { "numero": "01", "titre": "Concevoir", "texte": "On clarifie votre intention, votre public et le fil pédagogique de l'atelier." },
      { "numero": "02", "titre": "Structurer", "texte": "Déroulé, matériel, recettes, sécurité : on pose un cadre solide et reproductible." },
      { "numero": "03", "titre": "Animer", "texte": "On vous coache sur la posture et le rythme pour des ateliers vivants et conviviaux." }
    ]
  },
  "cta": {
    "titre": "Ne restez pas seul·e avec votre idée",
    "texte": "Parlons de votre projet d'atelier — on vous dit en toute transparence comment Le LAB peut vous aider.",
    "bouton": { "label": "Travaillons ensemble !", "href": "/contact?sujet=lab#form" }
  }
}
```

> **Sur les `<strong>` dans le JSON :** le texte du hero contient du balisage. Il sera rendu via
> `set:html`. C'est volontaire et limité aux champs qui en contenaient déjà dans le JSX. Côté CMS,
> ces champs utiliseront un widget `markdown` ou `string` selon le cas.

- [ ] **Step 2: Écrire un test de validation qui échoue**

Avant d'écrire le schéma, prouver qu'il manque. Créer temporairement un contenu invalide :

```bash
cp src/content/pages/le-lab.json /tmp/le-lab.ok.json
node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('src/content/pages/le-lab.json','utf8'));
d.hero.titre='';
fs.writeFileSync('src/content/pages/le-lab.json', JSON.stringify(d,null,2));
"
npm run build
```

Expected: le build **réussit** (le schéma actuel est en `.passthrough()` et ne valide pas `hero`).
C'est le défaut à corriger.

- [ ] **Step 3: Écrire le schéma qui rend ce contenu invalide**

```typescript
// src/content.config.ts
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
  schema: ({ id }) => {
    // Un schéma par page : chaque page a ses propres sections.
    if (id === 'le-lab') return leLab
    return z.object({ seo }).passthrough()
  },
})

export const collections = { pages }
```

- [ ] **Step 4: Vérifier que le build échoue sur le contenu invalide**

```bash
npm run build
```

Expected: FAIL, avec un message mentionnant `hero.titre` et « String must contain at least 1
character ». C'est la garantie du critère d'acceptation n°3.

- [ ] **Step 5: Restaurer le contenu valide et vérifier que le build passe**

```bash
cp /tmp/le-lab.ok.json src/content/pages/le-lab.json
npm run build
```

Expected: PASS.

- [ ] **Step 6: Écrire le template**

Sections à produire, dans l'ordre du fichier source `le-lab.tsx` :

| Section source | Classe racine | Notes de conversion |
|---|---|---|
| HERO (l. 21-43) | `.hero` | grille 2 colonnes `1fr 1.1fr` → 1 colonne sous 860px ; `LogoCircle` à gauche |
| POUR QUI (l. 46-62) | `.pour-qui` | 3 cartes ; les 3 `border-radius` organiques sont des **valeurs de présentation** → restent dans le CSS, pas dans le JSON |
| ACCOMPAGNEMENT (l. 65-87) | `.accompagnement` | fond `--encre`, `Sparkle` flottant en absolu avec `--r: 8deg` |
| CTA BAND (l. 90-106) | `.cta` | dégradé or, 2 `Sparkle` animés `floaty` |

```astro
---
// src/pages/le-lab.astro
import { getEntry } from 'astro:content'
import Layout from '../components/Layout.astro'
import LogoCircle from '../components/icons/LogoCircle.astro'
import Sparkle from '../components/icons/Sparkle.astro'
import { ICONES } from '../components/icons'

const { data } = await getEntry('pages', 'le-lab')!
const { seo, hero, pourQui, accompagnement, cta } = data

// Les rayons organiques des 3 cartes « pour qui » sont de la présentation pure :
// ils suivent la position, pas le contenu.
const RAYONS = [
  '240px 18px 220px 18px / 18px 220px 18px 240px',
  '18px 220px 18px 240px / 240px 18px 220px 18px',
  '220px 18px 240px 18px / 18px 240px 18px 220px',
]
---

<Layout titre={seo.titre} description={seo.description} active="lab">
  <section class="hero">
    <div class="hero-grille">
      <div class="hero-cercle">
        <LogoCircle label={hero.cercleLabel} fontSize={30} color="#1B1A17" />
      </div>
      <div>
        <div class="kicker-manuscrit">{hero.kicker}</div>
        <h1 class="hero-titre">{hero.titre}</h1>
        <p class="hero-texte" set:html={hero.texte} />
        <a href={hero.cta.href} class="dc-btn dc-btn-dark hero-cta">{hero.cta.label}</a>
      </div>
    </div>
  </section>

  <section class="pour-qui">
    <div class="conteneur">
      <div class="entete-centree">
        <div class="kicker">{pourQui.kicker}</div>
        <h2 class="titre-manuscrit">{pourQui.titre}</h2>
      </div>
      <div class="grille-3">
        {
          pourQui.cartes.map((carte, i) => {
            const Icone = ICONES[carte.icone]
            return (
              <article class="carte" style={`border-radius:${RAYONS[i]}`}>
                <div class="carte-icone"><Icone /></div>
                <h3 class="carte-titre">{carte.titre}</h3>
                <p class="carte-texte">{carte.texte}</p>
              </article>
            )
          })
        }
      </div>
    </div>
  </section>

  <!-- … sections accompagnement et cta, même patron … -->
</Layout>

<style>
  /* Toutes les règles extraites de le-lab.tsx.
     Rappel : 36 valeurs numériques nécessitent px. */
  .hero {
    padding: clamp(40px, 6vw, 80px) clamp(20px, 5vw, 56px) clamp(48px, 6vw, 84px);
    background: var(--creme);
    position: relative;
    overflow: hidden;
    border-bottom: 1px solid var(--encre-08);
  }

  .hero-grille {
    max-width: 1120px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1.1fr;
    gap: clamp(28px, 5vw, 60px);
    align-items: center;
  }

  .hero-cercle {
    width: min(450px, 100%);
    aspect-ratio: 1;
    margin: 0 auto;
  }

  .kicker-manuscrit {
    font-family: var(--manuscrit);
    font-size: 34px;
    color: var(--or-fonce);
    transform: rotate(-1deg);
    line-height: 1;
  }

  .hero-titre {
    margin-top: 6px;
    font-family: var(--display);
    text-transform: uppercase;
    font-weight: 400;
    font-size: clamp(56px, 9vw, 104px);
    line-height: 0.9;
    letter-spacing: 0.5px;
    color: var(--encre);
  }

  .hero-texte {
    margin-top: 18px;
    font-size: 17px;
    line-height: 1.7;
    color: var(--texte);
    max-width: 46ch;
  }

  .hero-cta {
    display: inline-block;
    margin-top: 26px;
    font-weight: 700;
    font-size: 16px;
    padding: 15px 30px;
  }

  /* … le reste des sections … */

  @media (max-width: 860px) {
    .hero-grille {
      grid-template-columns: 1fr;
    }
    .grille-3 {
      grid-template-columns: 1fr;
    }
    /* remplace .rc-htitle-lg { font-size: 72px !important } */
    .hero-titre {
      font-size: 72px;
    }
  }
</style>
```

- [ ] **Step 7: Supprimer l'ancienne page et construire**

```bash
rm src/pages/le-lab.tsx
npm run build
```

Expected: PASS, et `dist/le-lab/index.html` existe.

- [ ] **Step 8: Comparer visuellement aux références**

```bash
npm run preview -- --port 9100 &
sleep 3
BASE=http://localhost:9100 OUT=/tmp/apres node scripts/capture-baseline.mjs
kill %1
```

Ouvrir côte à côte, pour chacune des 3 largeurs :
- `docs/superpowers/baseline/le-lab-360.png` ↔ `/tmp/apres/le-lab-360.png`
- idem en 860 et 1440

**Critère :** aucune différence de taille de texte, d'espacement ni de position.
Le 860 est le plus à risque (suppression des `!important`).
Corriger tout écart avant de passer à la tâche suivante.

- [ ] **Step 9: Vérifier qu'aucun JS n'est livré**

```bash
find dist -name '*.js' | wc -l
```

Expected: `0` (le LAB n'a aucune interactivité).

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: page Le LAB en Astro, contenu extrait en JSON"
```

---

## Task 6: Page Accueil

Page la plus riche : 444 lignes, 69 valeurs numériques, 6 sections. Aucune interactivité.

**Files:**
- Create: `src/content/pages/accueil.json`
- Create: `src/pages/index.astro`
- Modify: `src/content.config.ts`
- Delete: `src/pages/index.tsx`

- [ ] **Step 1: Écrire le contenu**

```json
{
  "seo": {
    "titre": "Les Daronnes en Nord — Ateliers cosmétiques maison & zéro déchet à Lille",
    "description": "Ateliers de cosmétiques maison et zéro déchet à Lille et dans la métropole lilloise, animés par Les Daronnes en Nord. Apprendre, partager, agir — au naturel."
  },
  "hero": {
    "kicker": "Bienvenue, ravies de vous voir",
    "titreAvant": "Réapprendre à ",
    "titreAccent": "faire soi-même",
    "titreApres": " au naturel.",
    "texte": "Ateliers de cosmétiques maison et zéro déchet à Lille et dans la métropole, animés par <strong>Les Daronnes en Nord</strong>. On touche les matières, on formule, on rit.",
    "cta": [
      { "label": "Découvrir nos activités", "href": "/la-zd-theque", "style": "sombre" },
      { "label": "Réserver un atelier", "href": "/la-zd-theque#sessions", "style": "contour-or" }
    ]
  },
  "activites": {
    "kicker": "Apprendre · Partager · Agir",
    "titre": "Nos activités",
    "texte": "Réapprendre à faire soi-même au naturel.",
    "cercles": [
      { "href": "/la-zd-theque", "label": "La ZD'thèque", "taillePolice": 26, "texte": "Sessions gratuites zéro déchet & cosmétiques maison" },
      { "href": "/le-lab", "label": "Le LAB", "taillePolice": 30, "texte": "Accompagnement des artisans & créateurs" },
      { "href": "/nos-ateliers", "label": "Les Ateliers\nd'Artisans", "taillePolice": 24, "texte": "Les recettes & savoir-faire qu'on y fabrique" }
    ]
  },
  "engagements": {
    "kicker": "Nos engagements",
    "titre": "Créateurs de liens\net d'autonomie",
    "texte": "Chez les Daronnes, le savoir ne se garde pas : il se transmet de main en main.",
    "cartes": [
      {
        "numero": "01",
        "icone": "transmission",
        "titre": "La transmission du savoir-faire",
        "paragraphes": [
          "<strong>Grand public —</strong> des ateliers pratiques et accessibles pour réapprendre les gestes de l'autonomie : cosmétiques naturels, produits ménagers sains, upcycling.",
          "<strong>Professionnels —</strong> via <em>Le LAB</em>, notre équipe pluridisciplinaire coache artisans et créateurs pour concevoir et animer leurs propres ateliers."
        ]
      },
      {
        "numero": "02",
        "icone": "partage",
        "titre": "Le partage équitable",
        "paragraphes": [
          "Une écologie généreuse, qui fait du bien au portefeuille comme à la planète.",
          "<strong>La ZD'thèque —</strong> des sessions gratuites d'entraide et de troc de connaissances, où l'on prend soin de nos objets, où l'on teste et où l'on crée ensemble, au local, sans aucun jugement."
        ]
      },
      {
        "numero": "03",
        "icone": "experience",
        "titre": "Vivre des expériences uniques",
        "paragraphes": [
          "On retient 10 % de ce qu'on lit, mais 90 % de ce que l'on fait. Place à l'expérience concrète, sensorielle et humaine.",
          "Nos ateliers sont des bulles de déconnexion numérique, ancrées au cœur de notre région."
        ]
      }
    ]
  },
  "smd": {
    "kicker": "Notre politique SMD",
    "titre": "Service\nMinimum\nDigital",
    "texte": "En cohérence avec nos ateliers, on applique le numérique au strict nécessaire. Moins d'écrans, moins de données, plus d'humain.",
    "citation": "« Le meilleur octet est celui qu'on n'envoie pas. »",
    "cartes": [
      { "icone": "mail-or", "titre": "Sobriété des échanges", "texte": "Priorité aux circuits courts : une newsletter mensuelle plutôt que dix mails." },
      { "icone": "fichier", "titre": "Légèreté des fichiers", "texte": "Documents compressés et liens éphémères plutôt que pièces jointes lourdes." },
      { "icone": "balai", "titre": "Nettoyage régulier", "texte": "Campagnes annuelles de suppression des données inutiles sur notre cloud." },
      { "icone": "feuille", "titre": "Low-tech", "texte": "Sites web légers et éco-conçus, stockage vidéo HD limité au minimum." }
    ]
  },
  "apropos": {
    "kicker": "À propos",
    "titre": "Les Daronnes\nen Nord",
    "imageAlt": "L'équipe des Daronnes en Nord",
    "paragraphes": [
      "Nous transformons de grands enjeux écologiques en gestes simples, ludiques et conviviaux. Le passage à l'action n'est pas une contrainte, mais une occasion de mieux consommer, de faire des économies et de redécouvrir le plaisir du « faire soi-même ».",
      "Nos rendez-vous sont <strong>anonymes et sans jugement</strong> — à Lille, Villeneuve-d'Ascq, Lys-lez-Lannoy et partout dans la métropole."
    ],
    "etiquettes": ["Apprendre", "Partager", "Agir"]
  },
  "cta": {
    "titre": "Venez pas les mains vides !",
    "texte": "Alimentez notre ZD'thèque avec vos petits trésors du quotidien comme des bocaux, des boîtes d'œufs, tissus en coton, tee-shirts, linge de maison, des journaux…",
    "boutons": [
      { "label": "Réserver un atelier gratuit", "href": "/la-zd-theque#sessions", "style": "sombre" },
      { "label": "Voir nos activités", "href": "/la-zd-theque", "style": "contour-plein" }
    ]
  }
}
```

- [ ] **Step 2: Ajouter le schéma `accueil` à content.config.ts**

```typescript
const styleBouton = z.enum(['sombre', 'contour-or', 'contour-plein', 'or', 'or-vif', 'fantome'])
const bouton = z.object({
  label: z.string().min(1),
  /** Vide si `externe` est vrai : l'URL vient alors de site.json. */
  href: z.string(),
  style: styleBouton,
  /** true → lien de réservation externe (site.reservationAteliers), ouvert dans un nouvel onglet. */
  externe: z.boolean().optional(),
})

const accueil = z.object({
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
    cercles: z.array(
      z.object({
        href: z.string().min(1),
        label: z.string().min(1),
        taillePolice: z.number(),
        texte: z.string().min(1),
      })
    ).length(3),
  }),
  engagements: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    texte: z.string().min(1),
    cartes: z.array(
      z.object({
        numero: z.string().min(1),
        icone,
        titre: z.string().min(1),
        paragraphes: z.array(z.string().min(1)).min(1),
      })
    ).length(3),
  }),
  smd: z.object({
    kicker: z.string().min(1),
    titre: z.string().min(1),
    texte: z.string().min(1),
    citation: z.string().min(1),
    cartes: z.array(
      z.object({ icone, titre: z.string().min(1), texte: z.string().min(1) })
    ).length(4),
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
```

Et dans le `schema: ({ id }) => …` :

```typescript
if (id === 'accueil') return accueil
if (id === 'le-lab') return leLab
```

- [ ] **Step 3: Créer un helper de classes de bouton**

Le JSON désigne un style, le template le traduit en classes. Évite de mettre des noms de classes
CSS dans le contenu éditable.

```typescript
// src/lib/boutons.ts
export const CLASSES_BOUTON = {
  sombre: 'dc-btn dc-btn-dark',
  'contour-or': 'dc-btn dc-btn-outline dc-btn-outline-gold',
  'contour-plein': 'dc-btn dc-btn-outline dc-btn-outline-fill',
  or: 'dc-btn dc-btn-gold',
  'or-vif': 'dc-btn dc-btn-gold-bright',
  fantome: 'dc-btn dc-btn-ghost-light',
} as const

export type StyleBouton = keyof typeof CLASSES_BOUTON
```

- [ ] **Step 4: Écrire le template**

Sections à produire, dans l'ordre du fichier source `index.tsx` :

| Section source | id | Classe racine | Points de vigilance |
|---|---|---|---|
| HERO (l. 25-96) | `bonjour` | `.hero` | 2 doodles décoratifs (`Bottles`, `Plant`) en absolu, **masqués sous 860px** (ancienne `.rc-hero-deco`) ; halo radial ; `.rc-rise` conservée (dans global.css) |
| NOS ACTIVITÉS (l. 99-171) | `activites` | `.activites` | dégradé or ; 3 `LogoCircle` ; `label` contient un `\n` → `white-space: pre-line` |
| ENGAGEMENTS (l. 174-234) | `engagements` | `.engagements` | 3 cartes à rayons organiques (présentation → CSS) |
| SMD (l. 237-286) | `smd` | `.smd` | fond `--encre` ; grille 2 colonnes ; sous-grille 2×2 des 4 cartes |
| À PROPOS (l. 289-391) | `apropos` | `.apropos` | image d'équipe via `<Image>` Astro depuis `src/images/equipe-daronnes.png` ; halo `filter: blur(28px)` |
| CTA BAND (l. 394-428) | — | `.cta` | 2 `Sparkle` animés avec `--r` inline |

Import de l'image de design (catégorie « design », donc optimisée) :

```astro
---
import { Image } from 'astro:assets'
import equipe from '../images/equipe-daronnes.png'
---
<Image src={equipe} alt={apropos.imageAlt} class="apropos-photo" />
```

> **Piège :** l'ancienne `.rc-hero-deco { display: none !important }` masquait les doodles sous
> 860px (commit `96b3312`). Ne pas l'oublier — sinon ils chevauchent le titre sur mobile.

- [ ] **Step 5: Supprimer l'ancienne page et construire**

```bash
rm src/pages/index.tsx
npm run build
```

Expected: PASS.

- [ ] **Step 6: Comparer visuellement**

```bash
npm run preview -- --port 9100 &
sleep 3
BASE=http://localhost:9100 OUT=/tmp/apres node scripts/capture-baseline.mjs
kill %1
```

Comparer `accueil-360`, `accueil-860`, `accueil-1440` aux références.
**Vérifier explicitement qu'à 360px les doodles `Bottles` et `Plant` sont absents.**

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: page accueil en Astro, contenu extrait en JSON"
```

---

## Task 7: Page La ZD'thèque (+ collection sessions + carrousel vanilla)

239 lignes, 62 valeurs numériques, 1 îlot interactif (les flèches du rail).

**Files:**
- Create: `src/content/pages/la-zd-theque.json`
- Create: `src/content/sessions/*.json` (5 fichiers)
- Create: `src/pages/la-zd-theque.astro`
- Modify: `src/content.config.ts`
- Delete: `src/pages/la-zd-theque.tsx`, `src/data/sessions.json`

- [ ] **Step 1: Éclater sessions.json en collection**

Un fichier par session, nommé de façon triable. `bookingUrl` remonte dans `site.json`
(déjà fait en tâche 4, clé `reservationZdtheque`).

`src/content/sessions/2026-07-29-lys-lez-lannoy.json` :
```json
{ "ordre": 1, "jour": "29", "mois": "Juil. 2026", "lieu": "Le LAB", "ville": "Lys-lez-Lannoy" }
```

`src/content/sessions/2026-09-09-lille.json` :
```json
{ "ordre": 2, "jour": "09", "mois": "Sept. 2026", "lieu": "Médiathèque", "ville": "Lille" }
```

`src/content/sessions/2026-09-23-roubaix.json` :
```json
{ "ordre": 3, "jour": "23", "mois": "Sept. 2026", "lieu": "Maison de quartier", "ville": "Roubaix" }
```

`src/content/sessions/2026-10-14-lys-lez-lannoy.json` :
```json
{ "ordre": 4, "jour": "14", "mois": "Oct. 2026", "lieu": "Le LAB", "ville": "Lys-lez-Lannoy" }
```

`src/content/sessions/2026-10-28-villeneuve-dascq.json` :
```json
{ "ordre": 5, "jour": "28", "mois": "Oct. 2026", "lieu": "Centre Social Cocteau", "ville": "Villeneuve-d'Ascq" }
```

- [ ] **Step 2: Ajouter la collection au content.config.ts**

```typescript
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

export const collections = { pages, sessions }
```

- [ ] **Step 3: Écrire le contenu de la page**

```json
{
  "seo": {
    "titre": "La ZD'thèque — Sessions gratuites zéro déchet | Les Daronnes en Nord",
    "description": "Sessions gratuites d'entraide zéro déchet et cosmétiques maison dans la métropole lilloise. Réservez votre créneau : Villeneuve-d'Ascq, Lille, Roubaix, Lys-lez-Lannoy."
  },
  "hero": {
    "kicker": "Le meilleur déchet est celui que l'on ne produit pas.",
    "titre": "La ZD'thèque",
    "cercleLabel": "La ZD'thèque",
    "texte": "Bienvenue dans notre ZD'thèque dédiée au mode de vie « Zéro Déchet ». Que vous soyez déjà adepte du bocal en verre ou que vous vous demandiez par où commencer, <strong>notre association vous accompagne</strong> — sans jugement, à votre rythme.",
    "ctaLabel": "Réserver mon créneau !"
  },
  "propositions": {
    "kicker": "Ce que nous proposons",
    "titre": "Apprendre, partager, agir",
    "texte": "Le passage à l'action n'est pas une contrainte, mais une occasion de mieux consommer, de faire des économies et de redécouvrir le plaisir du « faire soi-même ».",
    "cartes": [
      { "icone": "cosmetique", "titre": "Apprendre", "texte": "Des ateliers pratiques pour fabriquer vos produits du quotidien." },
      { "icone": "spray", "titre": "Partager", "texte": "Des moments d'échange pour diffuser les bonnes astuces et adresses locales." },
      { "icone": "recyclage", "titre": "Agir", "texte": "Des opérations concrètes pour préserver notre environnement proche." }
    ]
  },
  "sessions": {
    "kicker": "Retrouvez-nous et inscrivez-vous !",
    "titre": "Prochaines sessions",
    "texte": "On se rencontre le <strong>mercredi à partir de 14h</strong> dans divers lieux de la métropole lilloise. Les ateliers sont <strong>entièrement gratuits</strong> : réservez votre créneau et venez découvrir astuces et recettes — produits ménagers, craies, cosmétiques home made…",
    "horaire": "Mercredi, à partir de 14h.",
    "labelReservation": "Réserver ma place",
    "carteFinale": {
      "surtitre": "Et vous ?",
      "titre": "Réserver mon créneau",
      "texte": "Retrouvez toutes nos prochaines dates et réservez votre place directement en ligne.",
      "bouton": "Réserver en ligne"
    }
  },
  "ateliers": {
    "titre": "Prendre soin de vous, au naturel",
    "texte": "On touche les matières, on formule, on manipule, on rit. Voici ce qu'on fabrique ensemble pendant nos rendez-vous.",
    "cartes": [
      { "icone": "cosmetique", "titre": "Cosmétiques fait maison", "texte": "Des soins sains, sur-mesure et économiques." },
      { "icone": "spray", "titre": "Produits ménagers", "texte": "Lessive, spray multi-usage : une maison propre sans plastique ni toxiques." },
      { "icone": "craie", "titre": "Loisirs créatifs DIY", "texte": "Des recettes ludiques à refaire en famille, petits et grands." },
      { "icone": "recyclage", "titre": "Upcycling & récup'", "texte": "Donner une seconde vie aux objets et prendre soin de ce qu'on a déjà." }
    ]
  },
  "cta": {
    "titre": "Une place vous attend",
    "texte": "Réservez votre créneau gratuit, venez les mains vides et repartez avec vos premières recettes.",
    "boutons": [
      { "label": "Voir les prochaines sessions", "href": "#sessions", "style": "or-vif" },
      { "label": "Retour à l'accueil", "href": "/", "style": "fantome" }
    ]
  }
}
```

- [ ] **Step 4: Écrire le carrousel en vanilla**

Remplace `useRef` + `scrollTrack` (`la-zd-theque.tsx:47-55`). Comportement strictement identique :
défilement d'une largeur de carte + 22px de gap.

```astro
<div class="rail" id="rail">
  <!-- cartes de session, chacune avec data-carte -->
</div>

<div class="fleches">
  <button type="button" aria-label="Sessions précédentes" data-sens="-1" class="dc-arrow dc-arrow-light">←</button>
  <button type="button" aria-label="Sessions suivantes" data-sens="1" class="dc-arrow dc-arrow-dark">→</button>
</div>

<script>
  const rail = document.querySelector<HTMLElement>('#rail')!

  document.querySelectorAll<HTMLButtonElement>('[data-sens]').forEach((bouton) => {
    bouton.addEventListener('click', () => {
      const carte = rail.querySelector<HTMLElement>('[data-carte]')
      const pas = carte ? carte.offsetWidth + 22 : 340
      rail.scrollBy({ left: Number(bouton.dataset.sens) * pas, behavior: 'smooth' })
    })
  })
</script>
```

- [ ] **Step 5: Écrire le template**

| Section source | id | Classe racine | Points de vigilance |
|---|---|---|---|
| HERO (l. 60-94) | `zdtheque` | `.hero` | `LogoCircle` ; CTA vers `site.reservationZdtheque` en `target="_blank" rel="noopener noreferrer"` |
| CE QUE NOUS PROPOSONS (l. 97-116) | — | `.propositions` | 3 cartes à rayons organiques |
| SESSIONS (l. 119-190) | `sessions` | `.sessions` | rail `overflow-x: auto` + `scroll-snap-type: x mandatory` ; chaque carte porte `data-carte` ; carte finale en dégradé or |
| LES ATELIERS (l. 193-210) | `ateliers` | `.ateliers` | grille 4 colonnes → **2 colonnes** sous 860px (ancienne `.rc-4`) |
| CTA BAND (l. 213-228) | — | `.cta` | fond `--encre`, titre en `--or-clair` |

Tri des sessions par `ordre` :

```astro
---
import { getCollection, getEntry } from 'astro:content'
import { site } from '../lib/site'

const { data } = await getEntry('pages', 'la-zd-theque')!
const sessions = (await getCollection('sessions')).sort((a, b) => a.data.ordre - b.data.ordre)
---
```

> **Piège :** `.rc-4` passait à **2 colonnes** sous 860px, pas 1. Voir `global.css:279-281`.

- [ ] **Step 6: Construire et vérifier le JS livré**

```bash
rm src/pages/la-zd-theque.tsx src/data/sessions.json
npm run build
find dist -name '*.js' -exec wc -c {} +
```

Expected: 1 fichier, moins de 2 000 octets.

- [ ] **Step 7: Comparer visuellement et tester le carrousel**

```bash
npm run preview -- --port 9100 &
sleep 3
BASE=http://localhost:9100 OUT=/tmp/apres node scripts/capture-baseline.mjs
```

Puis, dans un navigateur sur `http://localhost:9100/la-zd-theque` :
- cliquer sur → : le rail défile d'exactement une carte
- cliquer sur ← : il revient
- vérifier à 360px que le rail défile au doigt (scroll-snap)

```bash
kill %1
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: page ZD'theque en Astro, sessions en collection, carrousel vanilla"
```

---

## Task 8: Page Nos ateliers (+ collection ateliers + accordéon natif)

Page la plus complexe : 367 lignes, **85 valeurs numériques**, 5 sections + 3 fiches d'atelier.
L'accordéon React disparaît complètement au profit de `<details>`.

**Files:**
- Create: `src/content/pages/nos-ateliers.json`
- Create: `src/content/ateliers/*.json` (3 fichiers)
- Create: `src/components/sections/CarteAtelier.astro`
- Create: `src/pages/nos-ateliers.astro`
- Modify: `src/content.config.ts`
- Delete: `src/pages/nos-ateliers.tsx`

- [ ] **Step 1: Déplacer les images d'atelier vers public/uploads**

Ce sont des images de **contenu** (éditables au CMS), pas de design.

```bash
mkdir -p public/uploads
git mv src/images/atelier-cosmetiques-solides.webp public/uploads/
git mv src/images/atelier-rouges-a-levres.webp public/uploads/
git mv src/images/atelier-creme-de-jour.webp public/uploads/
```

- [ ] **Step 2: Écrire la collection ateliers**

`src/content/ateliers/1-cosmetiques-solides.json` :
```json
{
  "ordre": 1,
  "numero": "Atelier nº 1",
  "titre": "Créez vos cosmétiques solides",
  "description": "Découvrez la cosmétique home made, naturelle et écoresponsable en compagnie d'Audrey, créatrice de cosmétiques naturels. Elle vous ouvre les portes de son charmant atelier, où vous concevez vos propres soins solides.",
  "image": "/uploads/atelier-cosmetiques-solides.webp",
  "imageAlt": "Atelier de fabrication de cosmétiques solides avec Audrey",
  "cotePhoto": "gauche",
  "tags": ["2 h", "Dès 8 ans", "1 à 8 participants", "Jusqu'à 20 en privatisation"],
  "repartezAvec": [
    "2 h de découverte avec Audrey pour réaliser 2 cosmétiques solides",
    "Des connaissances en fabrication de cosmétiques",
    "Votre duo de cosmétiques solides personnalisés"
  ],
  "deroule": [
    { "numero": "01", "titre": "Accueil & introduction", "texte": "Audrey vous présente les ingrédients naturels — kératine végétale, poudres de plantes, huiles, beurres, fragrances — leurs rôles et leurs vertus." },
    { "numero": "02", "titre": "Choix des recettes", "texte": "Sélectionnez deux produits parmi shampoing, après-shampoing, dentifrice, déodorant, démaquillant, baume corporel ou savon. Audrey vous aide à personnaliser votre formule." },
    { "numero": "03", "titre": "Fabrication", "texte": "Testez, mesurez, mélangez et ajustez vos ingrédients jusqu'à une recette qui vous ressemble : parfum, texture, propriétés." },
    { "numero": "04", "titre": "Finalisation & échanges", "texte": "Recevez un livret pédagogique numérique avec les recettes, puis échangez autour d'une boisson. Repartez avec vos deux cosmétiques solides." }
  ]
}
```

`src/content/ateliers/2-rouges-a-levres.json` :
```json
{
  "ordre": 2,
  "numero": "Atelier nº 2",
  "titre": "Réalisez votre duo de rouges à lèvres",
  "description": "Révélez votre beauté au naturel en compagnie d'Audrey, créatrice de cosmétiques naturels. Plongez dans l'univers fascinant de la fabrication de cosmétiques et créez vos propres rouges à lèvres.",
  "image": "/uploads/atelier-rouges-a-levres.webp",
  "imageAlt": "Duo de rouges à lèvres naturels en étui bambou",
  "cotePhoto": "droite",
  "tags": ["2 h", "Dès 15 ans", "1 à 6 participants", "Jusqu'à 20 en privatisation"],
  "repartezAvec": [
    "2 h de découverte avec Audrey pour réaliser deux rouges à lèvres",
    "Des connaissances en fabrication de cosmétiques",
    "Votre duo de rouges à lèvres (version vegan possible)"
  ],
  "deroule": [
    { "numero": "01", "titre": "Accueil & introduction", "texte": "Audrey vous présente le rôle, les propriétés et les vertus de chaque ingrédient, et comment chaque matière contribue à la texture et à la couleur." },
    { "numero": "02", "titre": "Choix des teintes & fabrication", "texte": "Sélectionnez vos teintes parmi une large gamme, puis fabriquez votre duo de rouges à lèvres — en version vegan si vous le souhaitez." },
    { "numero": "03", "titre": "Accompagnement & astuces", "texte": "Audrey partage ses astuces, ses bons plans et ses conseils pour un mode de vie plus respectueux de vous-même et de votre environnement." },
    { "numero": "04", "titre": "Moment de partage", "texte": "Partagez votre expérience autour d'un verre, puis repartez avec vos jolis rouges à lèvres prêts à rejoindre votre routine beauté." }
  ]
}
```

`src/content/ateliers/3-creme-de-jour.json` :
```json
{
  "ordre": 3,
  "numero": "Atelier nº 3",
  "titre": "Créez votre crème de jour",
  "description": "Plongez dans l'univers naturel et bienveillant d'Audrey, fabricante de cosmétiques. Entrez dans le monde fascinant de la fabrication de cosmétiques et composez votre propre crème de jour, sur mesure.",
  "image": "/uploads/atelier-creme-de-jour.webp",
  "imageAlt": "Fabrication d'une crème de jour naturelle en atelier",
  "cotePhoto": "gauche",
  "tags": ["2 h", "Dès 8 ans", "1 à 8 participants", "Jusqu'à 20 en privatisation"],
  "repartezAvec": [
    "2 h de découverte avec Audrey pour réaliser 2 crèmes de jour",
    "Des connaissances en fabrication de cosmétiques",
    "Votre crème de jour naturelle et sur mesure"
  ],
  "deroule": [
    { "numero": "01", "titre": "Accueil & introduction", "texte": "Audrey présente les ingrédients, leurs rôles et leurs bienfaits, et comment les associer : crème de jour, de nuit, lait corps, soin des mains… Des recettes pour tous, femmes comme hommes, selon votre type de peau." },
    { "numero": "02", "titre": "Réalisation", "texte": "Réalisez deux produits de 50 ml, en choisissant parmi une grande variété de principes actifs : vitamine E, acide hyaluronique, coenzyme Q10…" },
    { "numero": "03", "titre": "Fragrances & poudres", "texte": "Sélectionnez vos fragrances et poudres minérales pour la texture et le parfum idéal. Repartez avec vos cosmétiques, vos recettes et l'envie de continuer chez vous." }
  ]
}
```

> `derouleCols` a disparu : le template déduit 2 ou 3 colonnes de `deroule.length`
> (3 étapes → 3 colonnes, sinon 2). C'est exactement le comportement actuel.

- [ ] **Step 3: Ajouter la collection ateliers au schéma**

```typescript
const ateliers = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/ateliers' }),
  schema: z.object({
    ordre: z.number(),
    numero: z.string().min(1),
    titre: z.string().min(1),
    description: z.string().min(1),
    image: z.string().startsWith('/uploads/'),
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

export const collections = { pages, sessions, ateliers }
```

- [ ] **Step 4: Écrire le composant CarteAtelier avec accordéon natif**

Remplace `useState<Record<number, boolean>>` (`nos-ateliers.tsx:228`). **Zéro ligne de JS.**

```astro
---
// src/components/sections/CarteAtelier.astro
import Sparkle from '../icons/Sparkle.astro'
import { site } from '../../lib/site'
import type { CollectionEntry } from 'astro:content'

interface Props {
  atelier: CollectionEntry<'ateliers'>['data']
  premier: boolean
}
const { atelier, premier } = Astro.props
const colonnes = atelier.deroule.length === 3 ? 3 : 2
---

<article class="fiche" class:list={[{ premier }]}>
  <div class="fiche-grille" data-cote={atelier.cotePhoto}>
    <div class="media">
      <img src={atelier.image} alt={atelier.imageAlt} />
    </div>

    <div class="texte">
      <div class="numero">{atelier.numero}</div>
      <h3 class="titre">{atelier.titre}</h3>
      <p class="description">{atelier.description}</p>

      <div class="tags">
        {atelier.tags.map((tag, i) => <span class:list={['tag', { principal: i === 0 }]}>{tag}</span>)}
      </div>

      <div class="repartez">
        <div class="repartez-titre">Vous repartez avec</div>
        <ul>
          {
            atelier.repartezAvec.map((item) => (
              <li>
                <span class="puce"><Sparkle size={15} color="#C9A227" /></span>
                {item}
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  </div>

  <div class="pied">
    <details class="deroule">
      <summary class="dc-btn dc-btn-outline dc-btn-outline-fill bascule"></summary>
      <div class="deroule-titre">Le déroulé de l'atelier</div>
      <div class="etapes" data-colonnes={colonnes}>
        {
          atelier.deroule.map((etape) => (
            <div class="etape">
              <div class="etape-numero">{etape.numero}</div>
              <div>
                <h4>{etape.titre}</h4>
                <p>{etape.texte}</p>
              </div>
            </div>
          ))
        }
      </div>
    </details>

    <a href={site.reservationAteliers} target="_blank" rel="noopener noreferrer" class="dc-btn dc-btn-dark reserver">
      Réserver cet atelier
    </a>
  </div>
</article>

<style>
  /* Le libellé du bouton change sans JS — remplace le ternaire React. */
  .bascule::after {
    content: "Voir le déroulé de l'atelier";
  }
  details[open] > .bascule::after {
    content: 'Masquer le déroulé';
  }
  .bascule {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    padding: 12px 22px;
    list-style: none;
    cursor: pointer;
  }
  .bascule::-webkit-details-marker {
    display: none;
  }

  .fiche {
    margin-top: 28px;
    background: var(--creme);
    border: 2.5px solid var(--encre);
    border-radius: 28px;
    overflow: hidden;
  }
  .fiche.premier {
    margin-top: 44px;
  }

  .fiche-grille {
    display: grid;
    gap: 0;
  }
  .fiche-grille[data-cote='gauche'] {
    grid-template-columns: 1fr 1.1fr;
  }
  .fiche-grille[data-cote='droite'] {
    grid-template-columns: 1.1fr 1fr;
  }
  /* la photo passe en second quand elle doit être à droite */
  .fiche-grille[data-cote='droite'] .media {
    order: 2;
  }

  .media {
    position: relative;
    min-height: 280px;
  }
  .media img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .etapes[data-colonnes='2'] {
    grid-template-columns: 1fr 1fr;
  }
  .etapes[data-colonnes='3'] {
    grid-template-columns: repeat(3, 1fr);
  }

  /* … reste des règles extraites de nos-ateliers.tsx:122-224 … */

  @media (max-width: 860px) {
    .fiche-grille[data-cote='gauche'],
    .fiche-grille[data-cote='droite'] {
      grid-template-columns: 1fr;
    }
    .fiche-grille[data-cote='droite'] .media {
      order: 0;
    }
    .media {
      min-height: 240px;
    }
    .etapes[data-colonnes='2'],
    .etapes[data-colonnes='3'] {
      grid-template-columns: 1fr;
    }
  }
</style>
```

> **Piège :** l'ancienne `.rc-atelier-media { min-height: 240px !important }` (global.css:304-306)
> abaissait la hauteur de l'image sous 860px. Reproduit ci-dessus.

- [ ] **Step 5: Écrire le contenu de la page**

```json
{
  "seo": {
    "titre": "Nos ateliers cosmétiques — Créez vos soins au naturel | Les Daronnes en Nord",
    "description": "Ateliers cosmétiques à Lys-lez-Lannoy : cosmétiques solides, rouges à lèvres et crème de jour faits maison avec Audrey. Repartez avec vos créations et vos recettes."
  },
  "hero": {
    "kicker": "Formulez au naturel !",
    "titre": "Nos ateliers artisans",
    "cercleLabel": "Nos ateliers\nartisans",
    "texte": "Envie de découvrir un savoir-faire, de vous initier à une pratique et de passer un moment unique. <strong>Glissez-vous dans la peau d'un artisan</strong> le temps d'un atelier !",
    "ctaLabel": "Réserver un atelier"
  },
  "cercleVertueux": {
    "kicker": "Un achat plaisir, un acte solidaire",
    "titre": "Le cercle vertueux des Daronnes",
    "texte": "Nous croyons en une écologie accessible à tous. Pour que le budget ne soit jamais un frein, nous avons mis en place un modèle économique circulaire et solidaire.",
    "cartes": [
      { "icone": "pro", "titre": "Les prestations pro", "texte": "Team-buildings, formations de créateurs via Le LAB et ateliers payants grand public — une expertise de haut niveau." },
      { "icone": "cycle", "titre": "Le cercle vertueux", "texte": "Ces revenus financent les matières premières, l'entretien du local, nos activités bénévoles et la vie de l'association." },
      { "icone": "impact", "titre": "L'impact social", "texte": "En choisissant nos prestations payantes, vous devenez acteur direct de la transition et de la solidarité sur notre territoire." }
    ]
  },
  "transmission": {
    "kicker": "Repartez autonome",
    "titre": "Nos secrets de fabrication, transmis",
    "texte": "On vous transmet nos recettes pour créer des produits sains, efficaces et zéro déchet. Vous repartez avec vos créations personnalisées et toutes les clés pour recommencer chez vous.",
    "cartes": [
      { "icone": "cosmetique", "titre": "Vos créations", "texte": "Vous repartez avec vos produits faits maison, personnalisés selon votre peau et vos envies." },
      { "icone": "recette", "titre": "Les fiches recettes", "texte": "Au format SMD ultra-léger, pour refaire vos recettes sans surcharge numérique." },
      { "icone": "cle", "titre": "Les clés de l'autonomie", "texte": "Gestes, dosages et bons réflexes pour continuer en toute autonomie, à la maison." }
    ]
  },
  "pourTous": {
    "kicker": "Oui, absolument tous !",
    "titre": "Un atelier pour tous",
    "texte": "Nos ateliers sont des espaces de partage bienveillants où chacun trouve sa place.",
    "cartes": [
      { "icone": "famille", "titre": "De 7 à 107 ans", "texte": "Des formats ludiques en famille pour les petits, et des sessions pour approfondir pour les grands." },
      { "icone": "genre", "titre": "Femmes ET hommes", "texte": "Prendre soin de soi n'a pas de genre : baumes à barbe, déodorants solides, soins du visage…" },
      { "icone": "niveau", "titre": "Du novice à l'expert", "texte": "Jamais touché une balance de précision ? On reprend les bases. Déjà initié ? On vous challenge." }
    ]
  },
  "catalogue": {
    "kicker": "Nos ateliers à la carte",
    "titre": "Choisissez votre atelier"
  },
  "cta": {
    "titre": "Prêt(e) à formuler avec nous ?",
    "texte": "Réservez votre atelier cosmétique ou parlez-nous de votre projet de team-building.",
    "boutons": [
      { "label": "Réserver un atelier", "href": "", "style": "sombre", "externe": true }
    ]
  }
}
```

> `href` vide + `externe: true` → le template utilise `site.reservationAteliers`. Évite de
> dupliquer l'URL Wecandoo à 3 endroits (elle apparaît 3 fois dans le `.tsx` actuel).

- [ ] **Step 6: Écrire le template**

| Section source | id | Classe racine | Points de vigilance |
|---|---|---|---|
| HERO (l. 233-250) | — | `.hero` | `LogoCircle` avec `\n` dans le label |
| CERCLE VERTUEUX (l. 253-275) | — | `.cercle` | fond `--encre` |
| TRANSMISSION (l. 278-297) | — | `.transmission` | 3 cartes à rayons organiques |
| POUR TOUS (l. 300-319) | — | `.pour-tous` | fond `--creme` |
| CATALOGUE (l. 322-332) | `ateliers` | `.catalogue` | boucle sur la collection triée par `ordre` |
| CTA BAND (l. 335-351) | — | `.cta` | 2 `Sparkle` animés |

- [ ] **Step 7: Construire et vérifier l'absence de JS**

```bash
rm src/pages/nos-ateliers.tsx
npm run build
find dist -name '*.js' | wc -l
```

Expected: `1` (uniquement le carrousel de la ZD'thèque ; l'accordéon n'en produit aucun).

- [ ] **Step 8: Comparer visuellement et tester l'accordéon**

```bash
npm run preview -- --port 9100 &
sleep 3
BASE=http://localhost:9100 OUT=/tmp/apres node scripts/capture-baseline.mjs
```

Dans un navigateur sur `/nos-ateliers` :
- ouvrir les 3 déroulés indépendamment ; le libellé du bouton doit basculer
- naviguer au clavier (Tab + Entrée) : le `<details>` doit s'ouvrir — c'est le gain d'accessibilité
- vérifier que l'atelier nº 2 a bien sa photo à droite en desktop, et **au-dessus** du texte en mobile

```bash
kill %1
```

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: page Nos ateliers, collection ateliers, accordeon natif <details>"
```

---

## Task 9: Pages Contact et 404

174 + 54 lignes, 47 valeurs numériques. Le formulaire `mailto:` est migré **à l'identique**
(décision D12).

**Files:**
- Create: `src/content/pages/contact.json`
- Create: `src/pages/contact.astro`
- Create: `src/pages/404.astro`
- Modify: `src/content.config.ts`
- Delete: `src/pages/contact.tsx`, `src/pages/404.tsx`

- [ ] **Step 1: Écrire le contenu**

```json
{
  "seo": {
    "titre": "Contact — Les Daronnes en Nord",
    "description": "Une question, une envie d'atelier, un projet à monter ensemble ? Écrivez aux Daronnes en Nord — ateliers cosmétiques et zéro déchet dans la métropole lilloise."
  },
  "hero": {
    "kicker": "Faisons connaissance",
    "titre": "Contact",
    "texte": "Une question, une envie d'atelier, un projet à monter ensemble ? Écrivez-nous — on répond avec plaisir, sans langue de bois."
  },
  "formulaire": {
    "kicker": "Écrivez-nous",
    "titre": "Votre message",
    "labelNom": "Prénom & nom",
    "placeholderNom": "Camille Dupont",
    "labelEmail": "E-mail",
    "placeholderEmail": "camille@email.fr",
    "labelSujet": "Votre demande concerne",
    "labelMessage": "Votre message",
    "placeholderMessage": "Dites-nous tout : votre projet, vos dates, le nombre de participants…",
    "labelBouton": "Envoyer mon message",
    "mentionSmd": "En cohérence avec notre démarche SMD, on privilégie un échange simple et direct — pas de formulaires à rallonge.",
    "sujets": [
      "Un atelier grand public",
      "Une réservation ZD'thèque",
      "Le LAB (artisans & créateurs)",
      "Un atelier privé / sur-mesure",
      "Autre / question générale"
    ],
    "sujetLab": "Le LAB (artisans & créateurs)"
  },
  "coordonnees": {
    "kicker": "Nous joindre",
    "titre": "Directement"
  },
  "ouTrouver": {
    "titre": "Où nous trouver ?",
    "texte": "Nos ateliers tournent entre Villeneuve-d'Ascq, Lys-lez-Lannoy, Lille et Roubaix. Le calendrier complet est sur la page <a href=\"/la-zd-theque#sessions\">Nos activités</a>."
  },
  "encartLab": {
    "titre": "Vous êtes artisan ?",
    "texte": "Le LAB vous accompagne pour concevoir et animer vos propres ateliers.",
    "bouton": "Parler du LAB"
  }
}
```

- [ ] **Step 2: Écrire le formulaire en vanilla**

Remplace `useState(subject)` + `useEffect` + `onSubmit` (`contact.tsx:29-46`). Un `<select>`
non contrôlé rend le code **plus court** qu'en React.

```astro
---
const { formulaire } = data
---

<form id="form" class="formulaire">
  <!-- … champs name, email … -->
  <label>
    {formulaire.labelSujet}
    <select class="rc-inp" name="subject">
      {formulaire.sujets.map((s) => <option value={s}>{s}</option>)}
    </select>
  </label>
  <!-- … message, bouton … -->
</form>

<a href="#form" id="cta-lab" class="dc-btn dc-btn-dark">{encartLab.bouton}</a>

<script define:vars={{ email: site.email, sujetLab: formulaire.sujetLab }}>
  const form = document.querySelector('#form')
  const select = form.elements.namedItem('subject')

  // pré-sélection depuis /contact?sujet=lab ou #lab (liens venant du LAB)
  const param = new URLSearchParams(location.search).get('sujet')
  if (param === 'lab' || location.hash.includes('lab')) select.value = sujetLab

  document.querySelector('#cta-lab')?.addEventListener('click', () => {
    select.value = sujetLab
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const fd = new FormData(form)
    const nom = fd.get('name') ?? ''
    const mail = fd.get('email') ?? ''
    const message = fd.get('message') ?? ''
    const corps = `Bonjour Les Daronnes,\n\n${message}\n\n— ${nom}${mail ? ` (${mail})` : ''}`
    location.href =
      `mailto:${email}?subject=${encodeURIComponent(`[${select.value}] ${nom}`)}` +
      `&body=${encodeURIComponent(corps)}`
  })
</script>
```

> `define:vars` passe l'e-mail et le sujet LAB du frontmatter au script client sans les coder en
> dur — ils restent éditables depuis `site.json` et le CMS.

- [ ] **Step 3: Écrire les deux templates**

Page contact — sections source :

| Section source | Classe racine | Points de vigilance |
|---|---|---|
| HERO (l. 52-64) | `.hero` | halo radial ; `Sparkle` |
| FORM + INFOS (l. 66-160) | `.contenu` | grille `1.25fr .75fr` → 1 colonne sous 860px ; grille interne du formulaire `1fr 1fr` → 1 colonne (ancienne `.rc-form-2`) |

Page 404 — une seule section (`404.tsx:7-45`), aucune interactivité, aucun contenu extrait
(page technique, non éditable au CMS). Le contenu peut rester dans le `.astro`.

- [ ] **Step 4: Construire et vérifier**

```bash
rm src/pages/contact.tsx src/pages/404.tsx
npm run build
ls dist/404.html dist/contact/index.html
```

Expected: les deux fichiers existent.

- [ ] **Step 5: Tester le formulaire**

```bash
npm run preview -- --port 9100 &
sleep 3
```

Dans un navigateur :
1. `http://localhost:9100/contact` → le `<select>` affiche « Un atelier grand public »
2. `http://localhost:9100/contact?sujet=lab#form` → il affiche « Le LAB (artisans & créateurs) »
3. Cliquer « Parler du LAB » → le `<select>` bascule sur le sujet LAB
4. Remplir et soumettre → le client mail s'ouvre avec objet et corps pré-remplis

```bash
kill %1
```

- [ ] **Step 6: Comparer visuellement les 6 pages**

```bash
npm run preview -- --port 9100 &
sleep 3
BASE=http://localhost:9100 OUT=/tmp/apres node scripts/capture-baseline.mjs
kill %1
ls /tmp/apres | wc -l
```

Expected: `18`. Comparer les 18 paires. **C'est le contrôle complet** — toutes les pages sont
maintenant migrées.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: pages contact (formulaire vanilla) et 404 en Astro"
```

---

## Task 10: Sveltia CMS

**Files:**
- Create: `public/admin/index.html`
- Create: `public/admin/config.yml`

- [ ] **Step 1: Écrire le point d'entrée**

La version est épinglée : un CMS qui change tout seul en production est exactement ce qu'on
veut éviter sur un projet dont l'objectif est la pérennité.

```html
<!-- public/admin/index.html -->
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Administration — Les Daronnes en Nord</title>
  </head>
  <body>
    <script src="https://unpkg.com/@sveltia/cms@0.109.0/dist/sveltia-cms.js"></script>
  </body>
</html>
```

> Vérifier la dernière version stable sur https://github.com/sveltia/sveltia-cms/releases
> et remplacer `0.109.0` en conséquence.

- [ ] **Step 2: Écrire la configuration**

Chaque champ correspond exactement à une clé du schéma Zod. Un désalignement casse soit
l'édition, soit le build.

```yaml
# public/admin/config.yml
backend:
  name: github
  repo: kclercin/lesdaronnesennord
  branch: master
  auth_methods: [token]

publish_mode: editorial_workflow
media_folder: public/uploads
public_folder: /uploads

singletons:
  - name: site
    label: Réglages du site
    file: src/content/site.json
    fields:
      - { label: E-mail de contact, name: email, widget: string }
      - { label: URL du site, name: siteUrl, widget: string }
      - { label: Zone géographique, name: zone, widget: string }
      - { label: Baseline (pied de page), name: baseline, widget: text }
      - { label: Mention légale, name: mentionLegale, widget: string }
      - { label: Mention SMD, name: mentionSmd, widget: string }
      - { label: Réservation ZD'thèque, name: reservationZdtheque, widget: string }
      - { label: Réservation ateliers, name: reservationAteliers, widget: string }

  - name: accueil
    label: Page — Accueil
    file: src/content/pages/accueil.json
    fields:
      - label: SEO
        name: seo
        widget: object
        fields:
          - { label: Titre de l'onglet, name: titre, widget: string }
          - { label: Description, name: description, widget: text }
      - label: Hero
        name: hero
        widget: object
        fields:
          - { label: Accroche manuscrite, name: kicker, widget: string }
          - { label: Titre — début, name: titreAvant, widget: string }
          - { label: Titre — partie dorée, name: titreAccent, widget: string }
          - { label: Titre — fin, name: titreApres, widget: string }
          - { label: Paragraphe, name: texte, widget: text }
          - label: Boutons
            name: cta
            widget: list
            fields:
              - { label: Libellé, name: label, widget: string }
              - { label: Lien, name: href, widget: string }
              - label: Style
                name: style
                widget: select
                options: [sombre, contour-or, contour-plein, or, or-vif, fantome]
      # … une entrée par section : activites, engagements, smd, apropos, cta

  - name: nos-ateliers
    label: Page — Nos ateliers
    file: src/content/pages/nos-ateliers.json
    fields: [] # même patron

  - name: la-zd-theque
    label: Page — La ZD'thèque
    file: src/content/pages/la-zd-theque.json
    fields: []

  - name: le-lab
    label: Page — Le LAB
    file: src/content/pages/le-lab.json
    fields: []

  - name: contact
    label: Page — Contact
    file: src/content/pages/contact.json
    fields: []

collections:
  - name: ateliers
    label: Ateliers artisans
    label_singular: atelier
    folder: src/content/ateliers
    format: json
    create: true
    slug: '{{ordre}}-{{titre}}'
    sortable_fields: [ordre]
    fields:
      - { label: Ordre d'affichage, name: ordre, widget: number, value_type: int }
      - { label: Numéro affiché, name: numero, widget: string, hint: "ex. Atelier nº 1" }
      - { label: Titre, name: titre, widget: string }
      - { label: Description, name: description, widget: text }
      - { label: Photo, name: image, widget: image }
      - { label: Texte alternatif de la photo, name: imageAlt, widget: string, hint: "Obligatoire — décrit la photo pour les personnes non voyantes" }
      - label: Côté de la photo
        name: cotePhoto
        widget: select
        options: [gauche, droite]
      - { label: Étiquettes, name: tags, widget: list, field: { label: Étiquette, name: tag, widget: string } }
      - { label: Vous repartez avec, name: repartezAvec, widget: list, field: { label: Élément, name: item, widget: string } }
      - label: Déroulé
        name: deroule
        widget: list
        fields:
          - { label: Numéro, name: numero, widget: string, hint: "ex. 01" }
          - { label: Titre de l'étape, name: titre, widget: string }
          - { label: Description, name: texte, widget: text }

  - name: sessions
    label: Sessions ZD'thèque
    label_singular: session
    folder: src/content/sessions
    format: json
    create: true
    slug: '{{ordre}}-{{ville}}'
    sortable_fields: [ordre]
    fields:
      - { label: Ordre d'affichage, name: ordre, widget: number, value_type: int }
      - { label: Jour, name: jour, widget: string, hint: "ex. 29" }
      - { label: Mois et année, name: mois, widget: string, hint: "ex. Juil. 2026" }
      - { label: Lieu, name: lieu, widget: string }
      - { label: Ville, name: ville, widget: string }
      - { label: Lien de réservation spécifique, name: lienReservation, widget: string, required: false }
```

- [ ] **Step 3: Compléter les `fields` des 4 pages restantes**

Pour chaque page, transcrire son schéma Zod en widgets Sveltia, selon la correspondance :

| Zod | Widget Sveltia |
|---|---|
| `z.string().min(1)` (court) | `{ widget: string }` |
| `z.string().min(1)` (long / avec `<strong>`) | `{ widget: text }` |
| `z.number()` | `{ widget: number, value_type: int }` |
| `z.array(z.object({…}))` | `{ widget: list, fields: [...] }` |
| `z.array(z.string())` | `{ widget: list, field: {...} }` |
| `z.enum([...])` | `{ widget: select, options: [...] }` |
| `icone` (registre) | `{ widget: select, options: [transmission, partage, experience, mail-or, fichier, balai, feuille, cosmetique, spray, craie, recyclage, feuille-lab, outils, etincelle, recette, cle, famille, genre, niveau, pro, cycle, impact] }` |
| `.optional()` | ajouter `required: false` |

- [ ] **Step 4: Créer le token GitHub**

Sur https://github.com/settings/personal-access-tokens/new :
- *Repository access* → *Only select repositories* → `kclercin/lesdaronnesennord`
- *Permissions* → *Repository permissions* → *Contents* → **Read and write**
- *Expiration* → 1 an (noter la date d'expiration dans un agenda)

- [ ] **Step 5: Tester l'accès au CMS en local**

```bash
npm run build && npm run preview -- --port 9100 &
sleep 3
```

Ouvrir `http://localhost:9100/admin/` :
1. Cliquer « Sign in with Token », coller le PAT
2. Vérifier que les 6 singletons et les 2 collections apparaissent
3. Modifier un texte de la page Le LAB, enregistrer
4. Vérifier qu'une **pull request** est créée sur GitHub (et non un commit direct)
5. Fermer la PR sans la merger — c'était un test

```bash
kill %1
```

- [ ] **Step 6: Vérifier que /admin n'est pas indexable**

```bash
grep -q 'noindex' public/admin/index.html && echo OK
```

Expected: `OK`

- [ ] **Step 7: Commit**

```bash
git add public/admin
git commit -m "feat: Sveltia CMS avec authentification par token GitHub"
```

---

## Task 11: Déploiement

**Files:**
- Create: `Procfile`
- Create: `public/serve.json`
- Modify: `netlify.toml`

- [ ] **Step 1: Écrire le Procfile**

```
web: serve dist --listen tcp://0.0.0.0:$PORT --no-clipboard
```

- [ ] **Step 2: Écrire les en-têtes de cache**

Placé dans `public/`, il est copié vers `dist/` au build — c'est là que `serve` le lit.

```json
{
  "headers": [
    {
      "source": "_astro/**",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "**/*.html",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }]
    }
  ]
}
```

- [ ] **Step 3: Corriger netlify.toml**

Piège R2 : `publish` pointait vers `public`, qui est désormais un dossier source.

```toml
[build]
  command = "npm run build"
  publish = "dist"

# Redirection canonique : www -> apex
[[redirects]]
  from = "https://www.lesdaronnesennord.fr/*"
  to = "https://lesdaronnesennord.fr/:splat"
  status = 301
  force = true

[[redirects]]
  from = "http://www.lesdaronnesennord.fr/*"
  to = "https://lesdaronnesennord.fr/:splat"
  status = 301
  force = true
```

- [ ] **Step 4: Tester la chaîne de production en local**

Reproduit ce que fera le buildpack : build, puis démarrage via `npm start`.

```bash
npm run build
PORT=9200 npm start &
sleep 3
```

- [ ] **Step 5: Vérifier les 4 critères de service**

```bash
echo "--- routes ---"
for u in / /nos-ateliers /la-zd-theque /le-lab /contact; do
  printf "%-18s HTTP %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' localhost:9200$u)"
done

echo "--- 404 personnalisee ---"
curl -s -o /dev/null -w 'HTTP %{http_code}\n' localhost:9200/page-inexistante
curl -s localhost:9200/page-inexistante | grep -c '404'

echo "--- en-tetes de cache ---"
curl -sI localhost:9200/ | grep -i cache-control
ASSET=$(find dist/_astro -name '*.css' | head -1 | sed 's|dist||')
curl -sI "localhost:9200$ASSET" | grep -i cache-control

echo "--- ecoute sur toutes interfaces ---"
lsof -nP -iTCP:9200 -sTCP:LISTEN | tail -n +2 | awk '{print $9}'
```

Expected:
- les 5 routes → `HTTP 200`
- `/page-inexistante` → `HTTP 404`, et le corps contient « 404 »
- `/` → `must-revalidate` ; l'asset `_astro` → `immutable`
- écoute sur `*:9200`

```bash
kill %1
```

- [ ] **Step 6: Commit**

```bash
git add Procfile public/serve.json netlify.toml
git commit -m "feat: Procfile et en-tetes de cache pour buildpacks Heroku"
```

- [ ] **Step 7: Configurer Dokploy (manuel, hors dépôt)**

1. Nouvelle application, source = ce dépôt GitHub, branche `master`
2. Build type = **Heroku buildpacks**, version 24
3. Domaine `lesdaronnesennord.fr` + certificat Let's Encrypt
4. Ajouter une règle Traefik de redirection `www.lesdaronnesennord.fr` → `lesdaronnesennord.fr` (301)
5. Activer le webhook GitHub de redéploiement automatique
6. Déployer, puis vérifier les mêmes 4 critères qu'à l'étape 5 sur le domaine réel

---

## Task 12: Purge de Gatsby

**Files:**
- Delete: tous les résidus Gatsby

- [ ] **Step 1: Supprimer les fichiers**

```bash
rm -f gatsby-config.ts gatsby-browser.js gatsby-ssr.js
rm -f src/gatsby-types.d.ts src/images.d.ts
rm -rf src/data .cache
rm -f src/components/doodles.tsx src/components/Layout.tsx \
      src/components/SiteHeader.tsx src/components/SiteFooter.tsx
```

> `scripts/capture-baseline.mjs` est **conservé** : la tâche 13 s'en sert pour la vérification
> finale, et il resservira à chaque refonte visuelle future. Les 18 références restent dans
> `docs/superpowers/baseline/`.

- [ ] **Step 2: Vérifier qu'il ne reste aucune trace**

```bash
grep -ril "gatsby" --include="*.json" --include="*.ts" --include="*.js" \
  --include="*.astro" --include="*.toml" . | grep -v node_modules | grep -v docs/
```

Expected: aucune sortie.

```bash
node -e "
const p = require('./package.json');
const deps = {...p.dependencies, ...p.devDependencies};
const interdits = Object.keys(deps).filter(d =>
  /^(gatsby|react|react-dom|tailwindcss|autoprefixer|postcss)/.test(d));
console.log(interdits.length ? 'RESTE: ' + interdits.join(', ') : 'OK — aucune dependance interdite');
"
```

Expected: `OK — aucune dependance interdite` (critère d'acceptation n°7).

- [ ] **Step 3: Réinstaller proprement et construire**

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: purge des residus Gatsby, React et Tailwind"
```

---

## Task 13: Vérification des critères d'acceptation

Reprise un par un des 8 critères de la spec (§14).

- [ ] **Step 1: Critère 1 — rendu identique**

```bash
npm run build && npm run preview -- --port 9100 &
sleep 3
BASE=http://localhost:9100 OUT=/tmp/final node scripts/capture-baseline.mjs
kill %1
```

Comparer les 18 paires `docs/superpowers/baseline/*.png` ↔ `/tmp/final/*.png`.
**Aucune différence de mise en page attendue.**

- [ ] **Step 2: Critère 2 — moins de 5 Ko de JS par page**

```bash
find dist -name '*.js' -exec sh -c 'echo "$1: $(gzip -c "$1" | wc -c) octets gzip"' _ {} \;
```

Expected: un seul fichier, sous 5 000 octets.

- [ ] **Step 3: Critère 3 — le build échoue sur contenu invalide**

```bash
cp src/content/ateliers/1-cosmetiques-solides.json /tmp/atelier.ok.json
node -e "
const fs=require('fs');
const f='src/content/ateliers/1-cosmetiques-solides.json';
const d=JSON.parse(fs.readFileSync(f,'utf8'));
d.imageAlt='';
fs.writeFileSync(f, JSON.stringify(d,null,2));
"
npm run build
```

Expected: FAIL, message mentionnant `imageAlt`.

```bash
cp /tmp/atelier.ok.json src/content/ateliers/1-cosmetiques-solides.json
npm run build
```

Expected: PASS.

- [ ] **Step 4: Critères 4 et 5 — le CMS pilote bien le site**

Sur le site déployé, dans `/admin/` :
1. Modifier le titre du hero de la page Le LAB → une PR est créée
2. Merger la PR → le webhook déclenche le build Dokploy → la modification est en ligne (~2 min)
3. Créer une nouvelle session ZD'thèque → elle apparaît dans le rail après déploiement
4. Supprimer cette session de test → elle disparaît

- [ ] **Step 5: Critère 6 — la 404 fonctionne en production**

```bash
curl -s -o /dev/null -w 'HTTP %{http_code}\n' https://lesdaronnesennord.fr/page-inexistante
curl -s https://lesdaronnesennord.fr/page-inexistante | grep -c "404"
```

Expected: `HTTP 404`, et le corps contient « 404 ».

- [ ] **Step 6: Critère 7 — dépendances**

Déjà vérifié en tâche 12, étape 2.

- [ ] **Step 7: Critère 8 — le même dist se déploie sur les deux cibles**

Vérifier que le déploiement Netlify (branche `master`) réussit et sert le même site que Dokploy.

- [ ] **Step 8: Commit final et fusion**

```bash
git add -A
git commit -m "chore: verification des criteres d'acceptation" --allow-empty
git checkout master
git merge astro
```

---

## Récapitulatif des risques traités

| Risque (spec §10) | Traité en |
|---|---|
| R1 — `.gitignore` contient `public` | Tâche 2, étape 1 |
| R2 — `netlify.toml` publie `public` | Tâche 11, étape 3 |
| R3 — 324 valeurs numériques sans `px` | Patron de conversion (tâche 5) + contrôle visuel de chaque page |
| R4 — 13 `!important` inutiles | Tâche 2, étape 6 (global.css réécrit) |
| R5 — `"start": "gatsby develop"` | Tâche 2, étape 3 |
| R6 — `serve` en devDependencies | Tâche 2, étape 3 |
| R7 — icônes en JSX dans les données | Tâche 3, étape 2 (registre `ICONES`) |
| R8 — retrait du preflight Tailwind | Tâche 2, étape 6 (reset explicite) + contrôle visuel |
| R9 — résidus Gatsby | Tâche 12 |
| R10 — `astro` en devDependencies | Tâche 2, étape 3 |
