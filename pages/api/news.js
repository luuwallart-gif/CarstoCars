import Parser from "rss-parser";

const parser = new Parser();

// Les flux RSS des sites autos fiables
const flux = [
  { source: "Caradisiac", url: "https://www.caradisiac.com/rss/actualites.xml" },
  { source: "Motorsport", url: "https://fr.motorsport.com/rss/all/news/" },
  { source: "Auto Plus", url: "https://www.autoplus.fr/rss" },
  { source: "Motorsport F1", url: "https://fr.motorsport.com/rss/f1/news/" },
  { source: "Motorsport WRC", url: "https://fr.motorsport.com/rss/wrc/news/" },
  { source: "Motorsport WEC", url: "https://fr.motorsport.com/rss/wec/news/" },
  { source: "Motorsport FE", url: "https://fr.motorsport.com/rss/formula-e/news/" },
];

export default async function handler(req, res) {
  try {
    let articles = [];

    // On parcourt chaque site
    for (const f of flux) {
      try {
        const feed = await parser.parseURL(f.url);
        const items = feed.items.slice(0, 4).map((item) => ({
          titre: item.title,
          resume: item.contentSnippet ? item.contentSnippet.slice(0, 120) + "..." : "",
          lien: item.link,
          source: f.source,
          image: item.enclosure?.url || null,
        }));
        articles = articles.concat(items);
      } catch (e) {
        // Si un site ne répond pas, on continue avec les autres
        console.log("Erreur avec " + f.source);
      }
    }

    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: "Impossible de charger les actus" });
  }
}
