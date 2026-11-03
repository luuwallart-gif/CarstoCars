import config from "../site.config";
import { tousLesArticles } from "../lib/articles";

const esc = (t) => String(t).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));

export async function getServerSideProps({ res }) {
  const articles = tousLesArticles().slice(0, 30);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${esc(config.nom)} — analyses</title>
<link>${config.url}</link>
<description>${esc(config.description)}</description>
<language>fr</language>
${articles.map((a) => `<item><title>${esc(a.titre)}</title><link>${config.url}/actus/${a.slug}</link><guid>${config.url}/actus/${a.slug}</guid><pubDate>${new Date(a.date + "T12:00:00Z").toUTCString()}</pubDate><description>${esc(a.chapeau)}</description><category>${esc(a.categorie)}</category></item>`).join("\n")}
</channel></rss>`;
  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function Flux() { return null; }
