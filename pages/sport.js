import { useState, useEffect } from "react";

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
    <main style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #141b2e 100%)", color: "#fff", minHeight: "100vh", fontFamily: "'Rajdhani', sans-serif" }}>

      {/* Barre du haut */}
      <header style={{ padding: "20px 40px", background: "rgba(10,14,26,0.8)", borderBottom: "3px solid #00d4ff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(10px)" }}>
        <h1 style={{ fontFamily: "'Racing Sans One', cursive", background: "linear-gradient(90deg, #00d4ff, #e10600)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, fontSize: "32px", letterSpacing: "1px" }}>CARSTOCARS</h1>
        <nav style={{ fontSize: "18px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
          <a href="/" style={{ color: "#fff", marginRight: "24px", textDecoration: "none" }}>Accueil</a>
          <a href="/auto" style={{ color: "#fff", marginRight: "24px", textDecoration: "none" }}>Automobile</a>
          <a href="/sport" style={{ color: "#00d4ff", textDecoration: "none" }}>Sport Auto</a>
        </nav>
      </header>

      {/* Bandeau titre */}
      <section style={{ padding: "60px 40px 30px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Racing Sans One', cursive", fontSize: "48px", margin: "0 0 10px", textTransform: "uppercase" }}>
          Le <span style={{ color: "#e10600" }}>Sport</span> Auto
        </h2>
        <p style={{ color: "#8b9bb4", fontSize: "18px", margin: 0 }}>Toutes les compétitions du monde de la course automobile</p>
        <div style={{ width: "80px", height: "4px", background: "linear-gradient(90deg, #00d4ff, #e10600)", margin: "20px auto 0", borderRadius: "2px" }}></div>
      </section>

      {/* Onglets des compétitions */}
      <section style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", padding: "0 40px 40px" }}>
        {COMPETITIONS.map((c) => (
          <button
            key={c.id}
            onClick={() => setOngletActif(c.id)}
            style={{
              padding: "10px 22px",
              borderRadius: "30px",
              border: ongletActif === c.id ? "2px solid #00d4ff" : "2px solid #253150",
              background: ongletActif === c.id ? "linear-gradient(90deg, #00d4ff, #e10600)" : "#141b2e",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "700",
              fontFamily: "'Rajdhani', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "1px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {c.nom}
          </button>
        ))}
      </section>
      {/* Bouton classement F1 */}
      {ongletActif === 'f1' && (
        <section style={{ textAlign: "center", padding: "0 40px 40px" }}>
          <a
            href="/classement"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 34px",
              borderRadius: "40px",
              background: "linear-gradient(90deg, #00d4ff, #e10600)",
              color: "#fff",
              textDecoration: "none",
              fontSize: "18px",
              fontWeight: "700",
              fontFamily: "'Rajdhani', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "1px",
              boxShadow: "0 8px 30px rgba(0,212,255,0.3)",
            }}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg" alt="F1" style={{ height: "20px" }} />
            Voir le classement de la saison →
          </a>

          <a
            href="/courses"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              marginLeft: "16px",
              padding: "16px 34px",
              borderRadius: "30px",
              background: "linear-gradient(90deg, #00d4ff, #e10600)",
              color: "#fff",
              textDecoration: "none",
              fontSize: "18px",
              fontWeight: "700",
              fontFamily: "'Rajdhani', sans-serif",
              textTransform: "uppercase",
              letterSpacing: "1px",
              boxShadow: "0 8px 30px rgba(0,212,255,0.3)",
            }}
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg" alt="F1" style={{ height: "20px" }} />
            Explorer les Grands Prix →
          </a>

      {/* Message de chargement */}
      {chargement && (
        <p style={{ textAlign: "center", color: "#8b9bb4", fontSize: "18px", padding: "40px" }}>
          Chargement des dernières actus...
        </p>
      )}

      {/* Message si vide */}
      {!chargement && articlesFiltres.length === 0 && (
        <p style={{ textAlign: "center", color: "#8b9bb4", fontSize: "18px", padding: "40px" }}>
          Aucune actu {competition.nom} pour le moment — reviens plus tard ! 🏁
        </p>
      )}

      {/* Grille d'articles */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "28px", padding: "20px 40px 60px", maxWidth: "1200px", margin: "0 auto" }}>
        {articlesFiltres.map((article, i) => (
          <a
            key={i}
            href={article.lien}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <div style={{ background: "#141b2e", borderRadius: "16px", overflow: "hidden", border: "1px solid #253150", height: "100%", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
              {article.image && (
                <div style={{ position: "relative" }}>
                  <img src={article.image} alt={article.titre} style={{ width: "100%", height: "190px", objectFit: "cover", display: "block" }} />
                  <span style={{ position: "absolute", top: "12px", left: "12px", background: "#e10600", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                    {article.source}
                  </span>
                </div>
              )}
              <div style={{ padding: "18px" }}>
                <h3 style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: "700", lineHeight: "1.3" }}>{article.titre}</h3>
                <p style={{ color: "#8b9bb4", fontSize: "15px", margin: "0 0 14px", lineHeight: "1.5" }}>{article.resume}</p>
                <span style={{ color: "#00d4ff", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Lire l'article →
                </span>
              </div>
            </div>
          </a>
        ))}
      </section>

      {/* Bas de page */}
      <footer style={{ borderTop: "1px solid #253150", padding: "24px 40px", color: "#5a6b8c", fontSize: "14px", textAlign: "center" }}>
        © 2026 Carstocars — Passion automobile
      </footer>

    </main>
  );
}
