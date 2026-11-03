#!/usr/bin/env node
// Vérifie que chaque article de content/articles respecte la trame (voir content/TRAME.md).
// Utilisé avant le build du site et par l'automatisation quotidienne : un article invalide bloque la publication.
const fs = require("fs");
const path = require("path");

const DOSSIER = path.join(__dirname, "..", "content", "articles");
const CATEGORIES = ["F1", "F2", "F3", "F4", "WRC", "WEC", "GT", "Formule E", "MotoGP", "Auto", "Électrique", "Marché", "Culture auto"];
const ROUTES_OK = [/^\/$/, /^\/actus(\/[a-z0-9-]+)?$/, /^\/auto(\/[a-z0-9-]+)?$/, /^\/sport$/, /^\/courses$/, /^\/classement$/];

const erreursTotal = [];
const fichiers = fs.existsSync(DOSSIER) ? fs.readdirSync(DOSSIER).filter((f) => f.endsWith(".json")) : [];
const sources = new Map();
const slugs = new Set();
const mots = (t) => t.split(/\s+/).filter(Boolean).length;

for (const f of fichiers) {
  const err = [];
  let a;
  try { a = JSON.parse(fs.readFileSync(path.join(DOSSIER, f), "utf8")); } catch (e) { erreursTotal.push(`${f}: JSON invalide`); continue; }
  const ok = (cond, msg) => { if (!cond) err.push(msg); };
  const slugFichier = f.replace(/\.json$/, "");

  ok(a.slug === slugFichier, `le slug doit être identique au nom du fichier (${slugFichier})`);
  ok(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a.slug || ""), "slug : minuscules, chiffres et tirets seulement");
  ok(!slugs.has(a.slug), "slug en double"); slugs.add(a.slug);
  ok(["actu", "guide"].includes(a.type), 'type : "actu" ou "guide"');
  ok(CATEGORIES.includes(a.categorie), `catégorie inconnue (${CATEGORIES.join(", ")})`);
  ok(/^\d{4}-\d{2}-\d{2}$/.test(a.date || "") && !isNaN(Date.parse(a.date)), "date au format AAAA-MM-JJ");
  ok(Date.parse(a.date) <= Date.now() + 36e5 * 24, "la date ne peut pas être dans le futur");

  ok(typeof a.titre === "string" && a.titre.length >= 25 && a.titre.length <= 95, "titre : entre 25 et 95 caractères");
  ok(typeof a.chapeau === "string" && a.chapeau.length >= 60 && a.chapeau.length <= 280, "chapeau : entre 60 et 280 caractères");
  ok(Array.isArray(a.essentiel) && a.essentiel.length >= 3 && a.essentiel.length <= 4, "essentiel : 3 ou 4 points");
  (a.essentiel || []).forEach((e, i) => ok(typeof e === "string" && e.length >= 20 && e.length <= 260, `essentiel[${i}] : entre 20 et 260 caractères`));
  ok(Array.isArray(a.sections) && a.sections.length >= 2 && a.sections.length <= 5, "sections : entre 2 et 5");
  (a.sections || []).forEach((s, i) => {
    ok(typeof s.titre === "string" && s.titre.length >= 8 && s.titre.length <= 90, `sections[${i}].titre : entre 8 et 90 caractères`);
    ok(Array.isArray(s.paragraphes) && s.paragraphes.length >= 1 && s.paragraphes.length <= 4, `sections[${i}] : 1 à 4 paragraphes`);
    (s.paragraphes || []).forEach((p, j) => ok(typeof p === "string" && p.length >= 40 && p.length <= 750, `sections[${i}].paragraphes[${j}] : entre 40 et 750 caractères`));
  });

  const total = mots([a.chapeau, ...(a.essentiel || []), ...(a.sections || []).flatMap((s) => [s.titre, ...(s.paragraphes || [])])].join(" "));
  const [mn, mx] = a.type === "guide" ? [180, 900] : [170, 520];
  ok(total >= mn && total <= mx, `longueur : ${total} mots (attendu ${mn}–${mx})`);

  if (a.type === "actu") {
    ok(a.source && typeof a.source.nom === "string" && a.source.nom.length > 1, "source.nom obligatoire pour une actu");
    ok(a.source && /^https:\/\/[^\s]+$/.test(a.source.url || ""), "source.url (https) obligatoire pour une actu");
    if (a.source?.url) {
      ok(!sources.has(a.source.url), `source déjà traitée par ${sources.get(a.source.url)}`);
      sources.set(a.source.url, f);
    }
  }
  ok(a.ia === true || a.ia === false, "ia : true ou false (transparence)");
  if (a.liens !== undefined) {
    ok(Array.isArray(a.liens) && a.liens.length <= 4, "liens : 4 maximum");
    (a.liens || []).forEach((l, i) => ok(l && typeof l.label === "string" && typeof l.href === "string" && ROUTES_OK.some((r) => r.test(l.href)), `liens[${i}] : adresse interne connue (/auto/<marque>, /courses, /classement, /sport, /actus/<slug>)`));
  }
  const tout = JSON.stringify(a);
  ok(!/<[a-z!\/][^>]*>/i.test(tout), "pas de HTML dans les textes");
  ok(!/lorem ipsum|TODO|À compléter/i.test(tout), "texte provisoire détecté");

  err.forEach((m) => erreursTotal.push(`${f}: ${m}`));
}

if (erreursTotal.length) {
  console.error(`✖ ${erreursTotal.length} problème(s) dans les articles :\n` + erreursTotal.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log(`✔ ${fichiers.length} article(s) valides`);
