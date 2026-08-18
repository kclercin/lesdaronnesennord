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

1. **Nouvelle application** → source : dépôt GitHub `kclercin/lesdaronnesennord`, branche `master`
2. **Build type** : *Heroku buildpacks* (version 24)
   Le buildpack Node exécute `npm ci` puis `npm run build` ; le buildpack Procfile lit le `Procfile`
   à la racine, qui lance `serve dist` sur `$PORT`.
3. **Domaine** : `lesdaronnesennord.fr` + certificat Let's Encrypt
4. **Redirection canonique** : ajouter dans Traefik une règle `www.lesdaronnesennord.fr` →
   `lesdaronnesennord.fr` en 301. Elle n'est **pas** dans le code, pour que le même build reste
   déployable ailleurs.
5. **Webhook GitHub** : activer le redéploiement automatique sur `master`

### Vérifier après le premier déploiement

```bash
D=https://lesdaronnesennord.fr
for u in / /le-lab /la-zd-theque /nos-ateliers /contact /admin/; do
  printf "%-16s %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' $D$u)"
done
curl -s -o /dev/null -w '404 -> %{http_code}\n' $D/page-inexistante
curl -sI $D/ | grep -i cache-control
```

Attendu : 200 partout, 404 sur la page inexistante (avec la page 404 du site),
`must-revalidate` sur le HTML.

---

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
