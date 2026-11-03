# Carstocars

Site d'actualité automobile et de sport auto : fiches de 94 marques, Grands Prix de F1 depuis 2015, classements, analyses quotidiennes.

Next.js 14 · framer-motion · Tailwind · Leaflet. Aucune base de données : les articles sont des fichiers JSON.

## Démarrer

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # valide les articles puis construit le site
```

## À configurer avant la mise en ligne

1. **`site.config.js`** : nom de l'éditeur, statut, adresse, e-mail de contact (pages *Mentions légales* et *Contact*). Les champs vides s'affichent « à compléter ».
2. **Variable d'environnement `NEXT_PUBLIC_SITE_URL`** (dans Vercel) : l'adresse publique du site, utilisée pour le plan du site, les liens de partage et les balises Open Graph.
3. **`NEXT_PUBLIC_CONTACT_EMAIL`** (optionnel) : l'adresse e-mail affichée sur la page Contact.
4. Hébergement : l'offre gratuite de Vercel est réservée à un usage non commercial. Passez à une offre payante avant d'afficher de la publicité.
5. Publicité ou statistiques : ajouter un bandeau de consentement aux cookies et mettre à jour `pages/confidentialite.js`.

## Articles

Les analyses sont dans `content/articles/*.json`, écrites selon `content/TRAME.md`.

```bash
npm run valider    # contrôle le format, les longueurs, la source et les liens internes
```

Une automatisation peut créer chaque jour des articles et ouvrir une *pull request* : relire puis fusionner publie les articles (le déploiement est automatique).

## Structure

- `pages/` : pages du site (`/actus`, `/auto/[marque]`, `/courses`, `/classement`...), API (`/api/news`, `/api/classement-f1`), `sitemap.xml`, `flux.xml`, `robots.txt`
- `components/` : mise en page, scène d'accueil, couvertures d'articles
- `data/` : marques et modèles phares
- `public/` : logos, photos de voitures, icônes
- `scripts/valider-articles.js` : contrôle des articles
