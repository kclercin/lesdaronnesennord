# Migration Gatsby → Astro — Les Daronnes en Nord

**Date :** 2026-08-17
**Branche :** `astro`
**Statut :** spécification validée, prête pour le plan d'implémentation

---

## 1. Objectifs

Trois objectifs, dans cet ordre :

1. **Pérennité** — Gatsby n'est plus activement développé. Passer sur un socle vivant.
2. **Simplicité de maintenance** — un projet réouvrable sans douleur dans deux ans.
3. **Édition du contenu par CMS** — Sveltia CMS, contenu en fichiers JSON versionnés dans Git.

Objectif non retenu : la performance. Elle sera un effet de bord massif (79 Ko → ~1,5 Ko de JS), mais elle n'a pas motivé la décision et ne doit pas orienter les arbitrages.

## 2. État des lieux mesuré

Le projet actuel n'utilise presque rien de Gatsby. C'est ce qui rend la migration peu risquée sur le fond, et concentre le risque sur la forme (les styles).

| Élément | État constaté |
|---|---|
| Pages | 6 fichiers `.tsx` (~1 400 lignes) |
| Composants | `Layout`, `SiteHeader`, `SiteFooter`, `doodles.tsx` (329 l. de SVG) |
| GraphQL / `useStaticQuery` | **aucun usage** |
| `gatsby-plugin-image` / `StaticImage` | installé, **jamais importé** |
| `gatsby-transformer-remark` | installé, **aucun `.md` dans le dépôt** |
| API Gatsby réellement utilisée | `Link` (2 fichiers), `HeadFC` (6 fichiers) |
| Données | `src/data/sessions.json`, importé en dur |
| Styles | ~480 objets `style={{…}}` inline + `global.css` (307 l.) |
| Tailwind v4 | installé, **2 classes utilisées** (`flex`, `gap-4`) |
| Interactivité | 4 îlots (burger, accordéon, carrousel, formulaire) |

### Poids du JavaScript actuel (page d'accueil, mesuré)

| Fichier | brut | gzip |
|---|---|---|
| `framework-*.js` (React + react-dom) | 140 K | 45 K |
| `app-*.js` (runtime + router Gatsby) | 72 K | 24 K |
| `commons-*.js` | 20 K | 4 K |
| `webpack-runtime-*.js` | 8 K | 2 K |
| `component---index-*.js` | 16 K | 4 K |
| **Total livré** | | **79 K** |

`public/` contient 668 Ko de JS au total, dont ~280 Ko de Partytown jamais utilisés.

### Répétition du design system

| Constat | Volume | Valeurs distinctes |
|---|---|---|
| Couleurs en dur dans le JSX | 249 occurrences | 12 |
| Déclarations `font-family` | 68 occurrences | 3 |
| `!important` dans `global.css` | 13 | — |

## 3. Décisions

| # | Sujet | Décision |
|---|---|---|
| D1 | Framework | Astro, **sans aucun framework UI** |
| D2 | Interactivité | `<script>` vanilla colocalisés — ~42 lignes au total |
| D3 | View Transitions | **Non** (`<ClientRouter />` écarté) |
| D4 | Styles | **Extraction complète** des styles inline vers du CSS |
| D5 | Tailwind | **Retiré**, remplacé par un reset explicite (~10 lignes) |
| D6 | Polices | **Google Fonts conservées** (`preconnect` + `stylesheet` dans le Layout) |
| D7 | Contenu | JSON — sections de page + collections + réglages globaux |
| D8 | CMS | Sveltia CMS, backend GitHub, **auth par PAT** |
| D9 | Workflow CMS | `publish_mode: editorial_workflow` (édition → PR) |
| D10 | Hébergement | Dokploy via **buildpacks Heroku** (`Procfile` + `serve`) |
| D11 | Netlify | **Conservé** en cible secondaire, même `dist/` |
| D12 | Formulaire contact | `mailto:` migré **à l'identique**, hors périmètre |
| D13 | Rendu visuel | **Iso-rendu strict** — toute différence est un bug |

## 4. Architecture cible

```
les-daronnes-en-nord/
├── astro.config.mjs
├── Procfile                      # web: serve dist --listen tcp://0.0.0.0:$PORT
├── netlify.toml                  # publish = "dist"
├── src/
│   ├── content.config.ts         # schémas Zod → validation au build
│   ├── content/                  # ←─ tout ce qui est éditable au CMS
│   │   ├── site.json
│   │   ├── pages/{accueil,nos-ateliers,la-zd-theque,le-lab,contact}.json
│   │   ├── ateliers/*.json       # collection, création/suppression au CMS
│   │   └── sessions/*.json       # collection, création/suppression au CMS
│   ├── pages/*.astro             # structure pure : ni contenu, ni style
│   ├── components/
│   │   ├── Layout.astro, SiteHeader.astro, SiteFooter.astro
│   │   ├── icons/                # les doodles, 1 fichier .astro chacun
│   │   └── sections/
│   ├── styles/
│   │   ├── tokens.css            # 12 couleurs + 3 fontes, déclarées une fois
│   │   └── global.css            # reset, keyframes, composants partagés
│   └── images/                   # images de design → optimisées par Astro
└── public/
    ├── admin/{index.html,config.yml}   # Sveltia CMS
    ├── uploads/                        # images uploadées depuis le CMS
    └── serve.json                      # en-têtes de cache
```

## 5. Modèle de contenu

Trois niveaux :

| Niveau | Fichier(s) | Chargement |
|---|---|---|
| **Global** | `site.json` — nav, footer, e-mail, zone, `bookingUrl` | import direct + validation Zod |
| **Page** | `pages/*.json` — `seo` + une clé par section | `glob()` + `getEntry()` |
| **Répétable** | `ateliers/*.json`, `sessions/*.json` | `glob()` + `getCollection()` |

Le schéma Zod valide le contenu **au build** : un champ obligatoire vidé depuis le CMS fait échouer le build avec un message clair, au lieu de publier un site cassé.

```ts
// src/content.config.ts
const ateliers = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/ateliers' }),
  schema: z.object({
    ordre: z.number(),
    titre: z.string().min(1),
    description: z.string().min(1),
    image: z.string(),
    imageAlt: z.string().min(1),          // alt obligatoire → accessibilité garantie
    cotePhoto: z.enum(['gauche', 'droite']),
    tags: z.array(z.string()),
    repartezAvec: z.array(z.string()),
    deroule: z.array(z.object({ titre: z.string(), texte: z.string() })),
    lienReservation: z.string().url(),
  }),
})
```

### Deux transformations imposées par le passage en JSON

**Les icônes.** Les données actuelles contiennent du JSX (`{ icon: <IconPro />, … }`), impossible à sérialiser. Le JSON porte une clé que le template résout via un registre :

```json
{ "icone": "pro", "titre": "Les prestations pro", "texte": "…" }
```
```astro
---
import { ICONES } from '../components/icons'
const Icone = ICONES[bloc.icone]
---
<Icone />
```
Côté CMS, le champ devient une liste déroulante — pas un champ libre.

**`derouleCols: 2 | 3` disparaît.** C'est une décision de mise en page, pas du contenu. Le template la déduit du nombre d'étapes.

### Images — deux catégories

| Catégorie | Emplacement | Optimisation | Éditable au CMS |
|---|---|---|---|
| Design (logo, équipe, doodles) | `src/images/` | `<Image>` Astro (WebP, responsive) | non |
| Contenu (photos d'ateliers) | `public/uploads/` | **aucune** | oui |

Compromis assumé : une image uploadée depuis un téléphone partira telle quelle. Acceptable sur 3 images déjà en `.webp`. À réévaluer si le volume augmente.

## 6. Système CSS

### Trois couches

| Couche | Fichier | Contenu |
|---|---|---|
| Tokens | `styles/tokens.css` | 12 couleurs, 3 fontes, rayons, ombres, breakpoint (~30 l.) |
| Global | `styles/global.css` | reset, `body`, `@keyframes`, `dc-btn`, `rc-inp`, `dc-arrow`, `dc-nav-link` |
| Scoped | `<style>` dans chaque `.astro` | les ~480 styles inline, répartis par composant |

Le CSS scoped d'Astro isole automatiquement les règles. Le nommage global n'est donc à inventer que pour ce qui est **réellement partagé** — dans un composant, `.hero` ou `.carte` ne peuvent entrer en collision avec rien.

```css
/* src/styles/tokens.css */
:root {
  --creme: #FBF6E9;   --encre: #1B1A17;    --blanc: #FFFFFF;
  --or: #C9A227;      --or-clair: #E8BE36; --or-fonce: #B8911E; --or-doux: #D8B43A;
  --texte: #4A463C;   --texte-doux: #6B675C;
  --display: 'Anton', sans-serif;
  --manuscrit: 'Caveat', cursive;
  --corps: 'Poppins', sans-serif;
  --bascule: 860px;
}
```

### Suppressions rendues possibles

Les 13 `!important` de `global.css` n'existent que parce qu'un style inline bat toujours une classe en spécificité. Une fois les styles extraits, la cascade redevient normale et **les 13 disparaissent**, avec les 9 classes qui n'existaient que pour les porter : `rc-2`, `rc-3`, `rc-4`, `rc-form-2`, `rc-foot-2`, `rc-h1`, `rc-htitle`, `rc-htitle-lg`, `rc-circles`.

Le breakpoint unique à 860 px est conservé, exprimé dans chaque composant scoped.

## 7. JavaScript

| Emplacement | Lignes | Rôle |
|---|---|---|
| `components/SiteHeader.astro` | ~12 | burger, `aria-expanded`, fermeture au clic |
| `pages/la-zd-theque.astro` | ~10 | flèches du rail de sessions |
| `pages/contact.astro` | ~20 | `?sujet=lab`, bouton LAB, construction du `mailto:` |
| `pages/nos-ateliers.astro` | **0** | remplacé par `<details>`/`<summary>` natif |
| **Total** | **~42** | **~1,5 Ko livré** (contre 79 Ko) |

Chaque `<script>` est colocalisé dans le composant qu'il anime. Pas de fichier fourre-tout.

Le remplacement de l'accordéon React par `<details>` apporte l'accessibilité clavier native, sans code.

## 8. CMS — Sveltia

Deux fichiers dans `public/admin/`.

```yaml
# public/admin/config.yml
backend:
  name: github
  repo: kclercin/lesdaronnesennord
  branch: master
  auth_methods: [token]            # PAT — aucun serveur d'auth à héberger

publish_mode: editorial_workflow   # édition → pull request → publication
media_folder: public/uploads
public_folder: /uploads

singletons:
  - { name: site,    label: "Réglages du site", file: src/content/site.json,         fields: [...] }
  - { name: accueil, label: "Page — Accueil",   file: src/content/pages/accueil.json, fields: [...] }
  # … une entrée par page

collections:
  - { name: ateliers, label: "Ateliers artisans",  folder: src/content/ateliers, format: json, create: true, fields: [...] }
  - { name: sessions, label: "Sessions ZD'thèque", folder: src/content/sessions, format: json, create: true, fields: [...] }
```

> Les `fields: [...]` sont volontairement élidés ici. Le détail champ par champ se déduit
> mécaniquement des schémas Zod (§5) et sera écrit dans le plan d'implémentation : chaque
> champ Zod a exactement un widget Sveltia correspondant. Les deux doivent rester alignés —
> un champ présent dans Zod mais absent du CMS est ininscriptible ; l'inverse casse le build.

### Authentification — contrainte structurelle

Sveltia ne supporte pas Git Gateway / Netlify Identity (dépréciés). L'accès au CMS passe par un **token GitHub personnel** :

- token *fine-grained*, limité à ce seul dépôt, permission `Contents: read & write`
- saisi une fois dans `/admin`, stocké en `localStorage`
- il expire (90 jours par défaut ; recommandation : 1 an + rappel agenda)

**Conséquence à assumer :** chaque personne qui édite doit avoir un compte GitHub avec accès en écriture au dépôt. Adapté à un éditeur unique. Si l'association souhaite ouvrir l'édition à des membres non techniques, cette approche devra être revue — c'est le point faible connu de cette architecture.

### Boucle de publication

```
édition dans /admin → PR GitHub → merge → webhook → build Dokploy → en ligne (~1–2 min)
```

## 9. Déploiement

### Dokploy — buildpacks Heroku

Build type *Heroku buildpacks* (builder 24). Le buildpack `heroku/procfile` lit un `Procfile` à la racine ; le buildpack Node exécute `npm ci` puis `npm run build`.

```
# Procfile
web: serve dist --listen tcp://0.0.0.0:$PORT --no-clipboard
```

```jsonc
// package.json
{
  "engines": { "node": ">=22.12.0" },     // exigé par Astro 7
  "scripts": {
    "dev":   "astro dev",
    "build": "astro build",
    "start": "serve dist --listen tcp://0.0.0.0:$PORT --no-clipboard"
  },
  "dependencies": {
    "astro": "^7",                        // en dependencies, pas devDependencies — voir R10
    "serve": "^14"                        // runtime : doit survivre à l'élagage — voir R6
  },
  "devDependencies": { "typescript": "^5" }
}
```

**Version cible : Astro 7.2.2** (Node ≥ 22.12.0 requis). Toutes les vérifications de la section
« Vérifications effectuées » ont été menées sur cette version.

```json
// public/serve.json
{
  "headers": [
    { "source": "_astro/**", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] },
    { "source": "**/*.html", "headers": [{ "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }] }
  ]
}
```

Astro hache le nom de ses assets dans `/_astro/` : cache d'un an sans risque, HTML toujours frais.

| Sujet | Traitement |
|---|---|
| Redirection www → apex | Traefik (Dokploy), pas dans le code |
| TLS | Let's Encrypt via Dokploy |
| Redéploiement | Webhook GitHub sur merge dans `master` |
| Netlify (secondaire) | `publish = "dist"`, `command = "npm run build"` |

### Vérifications effectuées (et non supposées)

| Question | Résultat mesuré |
|---|---|
| Astro ajoute-t-il `px` aux nombres, comme React ? | **Non** — `toStyleString({fontSize: 14})` → `font-size:14` (invalide) |
| `sirv` sert-il `404.html` ? | **Non** — HTTP 404, corps vide. Écarté. |
| `serve` sert-il `404.html` ? | **Oui** — HTTP 404 + page personnalisée |
| `serve.json` applique-t-il les en-têtes ? | **Oui** — vérifié sur `/_astro/` et sur le HTML |
| `serve` écoute-t-il sur toutes les interfaces ? | **Oui** — `*:PORT` |
| Coût de `serve` en production | 6,9 Mo / 77 paquets |

**Alternative écartée :** serveur maison (~45 lignes, 0 dépendance). Plus cohérent avec l'objectif « peu de pièces mobiles », mais un serveur de fichiers exposé sur Internet doit gérer le *path traversal*, les types MIME et les en-têtes conditionnels. Ce n'est pas là qu'il faut économiser 77 paquets.

## 10. Risques et pièges identifiés

| # | Piège | Effet si non traité | Traitement |
|---|---|---|---|
| R1 | `.gitignore` contient `public` (sortie de build en Gatsby, **source** en Astro) | `/admin` jamais déployé, uploads perdus silencieusement | Retirer la ligne, committer `public/` |
| R2 | `netlify.toml` publie `public` | Netlify sert un dossier vide | → `dist` |
| R3 | **324 valeurs numériques** sans `px` (Astro ne les ajoute pas) | 324 déformations visuelles silencieuses | Extraction CSS + contrôle visuel page par page |
| R4 | 13 `!important` devenus inutiles | Cascade incohérente, bugs responsive à 860 px | Supprimés avec les 9 classes `rc-*` |
| R5 | `"start": "gatsby develop"` | Le buildpack lancerait un serveur de dev en production | Corrigé dans le commit déploiement |
| R6 | `serve` en `devDependencies` | Élagué après build → le conteneur démarre et meurt sans message clair | **`dependencies` obligatoire** |
| R7 | Icônes en JSX dans les données | Non sérialisable en JSON | Clé string + registre `ICONES` |
| R8 | Retrait du preflight Tailwind | Régressions de reset diffuses | Reset explicite + contrôle visuel |
| R9 | Résidus Gatsby (`.cache/`, `gatsby-types.d.ts`, Partytown) | 280 Ko de déchets, confusion | Purgés au dernier commit |
| R10 | `astro` en `devDependencies` alors que le buildpack définit `NODE_ENV=production` | `npm ci` saute les devDependencies → `astro build` introuvable → build en échec | **`astro` en `dependencies`** |

### Répartition du risque R3 (le principal)

| Fichier | Valeurs numériques à traiter |
|---|---|
| `nos-ateliers.tsx` | 85 |
| `index.tsx` | 69 |
| `la-zd-theque.tsx` | 62 |
| `contact.tsx` | 39 |
| `le-lab.tsx` | 36 |
| `SiteFooter.tsx` | 15 |
| `SiteHeader.tsx` | 10 |
| `404.tsx` | 8 |
| **Total** | **324** |

156 autres valeurs numériques (`zIndex`, `lineHeight`, `opacity`, `fontWeight`, `flex`, `aspectRatio`) **ne prennent pas d'unité** et doivent être laissées telles quelles.

## 11. Filet anti-régression

L'extraction CSS est faite à la main, sans filet automatique. La vérification visuelle est donc **la** garantie d'iso-rendu :

1. Avant toute modification, capturer les **6 pages × 3 largeurs (360 / 860 / 1440 px)** = 18 références du site Gatsby actuel.
2. Après chaque page migrée, comparer la même vue et corriger les écarts **avant** de passer à la suivante.
3. Attention particulière à **860 px** : c'est l'unique breakpoint, et c'est là que la suppression des `!important` peut surprendre.

Gatsby n'est purgé qu'au dernier commit, ce qui permet de faire tourner `gatsby develop` en parallèle pour comparer l'ancien et le nouveau côte à côte pendant tout le chantier.

## 12. Ordre des commits

Chaque étape laisse le dépôt fonctionnel et vérifiable. Pas de big bang.

```
1.  chore: capturer les references visuelles (6 pages x 3 largeurs)
2.  feat: socle Astro (config, Layout, tokens.css, reset sans Tailwind)
3.  feat: composants icones (doodles.tsx -> fichiers .astro)
4.  feat: header + footer (+ burger vanilla)
5.  feat: page accueil
6.  feat: page nos-ateliers
7.  feat: page la-zd-theque
8.  feat: page le-lab
9.  feat: page contact + 404
10. feat: schemas Zod + content collections
11. feat: Sveltia CMS (/admin, config.yml, PAT)
12. feat: Procfile + serve.json pour buildpacks Heroku
13. chore: purge Gatsby (deps, configs, .cache, gitignore, netlify.toml)
```

Les commits 5 à 9 suivent tous le même patron : extraire le contenu vers JSON, extraire les styles vers CSS scoped, convertir le JSX en `.astro`, contrôler visuellement les 3 largeurs.

## 13. Hors périmètre (volontairement)

- **Refonte du formulaire `mailto:`** — le problème est réel (un visiteur sans client mail configuré perd son message, silencieusement) mais préexiste à la migration. Migré à l'identique. À traiter séparément.
- **View Transitions / navigation SPA** — écartées.
- **Page builder modulaire au CMS** — le périmètre validé est « sections fixes ».
- **Markdown** — tout en JSON.
- **Refonte visuelle** — iso-rendu strict.
- **Auto-hébergement des polices** — écarté, Google Fonts conservées.
- **Optimisation des images de contenu** — servies telles quelles depuis `public/uploads/`.

## 14. Critères d'acceptation

1. Les 6 pages rendent à l'identique aux 3 largeurs de référence.
2. Le JS livré est inférieur à 5 Ko gzip sur chaque page.
3. `npm run build` échoue si un champ obligatoire du contenu est manquant ou invalide.
4. Modifier un texte depuis `/admin` ouvre une PR, dont le merge met le site à jour en production.
5. Un atelier et une session peuvent être ajoutés puis supprimés depuis `/admin`.
6. `/page-inexistante` renvoie HTTP 404 **avec** la page 404 du site.
7. Aucune dépendance à `react`, `react-dom`, `gatsby*` ou `tailwindcss` ne subsiste dans `package.json`.
8. Le même `dist/` se déploie sur Dokploy et sur Netlify.
