# Guide de Déploiement - Esolrine Stories

Ce guide vous accompagne étape par étape pour déployer votre site Esolrine sur Vercel.

## Prérequis

- Un compte [GitHub](https://github.com)
- Un compte [Vercel](https://vercel.com) (gratuit)
- Git installé sur votre ordinateur

## Étape 1 : Créer une application OAuth GitHub

Cette étape est nécessaire pour que vous puissiez vous connecter à l'admin.

1. Allez sur [GitHub](https://github.com) et connectez-vous
2. Cliquez sur votre photo de profil (en haut à droite) → **Settings**
3. Dans le menu de gauche, tout en bas, cliquez sur **Developer settings**
4. Cliquez sur **OAuth Apps** dans le menu de gauche
5. Cliquez sur le bouton vert **New OAuth App**

6. Remplissez le formulaire :
   - **Application name** : `Esolrine Admin` (ou le nom que vous voulez)
   - **Homepage URL** : `http://localhost:3000` (on changera ça plus tard)
   - **Application description** : Laissez vide ou mettez ce que vous voulez
   - **Authorization callback URL** : `http://localhost:3000/api/auth/callback/github`

7. Cliquez sur **Register application**

8. Sur la page suivante, **NOTEZ** ces informations (vous en aurez besoin) :
   - **Client ID** : copier et sauvegarder quelque part
   - Cliquez sur **Generate a new client secret**
   - **Client Secret** : copier et sauvegarder IMMÉDIATEMENT (vous ne pourrez plus le voir après)

9. **NE FERMEZ PAS** cette page, on y reviendra plus tard

## Étape 2 : Pousser votre code sur GitHub

1. Ouvrez un terminal dans le dossier `esolrine-website`

2. Si ce n'est pas déjà fait, initialisez Git :
```bash
cd C:\Users\oxifa\Desktop\esolrine-writings\esolrine-website
git init
```

3. Créez un fichier `.gitignore` pour ne pas envoyer les fichiers sensibles :
```bash
echo "node_modules" > .gitignore
echo ".env*" >> .gitignore
echo ".vercel" >> .gitignore
echo ".next" >> .gitignore
```

4. Ajoutez tous les fichiers :
```bash
git add .
```

5. Créez votre premier commit :
```bash
git commit -m "Initial commit - Esolrine website"
```

6. Allez sur [GitHub](https://github.com/new) pour créer un nouveau repository
   - **Repository name** : `esolrine-website` (ou ce que vous voulez)
   - Laissez-le **Public** ou **Private** (à votre choix)
   - **NE COCHEZ PAS** "Initialize with README" (on a déjà des fichiers)
   - Cliquez sur **Create repository**

7. GitHub va vous montrer des commandes. Copiez et exécutez ces deux lignes (remplacez avec VOTRE username) :
```bash
git remote add origin https://github.com/VOTRE-USERNAME/esolrine-website.git
git branch -M main
git push -u origin main
```

Votre code est maintenant sur GitHub !

## Étape 3 : Déployer sur Vercel

1. Allez sur [Vercel](https://vercel.com)
2. Connectez-vous (utilisez votre compte GitHub, c'est plus simple)
3. Cliquez sur **Add New...** → **Project**
4. Importez votre repository GitHub `esolrine-website`
5. Sur la page de configuration :
   - **Framework Preset** : Next.js (devrait être détecté automatiquement)
   - **Root Directory** : `./` (ne changez rien)
   - **Build Command** : `npm run build` (ne changez rien)
   - **Output Directory** : `.next` (ne changez rien)
   - **NE METTEZ PAS** les variables d'environnement maintenant
6. Cliquez sur **Deploy**

Le premier déploiement va échouer, c'est normal ! On va configurer la base de données maintenant.

## Étape 4 : Configurer Neon Postgres (Base de données)

1. Restez sur Vercel, allez sur votre projet
2. Cliquez sur l'onglet **Marketplace** (en haut)
3. Cherchez **Neon** ou cliquez sur la carte **Neon** (Serverless Postgres)
4. Cliquez sur **Add Integration**
5. Sélectionnez votre projet Esolrine et cliquez sur **Continue**
6. Autorisez l'intégration et suivez les instructions
7. Neon va créer automatiquement une base de données

8. Une fois l'intégration terminée, allez dans **Settings** → **Environment Variables**
9. Vous verrez plusieurs variables commençant par `POSTGRES_` ou `DATABASE_`
10. **NOTEZ** ces variables, elles sont déjà configurées automatiquement !

## Étape 5 : Configurer Vercel Blob (Stockage d'images)

1. Toujours dans votre projet Vercel, retournez à l'onglet **Storage**
2. Cliquez sur **Create Database** à nouveau
3. Cette fois, sélectionnez **Blob**
4. Donnez-lui un nom : `esolrine-images` (ou ce que vous voulez)
5. Cliquez sur **Create**

6. Une fois créé, vous verrez une variable `BLOB_READ_WRITE_TOKEN`
7. **COPIEZ** cette valeur quelque part

## Étape 6 : Générer le secret NextAuth

1. Sur votre ordinateur, ouvrez un terminal Git Bash (ou WSL si vous avez)
2. Exécutez cette commande :
```bash
openssl rand -base64 32
```

3. **COPIEZ** le résultat (une longue chaîne aléatoire)

Si vous n'avez pas `openssl`, vous pouvez utiliser ce site : https://generate-secret.vercel.app/32
(Cliquez sur "Generate" et copiez le résultat)

## Étape 7 : Ajouter les variables d'environnement manquantes

1. Dans Vercel, allez dans votre projet → **Settings** → **Environment Variables**

2. Vérifiez que Neon a bien ajouté les variables Postgres (elles commencent par `POSTGRES_` ou `DATABASE_`). Si elles ne sont pas là, retournez à l'étape 4.

3. Ajoutez maintenant les variables **UNE PAR UNE** (cliquez sur "Add New" à chaque fois) :

**IMPORTANT** : Les variables Postgres de Neon sont déjà configurées automatiquement ! Ne les re-créez pas.

### Variable Blob (de l'étape 5)
- `BLOB_READ_WRITE_TOKEN` = (la valeur que vous avez copiée)

### Variables NextAuth
- `NEXTAUTH_URL` = `https://VOTRE-PROJET.vercel.app` (remplacez par l'URL de votre déploiement Vercel)
- `NEXTAUTH_SECRET` = (le résultat de l'étape 6)

### Variables GitHub OAuth (de l'étape 1)
- `GITHUB_ID` = (votre Client ID GitHub)
- `GITHUB_SECRET` = (votre Client Secret GitHub)

### Votre nom d'utilisateur GitHub
- `ADMIN_GITHUB_USERNAME` = (VOTRE nom d'utilisateur GitHub exact - IMPORTANT !)

**IMPORTANT** : Pour chaque variable, dans le champ "Environments", sélectionnez **Production, Preview, et Development** (les 3)

## Étape 8 : Mettre à jour l'application OAuth GitHub

Maintenant qu'on connaît l'URL de votre site Vercel, on doit la donner à GitHub.

1. Retournez sur votre page GitHub OAuth App (étape 1)
2. Cliquez sur **Update application** en bas de la page
3. Changez :
   - **Homepage URL** : `https://VOTRE-PROJET.vercel.app`
   - **Authorization callback URL** : `https://VOTRE-PROJET.vercel.app/api/auth/callback/github`
4. Cliquez sur **Update application**

**ASTUCE** : Vous pouvez aussi ajouter plusieurs callback URLs (cliquez sur "Add callback URL") pour garder localhost en développement.

## Étape 9 : Redéployer

1. Retournez sur Vercel → votre projet → **Deployments**
2. Cliquez sur les 3 petits points à côté du dernier déploiement
3. Cliquez sur **Redeploy**
4. Cliquez sur **Redeploy** dans la popup

Attendez quelques minutes que le déploiement se termine...

## Étape 10 : Initialiser la base de données

1. Une fois le déploiement terminé, ouvrez votre navigateur
2. Allez sur : `https://VOTRE-PROJET.vercel.app/api/setup`

Vous devriez voir :
```json
{"message": "Database initialized successfully"}
```

**SÉCURITÉ** : Après avoir fait ça UNE FOIS, vous pouvez supprimer le fichier `/app/api/setup/route.ts` de votre code pour que personne d'autre ne puisse réinitialiser votre base.

## Étape 11 : Tester l'admin

1. Allez sur `https://VOTRE-PROJET.vercel.app/admin`
2. Cliquez sur "Sign in with GitHub"
3. Autorisez l'application
4. Vous devriez être redirigé vers le dashboard admin !

## Étape 12 : Créer votre première histoire

1. Dans l'admin, cliquez sur **New Story**
2. Remplissez :
   - **Title** : Le titre de votre histoire
   - **Excerpt** : Un court résumé
   - **Cover Image** : Uploadez une image (optionnel)
   - **Tags** : magic, fantasy, etc. (séparés par des virgules)
   - **Content** : Écrivez votre histoire avec l'éditeur
   - Cochez **Published** pour la publier immédiatement
3. Cliquez sur **Create Story**

4. Allez sur votre page d'accueil : `https://VOTRE-PROJET.vercel.app`
5. Votre histoire est là ! 🎉

## Personnalisation

### Changer les liens de réseaux sociaux

1. Sur votre ordinateur, ouvrez `components/SocialLinks.tsx`
2. Changez les URLs (lignes avec `url: 'https://...'`) avec vos vrais liens
3. Vous pouvez aussi ajouter/enlever des réseaux sociaux
4. Sauvegardez et poussez sur GitHub :
```bash
git add .
git commit -m "Update social links"
git push
```

Vercel va redéployer automatiquement !

## Domaine personnalisé (optionnel)

Si vous avez un nom de domaine (ex: esolrine.com) :

1. Dans Vercel → votre projet → **Settings** → **Domains**
2. Ajoutez votre domaine
3. Suivez les instructions pour configurer vos DNS
4. N'oubliez pas de mettre à jour :
   - `NEXTAUTH_URL` dans Vercel (Settings → Environment Variables)
   - L'URL dans votre GitHub OAuth App

## Problèmes courants

### "Access denied" quand je me connecte
- Vérifiez que `ADMIN_GITHUB_USERNAME` est EXACTEMENT votre nom d'utilisateur GitHub (sensible à la casse)
- Déconnectez-vous de GitHub et reconnectez-vous

### Erreur de base de données
- Vérifiez que toutes les variables `POSTGRES_*` sont bien configurées
- Vérifiez que vous avez bien visité `/api/setup`

### Les images ne s'uploadent pas
- Vérifiez `BLOB_READ_WRITE_TOKEN`
- Vérifiez que votre image fait moins de 5MB
- Vérifiez que c'est bien une image (JPEG, PNG, GIF, WebP)

### Le site ne se met pas à jour
- Attendez quelques minutes (propagation du cache)
- Forcez un redéploiement dans Vercel
- Videz votre cache navigateur (Ctrl + Shift + R)

## Mises à jour futures

Quand vous modifiez votre code :

```bash
git add .
git commit -m "Description de vos changements"
git push
```

Vercel va automatiquement déployer la nouvelle version !

## Besoin d'aide ?

- Vérifiez les logs d'erreur dans Vercel → votre projet → **Deployments** → cliquez sur le déploiement → **View Function Logs**
- Relisez ce guide étape par étape
- Vérifiez que toutes les variables d'environnement sont correctes

Bon courage ! 🚀
