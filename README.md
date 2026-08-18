# Les Daronnes en Nord

Site de l'association **Les Daronnes en Nord** — ateliers de cosmétiques maison et zéro déchet
dans la métropole lilloise.

Site statique construit avec [Astro](https://astro.build), sans framework d'interface :
le JavaScript livré au navigateur tient en **224 octets** sur la page d'accueil.

## Prérequis

**Node 22.12 ou plus** (imposé par Astro 7). Le dépôt contient un `.nvmrc` :

```bash
nvm use          # bascule sur la bonne version
```

## Commandes

| Commande | Effet |
|---|---|
| `npm install` | installe les dépendances |
| `npm run dev` | serveur de développement sur http://localhost:4321 |
| `npm run build` | génère le site dans `dist/` |
| `npm run preview` | sert `dist/` pour vérifier le résultat du build |
| `npm start` | sert `dist/` en production (utilisé par le Procfile) |
| `npm run typecheck` | vérifie les types Astro/TypeScript |

## Modifier le contenu

**Sans toucher au code**, via l'interface d'administration : `/admin/`.

Elle utilise [Sveltia CMS](https://sveltiacms.app) et se connecte avec un **jeton d'accès
personnel GitHub** (portée `Contents: read & write` sur ce seul dépôt). Chaque modification
ouvre une *pull request* — rien ne part en production sans validation.

**Directement dans les fichiers**, si tu préfères :

```
src/content/
├── site.json          e-mail, zone, liens de réservation, mentions du pied de page
├── pages/             les textes de chaque page, section par section
├── ateliers/          un fichier par atelier (ajout/suppression libre)
└── sessions/          un fichier par session ZD'thèque (ajout/suppression libre)
```

Ces fichiers sont **validés au build** par un schéma Zod (`src/lib/pages/`, `src/content.config.ts`).
Un champ obligatoire vide ou une icône inexistante fait échouer `npm run build` avec un message
qui pointe le champ fautif — le site cassé ne peut pas partir en ligne.

Les images se répartissent en deux catégories :

- `public/uploads/` — images de **contenu** (photos d'ateliers), téléversables depuis le CMS
- `src/images/` — images de **design** (logo, photo d'équipe), optimisées par Astro, non éditables

## Structure du code

```
src/
├── pages/             une page = un fichier .astro (structure uniquement)
├── components/
│   ├── icons/         les 30 doodles SVG + le registre utilisé par le contenu
│   └── sections/      composants de section réutilisables
├── lib/
│   ├── schemas.ts     briques de validation partagées
│   ├── pages/         un schéma + le contenu validé, par page
│   ├── site.ts        réglages globaux validés
│   └── boutons.ts     style de bouton (JSON) → classes CSS
├── styles/
│   ├── tokens.css     couleurs, polices — déclarées une seule fois
│   └── global.css     reset, boutons, champs de formulaire, animations
└── content/           tout le contenu éditable (voir ci-dessus)
```

Les styles sont **scopés par composant** (balise `<style>` dans chaque `.astro`) ; seuls le reset
et les éléments réellement partagés vivent dans `global.css`. Le site n'a qu'un seul point de
rupture responsive : **860 px**.

## Interactivité

Trois comportements seulement, en JavaScript natif, colocalisés dans le composant concerné :

| Où | Quoi |
|---|---|
| `components/SiteHeader.astro` | menu mobile |
| `pages/la-zd-theque.astro` | défilement du rail de sessions |
| `pages/contact.astro` | pré-remplissage du sujet et envoi du formulaire |

L'accordéon des fiches d'atelier n'utilise **aucun JavaScript** : c'est un `<details>` natif,
accessible au clavier par construction.

## Déploiement

Le site est un dossier statique : il se déploie partout.

- **Dokploy** — type de build *Heroku buildpacks*. Le `Procfile` lance `serve dist`.
- **Netlify** — `netlify.toml` publie `dist/`.

Les en-têtes de cache sont dans `public/serve.json` (copié vers `dist/` au build) : un an
d'immutabilité sur les assets hachés, une semaine sur les images, revalidation systématique
du HTML.
