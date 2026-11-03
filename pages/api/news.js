import Parser from "rss-parser";

const parser = new Parser({
  timeout: 6000,
  headers: { "User-Agent": "CarstocarsBot/1.0 (agrégateur d'actualités, liens vers les sources)" },
  customFields: { item: [["media:content", "media"], ["media:thumbnail", "miniature"]] },
});

// Les flux RSS des sites autos
const flux = [
  { source: "Caradisiac", url: "https://www.caradisiac.com/rss/actualites.xml" },
  { source: "Motorsport", url: "https://fr.motorsport.com/rss/all/news/" },
  { source: "Auto Plus", url: "https://www.autoplus.fr/rss" },
  { source: "Motorsport F1", url: "https://fr.motorsport.com/rss/f1/news/" },
  { source: "Motorsport WRC", url: "https://fr.motorsport.com/rss/wrc/news/" },
  { source: "Motorsport WEC", url: "https://fr.motorsport.com/rss/wec/news/" },
  { source: "Motorsport MotoGP", url: "https://fr.motorsport.com/rss/motogp/news/" },
  { source: "Motorsport FE", url: "https://fr.motorsport.com/rss/formula-e/news/" },
];

const DUREE_CACHE = 10 * 60 * 1000;
let cache = { t: 0, data: null };

function coupe(texte, max) {
  if (!texte) return "";
  const propre = texte.replace(/\s+/g, " ").trim();
  if (propre.length <= max) return propre;
  return propre.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

async function charger() {
  // Tous les flux en parallèle : un flux lent ou en panne ne bloque pas les autres
  const resultats = await Promise.allSettled(
    flux.map(async (f) => {
      const feed = await parser.parseURL(f.url);
      return feed.items.slice(0, 8).map((item) => ({
        titre: item.title,
        resume: coupe(item.contentSnippet, 150),
        lien: item.link,
        source: f.source,
        image: item.enclosure?.url || item.media?.$?.url || item.miniature?.$?.url || null,
        date: item.isoDate || item.pubDate || null,
      }));
    })
  );
  const vus = new Set();
  const articles = [];
  resultats.forEach((r) => {
    if (r.status !== "fulfilled") return;
    r.value.forEach((a) => {
      if (!a.titre || !a.lien || vus.has(a.lien)) return;
      vus.add(a.lien);
      articles.push(a);
    });
  });
  // Les plus récents d'abord
  articles.sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));
  return articles;
}

export default async function handler(req, res) {
  try {
    if (!cache.data || Date.now() - cache.t > DUREE_CACHE) {
      const data = await charger();
      // On ne remplace le cache que si on a obtenu quelque chose
      if (data.length || !cache.data) cache = { t: Date.now(), data };
    }
    res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
    res.status(200).json(cache.data);
  } catch (error) {
    res.status(500).json({ error: "Impossible de charger les actus" });
  }
}
