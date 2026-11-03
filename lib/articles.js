import fs from "fs";
import path from "path";

const DOSSIER = path.join(process.cwd(), "content", "articles");

/* Les articles sont des fichiers JSON : content/articles/<slug>.json (voir content/TRAME.md) */
export function tousLesArticles() {
  if (!fs.existsSync(DOSSIER)) return [];
  return fs
    .readdirSync(DOSSIER)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const a = JSON.parse(fs.readFileSync(path.join(DOSSIER, f), "utf8"));
      return { ...a, slug: a.slug || f.replace(/\.json$/, "") };
    })
    .sort((a, b) => (b.date + b.slug).localeCompare(a.date + a.slug));
}

export function unArticle(slug) {
  return tousLesArticles().find((a) => a.slug === slug) || null;
}

export function motsArticle(a) {
  const texte = [a.chapeau, ...(a.essentiel || []), ...(a.sections || []).flatMap((s) => [s.titre, ...s.paragraphes])].join(" ");
  return texte.split(/\s+/).filter(Boolean).length;
}

export function tempsLecture(a) {
  return Math.max(1, Math.round(motsArticle(a) / 200));
}

// Version légère pour les listes (pas besoin du texte complet)
export function resume(a) {
  return {
    slug: a.slug,
    titre: a.titre,
    chapeau: a.chapeau,
    categorie: a.categorie,
    type: a.type,
    date: a.date,
    minutes: tempsLecture(a),
  };
}
