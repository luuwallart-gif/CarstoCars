import Head from "next/head";
import config from "../site.config";

/* Balises de référencement et de partage pour chaque page */
export default function Seo({ titre, description, chemin = "/", type = "website", image, jsonLd, noindex, datePublication }) {
  const complet = titre ? (titre.includes(config.nom) ? titre : `${titre} — ${config.nom}`) : `${config.nom} · Actualité auto et sport auto`;
  const desc = description || config.description;
  const url = config.url + chemin;
  const img = (image && (image.startsWith("http") ? image : config.url + image)) || `${config.url}/og.png`;
  return (
    <Head>
      <title>{complet}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#0c0c0d" />
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,follow" />}
      <link rel="alternate" type="application/rss+xml" title={`${config.nom} — analyses`} href="/flux.xml" />
      <meta property="og:site_name" content={config.nom} />
      <meta property="og:locale" content="fr_FR" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={complet} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      {datePublication && <meta property="article:published_time" content={datePublication} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={complet} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </Head>
  );
}
