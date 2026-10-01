import { useState, useEffect, useMemo } from "react";
import Layout, { Reveal } from "../components/Layout";

function Carte({ a, grand }) {
  return (
    <a href={a.lien} target="_blank" rel="noopener noreferrer" className={`card${grand ? " feature" : ""}`}>
      {a.image && (
        <div className="pic"><img src={a.image} alt="" loading="lazy" /></div>
      )}
      <div className="body">
        <span className="tag">{a.source}</span>
        <h3>{a.titre}</h3>
        {a.resume && <p>{a.resume}</p>}
        <span className="more">Lire l'article <i>→</i></span>
      </div>
    </a>
  );
}

export default function Home() {
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
    <Layout
      actif="accueil"
      eyebrow="Actualité automobile"
      titre="Tout ce qui roule, en direct."
      accroche="Essais, nouveautés, sport auto : les dernières infos des meilleures rédactions, au même endroit."
    >
      <div className="wrap">
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
        <div className="grid">
          {reste.map((a, i) => (
            <Reveal key={a.lien || i} delay={(i % 3) * 0.06}><Carte a={a} /></Reveal>
          ))}
        </div>
      </div>
    </Layout>
  );
}
