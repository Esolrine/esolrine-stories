# Checklist de Déploiement Rapide ✅

Cochez au fur et à mesure !

## ☐ Étape 1 : GitHub OAuth App (5 min)

1. Allez sur https://github.com/settings/developers
2. Cliquez sur **OAuth Apps** → **New OAuth App**
3. Remplissez :
   - **Application name** : `Esolrine Admin`
   - **Homepage URL** : `http://localhost:3000` (temporaire)
   - **Callback URL** : `http://localhost:3000/api/auth/callback/github`
4. Cliquez sur **Register application**
5. **NOTEZ QUELQUE PART** :
   - Client ID : `________________`
   - Client Secret : `________________` (cliquez "Generate new client secret")

---

## ☐ Étape 2 : Déployer sur Vercel (2 min)

1. Allez sur https://vercel.com
2. Connectez-vous avec GitHub (compte **Esolrine**)
3. **Add New...** → **Project**
4. Importez le repository **esolrine-stories**
5. **Deploy** (ne touchez à rien d'autre)
6. **NOTEZ L'URL** de déploiement : `________________.vercel.app`

⚠️ Le déploiement va échouer, c'est NORMAL !

---

## ☐ Étape 3 : Neon Database (3 min)

1. Dans Vercel → votre projet → onglet **Marketplace**
2. Cherchez et cliquez sur **Neon** (Serverless Postgres)
3. **Add Integration**
4. Sélectionnez votre projet → **Continue**
5. Autorisez l'intégration
6. Vérifiez que les variables `POSTGRES_*` ou `DATABASE_*` sont dans **Settings** → **Environment Variables**

✅ Neon ajoute automatiquement toutes les variables Postgres !

---

## ☐ Étape 4 : Blob Storage (2 min)

1. Dans Vercel → votre projet → onglet **Storage**
2. **Create Database** → **Blob**
3. Nom : `esolrine-images`
4. **Create**
5. **NOTEZ** le token : `BLOB_READ_WRITE_TOKEN` = `________________`

---

## ☐ Étape 5 : Générer NextAuth Secret (1 min)

Option A - Avec terminal :
```bash
openssl rand -base64 32
```

Option B - Avec un site :
https://generate-secret.vercel.app/32

**NOTEZ** le secret : `________________`

---

## ☐ Étape 6 : Variables d'environnement (5 min)

Dans Vercel → **Settings** → **Environment Variables**, ajoutez **UNE PAR UNE** :

### ☐ Variables obligatoires à ajouter :

1. ☐ `BLOB_READ_WRITE_TOKEN` = (étape 4)
2. ☐ `NEXTAUTH_URL` = `https://VOTRE-PROJET.vercel.app` (étape 2)
3. ☐ `NEXTAUTH_SECRET` = (étape 5)
4. ☐ `GITHUB_ID` = (étape 1)
5. ☐ `GITHUB_SECRET` = (étape 1)
6. ☐ `ADMIN_GITHUB_USERNAME` = `Esolrine`

⚠️ **Pour CHAQUE variable** : sélectionnez les 3 environnements (Production, Preview, Development)

⚠️ **NE TOUCHEZ PAS** aux variables Postgres de Neon, elles sont déjà là !

---

## ☐ Étape 7 : Mettre à jour GitHub OAuth (2 min)

1. Retournez sur https://github.com/settings/developers
2. Cliquez sur votre OAuth App **Esolrine Admin**
3. Modifiez :
   - **Homepage URL** : `https://VOTRE-PROJET.vercel.app`
   - **Callback URL** : `https://VOTRE-PROJET.vercel.app/api/auth/callback/github`
4. **Update application**

---

## ☐ Étape 8 : Redéployer (2 min)

1. Dans Vercel → **Deployments**
2. Cliquez sur les **3 points** du dernier déploiement
3. **Redeploy**
4. Attendez que le déploiement finisse (2-3 min)

---

## ☐ Étape 9 : Initialiser la base de données (30 sec)

1. Allez sur : `https://VOTRE-PROJET.vercel.app/api/setup`
2. Vous devez voir : `{"message": "Database initialized successfully"}`

✅ Si vous voyez ce message, c'est bon !

---

## ☐ Étape 10 : TEST FINAL ! 🎉

1. ☐ Allez sur `https://VOTRE-PROJET.vercel.app/admin`
2. ☐ Cliquez sur **Sign in with GitHub**
3. ☐ Connectez-vous avec le compte **Esolrine**
4. ☐ Autorisez l'application
5. ☐ Vous êtes dans le dashboard ? **BRAVO !** 🎉

---

## ☐ Bonus : Créer une histoire test

1. ☐ Cliquez sur **New Story**
2. ☐ Remplissez le titre et l'excerpt
3. ☐ Écrivez du contenu avec l'éditeur
4. ☐ Cochez **Published**
5. ☐ **Create Story**
6. ☐ Allez sur `https://VOTRE-PROJET.vercel.app`
7. ☐ Votre histoire est là ! 🚀

---

## Problème ? Débugage rapide

### ❌ "Access denied" à la connexion
- Vérifiez que `ADMIN_GITHUB_USERNAME` = **exactement** `Esolrine`
- Déconnectez-vous de GitHub et reconnectez

### ❌ Erreur de base de données
- Vérifiez que les variables Neon sont bien là
- Avez-vous visité `/api/setup` ?

### ❌ Les images ne s'uploadent pas
- Vérifiez `BLOB_READ_WRITE_TOKEN`
- Images max 5MB

### ❌ Le site ne se met pas à jour
- Attendez 2-3 minutes (cache)
- Redéployez manuellement

---

**Temps total estimé : 20-30 minutes**

Pour le guide détaillé : voir `GUIDE-DEPLOIEMENT.md`
