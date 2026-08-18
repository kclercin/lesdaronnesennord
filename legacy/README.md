# Sources Gatsby — référence de migration

Ces fichiers React sont l'**original** dont les pages Astro sont converties.
Ils sont conservés hors de `src/` pendant toute la migration pour deux raisons :

- Vite scanne `src/` et échouait sur leur `import { Link } from "gatsby"`,
  ce paquet étant désinstallé depuis la tâche 2 (erreur « Failed to run
  dependency scan » au lancement de `astro dev`).
- Ils restent la source de vérité des styles à extraire pour les pages
  qui n'ont pas encore été migrées.

**À supprimer intégralement à la tâche 12**, une fois les 6 pages migrées et
la comparaison visuelle validée.

| Fichier | Migré vers |
|---|---|
| `pages/index.tsx` | `src/pages/index.astro` (tâche 6) |
| `pages/la-zd-theque.tsx` | `src/pages/la-zd-theque.astro` (tâche 7) |
| `pages/nos-ateliers.tsx` | `src/pages/nos-ateliers.astro` (tâche 8) |
| `pages/contact.tsx`, `pages/404.tsx` | tâche 9 |
| `components/doodles.tsx` | `src/components/icons/*.astro` ✅ tâche 3 |
| `components/Layout.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx` | `src/components/*.astro` ✅ tâche 4 |
