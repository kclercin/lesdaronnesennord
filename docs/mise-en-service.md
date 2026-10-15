# Mise en service

Trois actions à faire par le propriétaire du dépôt. Le code est prêt ; ces étapes demandent
des accès que l'assistant n'a pas.

---

## 1. Créer le jeton GitHub du CMS

Sur https://github.com/settings/personal-access-tokens/new :

| Réglage | Valeur |
|---|---|
| Token name | `sveltia-cms-daronnes` |
| Repository access | **Only select repositories** → `kclercin/lesdaronnesennord` |
| Permissions → Repository → **Contents** | **Read and write** |
| Expiration | 1 an — **note la date d'expiration dans un agenda** |

Aucune autre permission n'est nécessaire.

Ensuite, sur le site déployé, ouvrir `/admin/` → **Sign In Using Access Token** → coller le jeton.
Il est stocké dans le navigateur, à ressaisir sur chaque appareil.

> **À savoir** : chaque personne qui édite le site a besoin de son propre jeton et d'un accès en
> écriture au dépôt. C'est adapté à un éditeur unique. Pour ouvrir l'édition à des membres non
> techniques de l'association, il faudra revoir ce point — c'est la limite connue de cette
> approche, choisie pour ne dépendre d'aucun serveur d'authentification.

**Test en local sans jeton** : `npm run dev`, puis `/admin/` → *Work with Local Repository*.
Sveltia écrit alors directement dans les fichiers du dossier, sans passer par GitHub.

---

## 2. Créer l'application Dokploy

### Créer l'application

1. **Create Application** → nom : `daronnes-site`
2. **Provider** : GitHub → dépôt `kclercin/lesdaronnesennord` → branche `master`
   (ou `astro` si tu veux tester avant de fusionner)

### Build

Onglet **Build Type** → **Heroku Buildpacks**, version **24** (valeur par défaut).

Aucune commande à saisir : le buildpack Node détecte `package.json`, exécute `npm ci`
puis `npm run build`, et le buildpack Procfile lit le `Procfile` à la racine.

> `astro` et `serve` sont volontairement en `dependencies` et non en `devDependencies` :
> les buildpacks élaguent les devDependencies, et le conteneur démarrerait puis mourrait
> sans message clair.

### Port

**3000.**

Le `Procfile` écoute sur `${PORT:-3000}` : il utilise la variable `PORT` si Dokploy l'injecte,
et retombe sur 3000 sinon. Renseigne **3000** comme port du conteneur au moment de créer le
domaine — sauf si tu définis explicitement une variable d'environnement `PORT`, auquel cas
mets la même valeur des deux côtés.

### Domaine

Onglet **Domains** → **Add Domain** :

| Champ | Valeur |
|---|---|
| Host | `lesdaronnesennord.fr` |
| Path | `/` |
| Container Port | `3000` |
| HTTPS | activé |
| Certificate | Let's Encrypt |

Ajoute un **second domaine** identique pour `www.lesdaronnesennord.fr` — sans lui, Traefik
ne répondrait pas du tout sur le `www` et la redirection ci-dessous ne pourrait pas s'appliquer.

### Redirection www → apex

Onglet **Advanced** → **Redirects** → **Add Redirect** :

| Champ | Valeur |
|---|---|
| Regex | `^https://www\.lesdaronnesennord\.fr/(.*)` |
| Replacement | `https://lesdaronnesennord.fr/$1` |
| Permanent | activé (301) |

Cette règle est volontairement **hors du code** : le même build reste ainsi déployable
ailleurs sans modification (c'est `netlify.toml` qui porte l'équivalent côté Netlify).

### DNS

Chez OVH, faire pointer les deux enregistrements vers l'IP du serveur Dokploy :

| Type | Nom | Valeur |
|---|---|---|
| A | `@` | IP du serveur |
| A (ou CNAME) | `www` | IP du serveur (ou `lesdaronnesennord.fr.`) |

Attendre la propagation avant de demander le certificat Let's Encrypt, sinon la validation échoue.

### Déploiement automatique

Onglet **Deployments** → activer le **webhook GitHub**, puis coller l'URL fournie dans
GitHub → *Settings* → *Webhooks*. Chaque fusion sur `master` déclenchera un déploiement.

### Vérifier après le premier déploiement

```bash
D=https://lesdaronnesennord.fr
for u in / /le-lab /la-zd-theque /nos-ateliers /contact /admin/; do
  printf "%-16s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' $D$u)"
done
curl -s -o /dev/null -w '404 -> %{http_code}\n' $D/page-inexistante
curl -sI $D/ | grep -i cache-control
curl -s -o /dev/null -w 'www -> %{http_code} %{redirect_url}\n' https://www.lesdaronnesennord.fr/
```

Attendu :
- 200 sur les 6 routes
- 404 sur la page inexistante, **avec la page 404 du site** (pas celle de Traefik)
- `must-revalidate` sur le HTML
- 301 depuis `www` vers l'apex

### Si le déploiement échoue

| Symptôme | Cause probable |
|---|---|
| Build en échec sur `astro: not found` | `astro` est passé en `devDependencies` |
| Conteneur qui démarre puis s'arrête | `serve` est passé en `devDependencies` |
| 502 Bad Gateway | port du domaine ≠ port d'écoute réel (doit être 3000) |
| Build en échec avec un message Zod | un champ de contenu est invalide — le message indique lequel |

## 3. Vérifier la boucle d'édition complète

Une fois le CMS et le déploiement en place :

1. `/admin/` → **Réglages & pages** → *Page — Le LAB* → modifier un titre → enregistrer
2. Vérifier qu'une **pull request** est ouverte sur GitHub (et non un commit direct sur `master`)
3. Fusionner la PR
4. Le webhook déclenche le build Dokploy → la modification est en ligne en 1 à 2 minutes
5. **Ajouter une session** dans *Sessions ZD'thèque*, vérifier qu'elle apparaît sur
   `/la-zd-theque` après déploiement, puis la supprimer

Si le build échoue, le message d'erreur pointe le champ fautif : c'est le garde-fou Zod qui
empêche une saisie invalide de partir en production.

---

## Netlify (cible secondaire)

`netlify.toml` est à jour (`publish = "dist"`, Node 22). Le même build s'y déploie sans
modification — utile comme filet si Dokploy est indisponible.
