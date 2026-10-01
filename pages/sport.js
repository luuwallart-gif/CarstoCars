import { useState, useEffect } from "react";
import Layout, { Reveal } from "../components/Layout";

const COMPETITIONS = [
  { id: 'f1', nom: 'F1', mots: ['formule 1', 'formula 1', 'f1', 'grand prix'] },
  { id: 'f2', nom: 'F2', mots: ['formule 2', 'formula 2', 'f2'] },
  { id: 'f3', nom: 'F3', mots: ['formule 3', 'formula 3', 'f3'] },
  { id: 'f4', nom: 'F4', mots: ['formule 4', 'formula 4', 'f4'] },
  { id: 'wrc', nom: 'WRC', mots: ['wrc', 'rallye', 'rally'] },
  { id: 'gt', nom: 'GT World', mots: ['gt world', 'gt3', 'gt world challenge'] },
  { id: 'wec', nom: 'WEC', mots: ['wec', 'endurance', 'le mans', 'hypercar'] },
  { id: 'fe', nom: 'Formule E', mots: ['formule e', 'formula e', 'formule-e'] },
];

export default function Sport() {
  const [articles, setArticles] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [ongletActif, setOngletActif] = useState('f1');

  useEffect(() => {
    fetch("/api/news")
      .then((res) => res.json())
      .then((data) => {
        setArticles(Array.isArray(data) ? data : []);
        setChargement(false);
      })
      .catch(() => setChargement(false));
  }, []);

  const competition = COMPETITIONS.find((c) => c.id === ongletActif);

  const articlesFiltres = articles.filter((article) => {
    const texte = ((article.titre || '') + ' ' + (article.resume || '')).toLowerCase();
    return competition.mots.some((mot) => texte.includes(mot));
  });

  return (
    <Layout actif="sport" eyebrow="Compétition" titre="Le sport auto, course après course." accroche="F1, WRC, Endurance, Formule E : choisis ta discipline.">
      <div className="wrap">
        <div className="bar">
          {COMPETITIONS.map((c) => (
            <button key={c.id} className={`chip${ongletActif === c.id ? " on" : ""}`} onClick={() => setOngletActif(c.id)}>{c.nom}</button>
          ))}
        </div>

        {ongletActif === "f1" && (
          <div className="bar">
            <a href="/classement" className="btn">Classement de la saison →</a>
            <a href="/courses" className="btn ghost">Explorer les Grands Prix</a>
          </div>
        )}

        {chargement && <div className="grid">{[0, 1, 2].map((i) => <div key={i} className="skeleton" />)}</div>}
        {!chargement && articlesFiltres.length === 0 && (
          <p className="empty">Aucune actu {competition.nom} pour le moment, reviens bientôt.</p>
        )}

        <div className="grid">
          {articlesFiltres.map((a, i) => (
            <Reveal key={a.lien || i} delay={(i % 3) * 0.06}>
              <a href={a.lien} target="_blank" rel="noopener noreferrer" className="card">
                {a.image && <div className="pic"><img src={a.image} alt="" loading="lazy" /></div>}
                <div className="body">
                  <span className="tag">{a.source}</span>
                  <h3>{a.titre}</h3>
                  {a.resume && <p>{a.resume}</p>}
                  <span className="more">Lire l'article <i>→</i></span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </Layout>
  );
}
