import { useState, useEffect } from "react";

// Drapeaux par pays
const drapeaux = {
  Australia: "🇦🇺", China: "🇨🇳", Japan: "🇯🇵", Bahrain: "🇧🇭",
  "Saudi Arabia": "🇸🇦", USA: "🇺🇸", Italy: "🇮🇹", Monaco: "🇲🇨",
  Spain: "🇪🇸", Canada: "🇨🇦", Austria: "🇦🇹", UK: "🇬🇧",
  Hungary: "🇭🇺", Belgium: "🇧🇪", Netherlands: "🇳🇱", Azerbaijan: "🇦🇿",
  Singapore: "🇸🇬", Mexico: "🇲🇽", Brazil: "🇧🇷", Qatar: "🇶🇦",
  UAE: "🇦🇪", France: "🇫🇷", Germany: "🇩🇪", Portugal: "🇵🇹",
  Russia: "🇷🇺", Turkey: "🇹🇷", Malaysia: "🇲🇾",
};

export default function Courses() {
  const [saison, setSaison] = useState("2026");
  const [courses, setCourses] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [gpOuvert, setGpOuvert] = useState(null);
  const [resultats, setResultats] = useState({});
  const [chargementGp, setChargementGp] = useState(false);

  // Liste des saisons 2026 → 2015
  const saisons = [];
  for (let a = 2026; a >= 2015; a--) saisons.push(String(a));

  // Charger le calendrier de la saison
  useEffect(() => {
    setChargement(true);
    setGpOuvert(null);
    setResultats({});
    fetch(`https://api.jolpi.ca/ergast/f1/${saison}/races/?format=json&limit=30`)
      .then((r) => r.json())
      .then((data) => {
        setCourses(data?.MRData?.RaceTable?.Races || []);
        setChargement(false);
      })
      .catch(() => setChargement(false));
  }, [saison]);

  // Charger les résultats d'un GP au clic
  const ouvrirGp = (round) => {
    if (gpOuvert === round) {
      setGpOuvert(null);
      return;
    }
    setGpOuvert(round);
    if (resultats[round]) return;

    setChargementGp(true);
    fetch(`https://api.jolpi.ca/ergast/f1/${saison}/${round}/results/?format=json&limit=30`)
      .then((r) => r.json())
      .then((data) => {
        const res = data?.MRData?.RaceTable?.Races?.[0]?.Results || [];
        setResultats((prev) => ({ ...prev, [round]: res }));
        setChargementGp(false);
      })
      .catch(() => setChargementGp(false));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Rajdhani', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <header style={{ padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "24px", fontWeight: "900", color: "#fff", textDecoration: "none" }}>
          CARSTO<span style={{ color: "#00d4ff" }}>CARS</span>
        </a>
        <nav style={{ display: "flex", gap: "25px" }}>
          <a href="/" style={{ color: "#888", textDecoration: "none", fontWeight: "600" }}>Accueil</a>
          <a href="/sport" style={{ color: "#888", textDecoration: "none", fontWeight: "600" }}>Sport</a>
          <a href="/classement" style={{ color: "#888", textDecoration: "none", fontWeight: "600" }}>Classement</a>
          <a href="/courses" style={{ color: "#00d4ff", textDecoration: "none", fontWeight: "600" }}>Courses</a>
        </nav>
      </header>

      {/* TITRE */}
      <section style={{ padding: "50px 40px 30px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "12px" }}>
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/33/F1.svg" alt="F1" style={{ height: "34px" }} />
          <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "38px", fontWeight: "900", margin: 0 }}>
            RÉSULTATS DES GRANDS PRIX
          </h1>
        </div>
        <p style={{ color: "#888", fontSize: "17px" }}>Clique sur un Grand Prix pour voir le classement complet</p>
      </section>

      {/* SÉLECTEUR DE SAISON */}
      <section style={{ padding: "0 40px 30px", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
        {saisons.map((a) => (
          <button
            key={a}
            onClick={() => setSaison(a)}
            style={{
              padding: "10px 20px",
              borderRadius: "30px",
              border: saison === a ? "none" : "1px solid rgba(255,255,255,0.2)",
              background: saison === a ? "linear-gradient(90deg, #00d4ff, #e10600)" : "transparent",
              color: saison === a ? "#fff" : "#888",
              fontSize: "15px",
              fontWeight: "700",
              fontFamily: "'Rajdhani', sans-serif",
              cursor: "pointer",
            }}
          >
            {a}
          </button>
        ))}
      </section>

      {/* CHARGEMENT */}
      {chargement && (
        <p style={{ textAlign: "center", color: "#888", padding: "40px" }}>Chargement du calendrier {saison}...</p>
      )}

      {/* CARTES DES GRANDS PRIX */}
      {!chargement && (
        <section style={{ padding: "0 40px 60px", maxWidth: "1000px", margin: "0 auto" }}>
          {courses.map((c) => {
            const ouvert = gpOuvert === c.round;
            const res = resultats[c.round];
            const dateGp = new Date(c.date);
            const passee = dateGp < new Date();

            return (
              <div
                key={c.round}
                style={{
                  marginBottom: "14px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.03)",
                  border: ouvert ? "1px solid rgba(0,212,255,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  overflow: "hidden",
                }}
              >
                {/* En-tête de la carte */}
                <div
                  onClick={() => ouvrirGp(c.round)}
                  style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: "18px", cursor: "pointer" }}
                >
                  <span style={{ fontSize: "34px" }}>{drapeaux[c.Circuit.Location.country] || "🏁"}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "13px", color: "#00d4ff", fontWeight: "700", letterSpacing: "1px" }}>
                      MANCHE {c.round}
                    </div>
                    <div style={{ fontSize: "20px", fontWeight: "700" }}>{c.raceName}</div>
                    <div style={{ fontSize: "14px", color: "#888" }}>
                      {c.Circuit.circuitName} • {dateGp.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  </div>
                  {!passee && (
                    <span style={{ padding: "6px 14px", borderRadius: "20px", background: "rgba(255,255,255,0.08)", fontSize: "13px", color: "#888", fontWeight: "600" }}>
                      À VENIR
                    </span>
                  )}
                  <span style={{ fontSize: "20px", color: "#00d4ff", transform: ouvert ? "rotate(180deg)" : "none", transition: "0.3s" }}>▾</span>
                </div>

                {/* Résultats dépliés */}
                {ouvert && (
                  <div style={{ padding: "0 24px 24px" }}>
                    {chargementGp && !res && <p style={{ color: "#888" }}>Chargement des résultats...</p>}
                    {res && res.length === 0 && <p style={{ color: "#888" }}>Aucun résultat disponible pour cette course.</p>}
                    {res && res.length > 0 && (
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.15)" }}>
                            <th style={{ textAlign: "left", padding: "10px 8px", color: "#888", fontSize: "13px" }}>POS</th>
                            <th style={{ textAlign: "left", padding: "10px 8px", color: "#888", fontSize: "13px" }}>PILOTE</th>
                            <th style={{ textAlign: "left", padding: "10px 8px", color: "#888", fontSize: "13px" }}>ÉCURIE</th>
                            <th style={{ textAlign: "left", padding: "10px 8px", color: "#888", fontSize: "13px" }}>TEMPS / ÉCART</th>
                            <th style={{ textAlign: "right", padding: "10px 8px", color: "#888", fontSize: "13px" }}>PTS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {res.map((r) => (
                            <tr key={r.position} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                              <td style={{ padding: "12px 8px", fontWeight: "700", color: r.position === "1" ? "#FFD700" : r.position === "2" ? "#C0C0C0" : r.position === "3" ? "#CD7F32" : "#fff" }}>
                                {r.position}
                              </td>
                              <td style={{ padding: "12px 8px", fontWeight: "600" }}>
                                {r.Driver.givenName} {r.Driver.familyName}
                              </td>
                              <td style={{ padding: "12px 8px", color: "#aaa" }}>{r.Constructor.name}</td>
                              <td style={{ padding: "12px 8px", color: "#00d4ff", fontFamily: "monospace" }}>
                                {r.Time ? r.Time.time : r.status}
                              </td>
                              <td style={{ padding: "12px 8px", textAlign: "right", fontWeight: "700" }}>{r.points}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ padding: "30px 40px", borderTop: "1px solid rgba(255,255,255,0.1)", textAlign: "center", color: "#666", fontSize: "14px" }}>
        © 2026 Carstocars • Données fournies par l'API Jolpica
      </footer>
    </div>
  );
}
