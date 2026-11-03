# Trame éditoriale des articles Carstocars

Ce document décrit comment sont écrites les analyses publiées dans `content/articles/`.
Il sert à la fois de règle pour l'automatisation quotidienne et de référence pour écrire un article à la main.

## Principe

Un article d'actualité est une **courte analyse originale** d'une information publiée par un média spécialisé.
Il **cite sa source**, renvoie vers elle et n'apporte **aucun fait qui ne soit pas dans la source**.

## Format d'un fichier (`content/articles/<slug>.json`)

```json
{
  "slug": "titre-court-en-minuscules-avec-tirets",
  "type": "actu",
  "categorie": "F1",
  "date": "2026-11-03",
  "titre": "Titre factuel, 25 à 95 caractères",
  "chapeau": "Une à deux phrases qui disent l'essentiel (60 à 280 caractères).",
  "essentiel": ["Point 1", "Point 2", "Point 3"],
  "sections": [
    { "titre": "Ce qui s'est passé", "paragraphes": ["…", "…"] },
    { "titre": "Pourquoi c'est important", "paragraphes": ["…"] },
    { "titre": "Le contexte", "paragraphes": ["…"] }
  ],
  "source": { "nom": "Motorsport.com", "url": "https://…" },
  "liens": [{ "label": "Classement F1", "href": "/classement" }],
  "ia": true
}
```

- `type` : `actu` (d'après une source) ou `guide` (contenu pédagogique durable, sans source obligatoire).
- `categorie` : F1, F2, F3, F4, WRC, WEC, GT, Formule E, MotoGP, Auto, Électrique, Marché, Culture auto.
- `liens` : 0 à 4 liens **internes** (`/auto/<marque>`, `/courses`, `/classement`, `/sport`, `/actus/<slug>`). Ils aident le lecteur et le référencement.
- `ia` : `true` si l'article a été rédigé avec l'aide d'une IA. Une mention est alors affichée automatiquement.

## Structure d'une actualité

1. **Titre** : factuel, sans exagération ni question piège. Pas de majuscules criardes.
2. **Chapeau** : l'information en une ou deux phrases.
3. **L'essentiel** : 3 ou 4 points courts, chacun vérifiable dans la source.
4. **Sections** (2 à 4), dans cet ordre quand c'est pertinent :
   - *Ce qui s'est passé* : les faits de la source, reformulés.
   - *Pourquoi c'est important* : les conséquences, en restant prudent.
   - *Le contexte* : un rappel utile au lecteur (classement, historique), uniquement avec des éléments sûrs.
5. **Source** : nom du média et adresse de l'article.

Longueur : entre 170 et 520 mots pour une actu, 180 à 900 pour un guide.

## Règles absolues

1. **Rien d'inventé.** Pas de chiffre, de date, de citation, de nom ou de résultat absent de la source. Une donnée incertaine est omise.
2. **Pas de copie.** Reformuler. Jamais plus de 12 mots consécutifs repris de la source, et aucune citation entre guillemets sauf si elle est courte et clairement attribuée.
3. **Une source = un article.** Ne pas traiter deux fois la même adresse source.
4. **Pas de rumeur.** Une information annoncée comme "selon" un média non confirmé est présentée comme telle, ou ignorée.
5. **Ton neutre**, vouvoiement ou formulation impersonnelle, en français correct.
6. **Pas de contenu sensible** : accident mortel, drame personnel, vie privée de personnes. On ne traite pas ces sujets.
7. **Pas de HTML, pas d'image, pas d'emoji.** Les couvertures sont générées à partir du logo de la compétition.
8. **Pas de promotion** : aucun lien d'affiliation ni mention commerciale dans le texte d'un article.

## Choix des sujets (automatisation quotidienne)

- 3 à 5 articles par jour maximum, plutôt moins que trop.
- Varier les catégories ; privilégier F1, WEC, WRC, MotoGP, Formule E et l'actualité des constructeurs.
- Préférer les informations de fond (résultats, décisions, annonces officielles, nouveaux modèles) aux anecdotes.
- Si la source est trop courte pour écrire 170 mots sans extrapoler, **ne pas écrire l'article**.

## Vérification

```
npm run valider
```

Le script `scripts/valider-articles.js` contrôle le format, les longueurs, la source et les liens internes. Le build du site refuse un article invalide.
