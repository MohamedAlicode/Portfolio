# Portfolio de Mohamed Ali Ouachani

Site personnel d'un développeur web full-stack basé à Paris, en français et en anglais.

**En ligne :** https://mohamedalicode.github.io/Portfolio/
(version anglaise : https://mohamedalicode.github.io/Portfolio/?lang=en)

Le site tient sur une seule page :

- l'accueil ;
- trois projets, chacun avec sa démo en vidéo (Maison Cadran, Altaïr, Quiz Live) ;
- les compétences ;
- le parcours ;
- quelques lignes « à propos » ;
- le contact, avec le CV à télécharger.

## Technique

- **Vite + React + TypeScript**, styles en **Tailwind CSS 4**. Le site est 100 % statique : pas de serveur, pas de base de données.
- **Animations :** GSAP (ScrollTrigger, SplitText) et Lenis pour le défilement fluide.
- **Mouvements réduits :** si le visiteur a demandé moins d'animations dans son système (`prefers-reduced-motion`), tout s'affiche directement et les démos attendent qu'on appuie sur Lecture.
- **Référencement :** titre et description dans les deux langues, aperçu au partage (Open Graph), données structurées, `sitemap.xml` et `robots.txt` générés au build.
- **Mesures Lighthouse** (en local) :
  - mobile : Performance 93, Accessibilité 100, Bonnes pratiques 100, SEO 100 ;
  - ordinateur : 100 partout.

## Lancer le site sur son ordinateur

Il faut [Node.js](https://nodejs.org) version 22 ou plus.

```bash
npm install      # une seule fois, installe les dépendances
npm run dev      # lance le site sur http://localhost:5173, qui se recharge à chaque modification
```

D'autres commandes utiles :

```bash
npm run build    # fabrique la version finale du site dans le dossier dist/
npm run preview  # affiche cette version finale sur http://localhost:4173
```

## Modifier le contenu

Tous les textes sont dans deux fichiers. Il n'est pas nécessaire de toucher aux composants.

| Fichier | Ce qu'il contient |
| --- | --- |
| `src/data/content.ts` | Nom, e-mail, liens, adresse du site, accueil, compétences, parcours, à propos, contact |
| `src/data/projects.ts` | Les trois projets : accroche, rôle, étapes de la démo, chiffres, stack, liens |

Chaque texte existe en deux langues :

```ts
title: { fr: 'Fiche produit', en: 'Product page' },
```

Change toujours le `fr` **et** le `en`.

Deux petites règles d'écriture :

- **Mots en bronze.** Dans le texte « à propos », un mot entouré d'astérisques (`*comme ceci*`) s'affiche en italique bronze.
- **Ponctuation française.** Avant `:` on met une espace insécable (` `), et avant `; ? !` une espace fine insécable (` `). Elles empêchent la ponctuation de partir seule à la ligne suivante.

### Le CV

Le CV téléchargeable se trouve dans `public/cv/CV_Mohamed_Ali_Ouachani.pdf`. Pour le remplacer, dépose un nouveau PDF sous le même nom.

Ce fichier est public : n'y mets **ni numéro de téléphone ni adresse postale**.

### L'adresse du site

L'adresse publique est écrite à un seul endroit, `site.url` dans `src/data/content.ts`. Elle sert pour :

- le référencement (balise canonique, `sitemap.xml`) ;
- l'image d'aperçu au partage.

Si le site change d'adresse (par exemple un nom de domaine à toi), modifie seulement cette ligne. Pense aussi à mettre à jour l'adresse du portfolio écrite dans le CV.

### Les démos des projets

Chaque démo est une courte vidéo qui tourne en boucle, comme un GIF, avec un bouton Pause.

- Les vidéos sont dans `public/demos/`, nommées d'après le projet : `maison-cadran.mp4`, etc.
- À côté de chaque vidéo, une image `.webp` du même nom s'affiche pendant le chargement.
- Les étapes (`beats`) du projet s'allument quand la vidéo atteint leur seconde de départ (`at`, dans `projects.ts`).

Pour transformer un GIF en vidéo, avec [ffmpeg](https://ffmpeg.org) :

```bash
ffmpeg -i apercu.gif -an -c:v libx264 -crf 25 -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -movflags +faststart public/demos/mon-projet.mp4
```

Puis, pour l'image d'attente (ici la vue à 3,5 secondes) :

```bash
ffmpeg -ss 3.5 -i public/demos/mon-projet.mp4 -frames:v 1 public/demos/mon-projet.webp
```

## Mettre le site en ligne

### Option 1 : GitHub Pages (gratuit, déjà prêt)

Le fichier `.github/workflows/deploy.yml` met le site en ligne automatiquement à chaque envoi sur la branche `main`.

À faire **une seule fois** :

1. Sur GitHub, ouvre le dépôt **Portfolio**, puis **Settings** → **Pages**.
2. Dans **Build and deployment** → **Source**, choisis **GitHub Actions**.
3. Fusionne la pull request du portfolio dans `main`, ou envoie un changement sur `main`.
4. Ouvre l'onglet **Actions** : le travail « Mise en ligne » tourne pendant environ une minute. Quand il est vert, le site est en ligne à l'adresse https://mohamedalicode.github.io/Portfolio/.

Ensuite, chaque modification envoyée sur `main` est mise en ligne toute seule.

### Option 2 : Vercel

1. Crée un compte sur [vercel.com](https://vercel.com) avec ton compte GitHub.
2. Clique sur **Add New** → **Project**, puis importe le dépôt **Portfolio**. Vercel reconnaît Vite tout seul : commande `npm run build`, dossier `dist`.
3. Clique sur **Deploy**.
4. Remplace `site.url` dans `src/data/content.ts` par l'adresse donnée par Vercel, puis envoie ce changement.

## Envoyer une modification sur GitHub

Après avoir modifié un fichier :

```bash
git add .
git commit -m "Met à jour le texte à propos"
git push
```

Si tu travailles directement sur `main`, le site se met à jour tout seul une minute plus tard (option GitHub Pages).

## Organisation du code

```
public/            fichiers servis tels quels : CV, vidéos des démos, favicon, image de partage
src/data/          tout le contenu (à modifier ici)
src/components/    les sections de la page (Hero, Projects, Skills, Path, About, Contact, Footer…)
src/hooks/         petits outils partagés (entrées au scroll, effet magnétique, zones de couleur)
src/lib/           langue, thème, défilement, réglages des animations
src/index.css      couleurs, typographie et animations en CSS
vite.config.ts     build, génération du sitemap et préchargement des polices
```
