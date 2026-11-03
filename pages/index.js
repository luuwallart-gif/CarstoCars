import { useState, useEffect, useMemo } from "react";
import Layout, { Reveal } from "../components/Layout";
import ScrollScene from "../components/ScrollScene";
import Bandeau from "../components/Bandeau";
import Couverture from "../components/Couverture";
import { tousLesArticles, resume } from "../lib/articles";
import { dateFr } from "../lib/articles-client";

export function getStaticProps() {
  return { props: { analyses: tousLesArticles().slice(0, 3).map(resume) } };
}

function depuis(iso) {
  const t = Date.parse(iso);
  if (!t) return "";
  const h = Math.round((Date.now() - t) / 36e5);
  if (h < 1) return "à l'instant";
  if (h < 24) return `il y a ${h} h`;
  const j = Math.round(h / 24);
  return j === 1 ? "hier" : j < 8 ? `il y a ${j} j` : "";
}

function Carte({ a, grand }) {
  return (
    <a href={a.lien} target="_blank" rel="noopener noreferrer" className={`card${grand ? " feature" : ""}`}>
      {a.image && (
        <div className="pic"><img src={a.image} alt="" loading="lazy" /></div>
      )}
      <div className="body">
        <span className="tag">{a.source}{a.date && depuis(a.date) ? <span className="date-rel"> · {depuis(a.date)}</span> : null}</span>
        <h3>{a.titre}</h3>
        {a.resume && <p>{a.resume}</p>}
        <span className="more">Lire l'article <i>→</i></span>
      </div>
    </a>
  );
}

export default function Home({ analyses = [] }) {
  const [articles, setArticles] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [source, setSource] = useState("Tout");
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/news")
      .then((r) => r.json())
      .then((d) => setArticles(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setChargement(false));
  }, []);

  const sources = useMemo(() => ["Tout", ...new Set(articles.map((a) => a.source))], [articles]);
  const liste = articles.filter(
    (a) =>
      (source === "Tout" || a.source === source) &&
      (a.titre + " " + a.resume).toLowerCase().includes(q.toLowerCase())
  );
  const [une, ...reste] = liste;

  return (
    <Layout actif="accueil" titre="">
      <ScrollScene />
      <Bandeau mots={["Formule 1", "MotoGP", "WEC", "WRC", "Formule E", "GT World", "F2", "F3"]} />

      {analyses.length > 0 && (
        <div className="wrap bloc" id="analyses">
          <div className="section-tete">
            <div>
              <p className="eyebrow">Nos analyses</p>
              <h2 className="titre-section" style={{ margin: 0 }}>À lire en ce moment.</h2>
            </div>
            <a href="/actus">Toutes les analyses →</a>
          </div>
          <div className="grid">
            {analyses.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.08}>
                <a href={`/actus/${a.slug}`} className="card">
                  <Couverture categorie={a.categorie} type={a.type} />
                  <div className="body">
                    <span className="tag">{a.type === "guide" ? "Guide" : a.categorie} · {dateFr(a.date)}</span>
                    <h3>{a.titre}</h3>
                    <p>{a.chapeau}</p>
                    <span className="more">{a.minutes} min de lecture <i>→</i></span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      <div className="wrap bloc" id="actus">
        <div className="section-tete">
          <div>
            <p className="eyebrow">Revue de presse</p>
            <h2 className="titre-section" style={{ margin: 0 }}>Les dernières infos.</h2>
          </div>
          <p>Titres et résumés issus de médias spécialisés. Chaque carte renvoie vers l'article d'origine.</p>
        </div>
        <div className="bar">
          {sources.map((s) => (
            <button key={s} className={`chip${source === s ? " on" : ""}`} onClick={() => setSource(s)}>{s}</button>
          ))}
          <input className="search" placeholder="Rechercher un article" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {chargement && (
          <div className="grid">{[0, 1, 2].map((i) => <div key={i} className="skeleton" />)}</div>
        )}
        {!chargement && liste.length === 0 && <p className="empty">Aucun article ne correspond.</p>}

        {une && <Reveal><Carte a={une} grand /></Reveal>}
        <div className="grid" style={{ marginTop: 20 }}>
          {reste.map((a, i) => (
            <Reveal key={a.lien || i} delay={(i % 3) * 0.08}><Carte a={a} /></Reveal>
          ))}
        </div>
      </div>
    </Layout>
  );
}
