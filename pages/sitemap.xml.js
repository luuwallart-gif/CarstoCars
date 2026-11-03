import config from "../site.config";
import { tousLesArticles } from "../lib/articles";
import { MARQUES } from "../data/marques";

export async function getServerSideProps({ res }) {
  const statiques = ["", "/actus", "/auto", "/sport", "/courses", "/classement", "/a-propos", "/contact", "/confidentialite", "/mentions-legales"];
  const urls = [
    ...statiques.map((p) => ({ loc: p, prio: p === "" ? "1.0" : "0.7" })),
    ...MARQUES.map((m) => ({ loc: `/auto/${m.slug}`, prio: "0.6" })),
    ...tousLesArticles().map((a) => ({ loc: `/actus/${a.slug}`, prio: "0.8", date: a.date })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${config.url}${u.loc}</loc>${u.date ? `<lastmod>${u.date}</lastmod>` : ""}<priority>${u.prio}</priority></url>`).join("\n")}
</urlset>`;
  res.setHeader("Content-Type", "application/xml");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();
  return { props: {} };
}

export default function Sitemap() { return null; }
