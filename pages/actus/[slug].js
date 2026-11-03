import { useState } from "react";
import Layout from "../../components/Layout";
import Couverture from "../../components/Couverture";
import config from "../../site.config";
import { tousLesArticles, unArticle, tempsLecture, resume } from "../../lib/articles";
import { dateFr } from "../../lib/articles-client";

export function getStaticPaths() {
  return { paths: tousLesArticles().map((a) => ({ params: { slug: a.slug } })), fallback: false };
}

export function getStaticProps({ params }) {
  const a = unArticle(params.slug);
  const autres = tousLesArticles()
    .filter((x) => x.slug !== a.slug)
    .sort((x, y) => (y.categorie === a.categorie) - (x.categorie === a.categorie))
    .slice(0, 3)
    .map(resume);
  return { props: { a, minutes: tempsLecture(a), autres } };
}

export default function PageArticle({ a, minutes, autres }) {
  const [copie, setCopie] = useState(false);
  const url = `${config.url}/actus/${a.slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": a.type === "guide" ? "Article" : "NewsArticle",
    headline: a.titre,
    description: a.chapeau,
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: "fr-FR",
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: config.nom },
    publisher: { "@type": "Organization", name: config.nom, url: config.url },
    ...(a.source ? { isBasedOn: a.source.url } : {}),
  };

  const copier = async () => {
    try { await navigator.clipboard.writeText(url); setCopie(true); setTimeout(() => setCopie(false), 2000); } catch (e) {}
  };

  return (
    <Layout actif="actus" seo={{ chemin: `/actus/${a.slug}`, titre: a.titre, description: a.chapeau, type: "article", jsonLd, datePublication: a.date }}>
      <article className="wrap article">
        <nav className="fil" aria-label="Fil d'Ariane">
          <a href="/">Accueil</a> <span>/</span> <a href="/actus">Analyses</a> <span>/</span> <span>{a.categorie}</span>
        </nav>
        <p className="eyebrow">{a.type === "guide" ? "Guide" : a.categorie} · {dateFr(a.date)} · {minutes} min de lecture</p>
        <h1 className="article-titre">{a.titre}</h1>
        <p className="chapeau">{a.chapeau}</p>

        <Couverture categorie={a.categorie} type={a.type} grand />

        <div className="essentiel">
          <h2>L'essentiel</h2>
          <ul>{a.essentiel.map((e, i) => <li key={i}>{e}</li>)}</ul>
        </div>

        {a.sections.map((s, i) => (
          <section key={i} className="texte">
            <h2>{s.titre}</h2>
            {s.paragraphes.map((p, j) => <p key={j}>{p}</p>)}
          </section>
        ))}

        {a.liens?.length > 0 && (
          <div className="aller">
            <h2>Aller plus loin sur Carstocars</h2>
            <div className="bar">
              {a.liens.map((l) => <a key={l.href} className="chip" href={l.href}>{l.label}</a>)}
            </div>
          </div>
        )}

        {a.source && (
          <aside className="source">
            <h2>Source</h2>
            <p>Cette analyse s'appuie sur l'article publié par <b>{a.source.nom}</b>. Les faits et les chiffres viennent de cette source, que nous vous invitons à lire.</p>
            <a className="btn ghost" href={a.source.url} target="_blank" rel="noopener noreferrer nofollow">Lire l'article de {a.source.nom} ↗</a>
          </aside>
        )}

        {a.ia && (
          <p className="mention-ia">
            Cet article a été rédigé avec l'aide d'une intelligence artificielle, à partir de la source citée, selon la <a href="/a-propos#ligne-editoriale">ligne éditoriale</a> de {config.nom}. Une erreur ? <a href="/contact">Signalez-la nous</a>.
          </p>
        )}

        <div className="partage">
          <button className="chip" onClick={copier}>{copie ? "Lien copié" : "Copier le lien"}</button>
          <a className="chip" href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(a.titre)}`} target="_blank" rel="noopener noreferrer">Partager sur X</a>
          <a className="chip" href={`https://wa.me/?text=${encodeURIComponent(a.titre + " " + url)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        </div>

        {autres.length > 0 && (
          <section className="suite">
            <h2>À lire aussi</h2>
            <div className="grid">
              {autres.map((o) => (
                <a key={o.slug} href={`/actus/${o.slug}`} className="card">
                  <Couverture categorie={o.categorie} type={o.type} />
                  <div className="body">
                    <span className="tag">{o.type === "guide" ? "Guide" : o.categorie}</span>
                    <h3>{o.titre}</h3>
                    <span className="more">{o.minutes} min <i>→</i></span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
}
