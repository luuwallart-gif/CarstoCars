import { useState, useEffect } from "react";

const drapeaux = {
  Australia: "🇦🇺", China: "🇨🇳", Japan: "🇯🇵", Bahrain: "🇧🇭",
  "Saudi Arabia": "🇸🇦", USA: "🇺🇸", Italy: "🇮🇹", Monaco: "🇲🇨",
  Spain: "🇪🇸", Canada: "🇨🇦", Austria: "🇦🇹", UK: "🇬🇧",
  Hungary: "🇭🇺", Belgium: "🇧🇪", Netherlands: "🇳🇱", Azerbaijan: "🇦🇿",
  Singapore: "🇸🇬", Mexico: "🇲🇽", Brazil: "🇧🇷", Qatar: "🇶🇦",
  UAE: "🇦🇪", France: "🇫🇷", Germany: "🇩🇪", Portugal: "🇵🇹",
  Russia: "🇷🇺", Turkey: "🇹🇷", Malaysia: "🇲🇾",
};

// Conversion lat/long → position sur la carte
const projection = (lat, long) => ({
  x: ((parseFloat(long) + 180) / 360) * 100,
  y: ((84 - parseFloat(lat)) / 140) * 100,
});

export default function Courses() {
  const [saison, setSaison] = useState("2026");
  const [courses, setCourses] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [gpSelect, setGpSelect] = useState(null);
  const [resultats, setResultats] = useState({});
  const [chargementGp, setChargementGp] = useState(false);
  const [survol, setSurvol] = useState(null);

  const saisons = [];
  for (let a = 2026; a >= 2015; a--) saisons.push(String(a));

  useEffect(() => {
    setChargement(true);
    setGpSelect(null);
    setResultats({});
    fetch(`https://api.jolpi.ca/ergast/f1/${saison}/races/?format=json&limit=30`)
      .then((r) => r.json())
      .then((data) => {
        setCourses(data?.MRData?.RaceTable?.Races || []);
        setChargement(false);
      })
      .catch(() => setChargement(false));
  }, [saison]);

  const choisirGp = (course) => {
    const round = course.round;
    if (gpSelect?.round === round) {
      setGpSelect(null);
      return;
    }
    setGpSelect(course);
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

  const aujourdhui = new Date();

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Rajdhani', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0.5; }
        }
        .point-gp {
          cursor: pointer;
          transition: all 0.2s;
        }
        .point-gp:hover {
          transform: scale(1.8);
        }
      `}</style>

      {/* HEADER */}
      <header style={{ padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
        <a href="/" style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "26px", fontWeight: "900", color: "#fff", textDecoration: "none" }}>
          CARSTO<span style={{ color: "#00d4ff" }}>CARS</span>
        </a>
        <nav style={{ display: "flex", gap: "20px" }}>
          <a href="/" style={{ color: "#aaa", textDecoration: "none" }}>Accueil</a>
          <a href="/sport" style={{ color: "#aaa", textDecoration: "none" }}>Sport</a>
          <a href="/classement" style={{ color: "#aaa", textDecoration: "none" }}>Classement</a>
          <a href="/courses" style={{ color: "#00d4ff", textDecoration: "none", fontWeight: "700" }}>Courses</a>
        </nav>
      </header>

      {/* TITRE */}
      <section style={{ padding: "40px 40px 20px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "36px", margin: "0 0 10px", letterSpacing: "2px" }}>
          CARTE DES <span style={{ color: "#00d4ff" }}>GRANDS PRIX</span>
        </h1>
        <p style={{ color: "#888", fontSize: "17px", margin: 0 }}>
          Clique sur un circuit pour voir les résultats
        </p>
      </section>

      {/* SÉLECTEUR SAISON */}
      <section style={{ padding: "0 40px 30px", display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
        {saisons.map((a) => (
          <button
            key={a}
            onClick={() => setSaison(a)}
            style={{
              padding: "8px 16px",
              background: saison === a ? "#00d4ff" : "rgba(255,255,255,0.05)",
              color: saison === a ? "#000" : "#aaa",
              border: saison === a ? "none" : "1px solid rgba(255,255,255,0.15)",
              borderRadius: "20px",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            {a}
          </button>
        ))}
      </section>

      {chargement ? (
        <p style={{ textAlign: "center", color: "#888", padding: "60px" }}>Chargement du calendrier {saison}...</p>
      ) : (
        <>
          {/* CARTE DU MONDE */}
          <section style={{ padding: "0 20px 40px", maxWidth: "1300px", margin: "0 auto" }}>
            <div style={{
              position: "relative",
              width: "100%",
              paddingBottom: "50%",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              overflow: "hidden",
            }}>
              {/* Fond planisphère */}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg"
                alt="Carte du monde"
                style={{
                  position: "absolute",
                  top: 0, left: 0,
                  width: "100%", height: "100%",
                  objectFit: "fill",
                  opacity: 0.9,
                }}
              />

              {/* Points des circuits */}
              {courses.map((c) => {
                const pos = projection(c.Circuit.Location.lat, c.Circuit.Location.long);
                const passee = new Date(c.date) < aujourdhui;
                const actif = gpSelect?.round === c.round;
                return (
                  <div
                    key={c.round}
                    className="point-gp"
                    onClick={() => choisirGp(c)}
                    onMouseEnter={() => setSurvol(c.round)}
                    onMouseLeave={() => setSurvol(null)}
                    style={{
                      position: "absolute",
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: "translate(-50%, -50%)",
                      width: actif ? "18px" : "13px",
                      height: actif ? "18px" : "13px",
                      borderRadius: "50%",
                      background: actif ? "#fff" : passee ? "#00d4ff" : "#666",
                      border: actif ? "3px solid #00d4ff" : "2px solid rgba(0,0,0,0.5)",
                      boxShadow: actif ? "0 0 20px #00d4ff" : passee ? "0 0 10px rgba(0,212,255,0.6)" : "none",
                      animation: passee && !actif ? "pulse 2.5s infinite" : "none",
                      zIndex: actif ? 10 : 5,
                    }}
                  />
                );
              })}

              {/* Infobulle au survol */}
              {survol && (() => {
                const c = courses.find((x) => x.round === survol);
                if (!c) return null;
                const pos = projection(c.Circuit.Location.lat, c.Circuit.Location.long);
                return (
                  <div style={{
                    position: "absolute",
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: pos.y > 60 ? "translate(-50%, -140%)" : "translate(-50%, 40%)",
                    background: "rgba(0,0,0,0.95)",
                    border: "1px solid #00d4ff",
                    borderRadius: "8px",
                    padding: "8px 14px",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    zIndex: 20,
                  }}>
                    <div style={{ fontWeight: "700", fontSize: "14px" }}>
                      {drapeaux[c.Circuit.Location.country] || "🏁"} {c.raceName}
                    </div>
                    <div style={{ color: "#888", fontSize: "12px" }}>
                      Manche {c.round} • {new Date(c.date).toLocaleDateString("fr-FR")}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Légende */}
            <div style={{ display: "flex", gap: "25px", justifyContent: "center", marginTop: "18px", flexWrap: "wrap", fontSize: "14px", color: "#888" }}>
              <span><span style={{ display: "inline-block", width: "11px", height: "11px", borderRadius: "50%", background: "#00d4ff", marginRight: "7px" }} />Course disputée</span>
              <span><span style={{ display: "inline-block", width: "11px", height: "11px", borderRadius: "50%", background: "#666", marginRight: "7px" }} />À venir</span>
              <span>{courses.length} Grands Prix en {saison}</span>
            </div>
          </section>

          {/* RÉSULTATS DU GP SÉLECTIONNÉ */}
          {gpSelect && (
            <section style={{ padding: "0 40px 60px", maxWidth: "1000px", margin: "0 auto" }}>
              <div style={{               background: "#0d1b2a", border: "1px solid rgba(0,212,255,0.3)", borderRadius: "12px", overflow: "hidden" }}>
                {/* En-tête du GP */}
                <div style={{ padding: "22px 25px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <div style={{ fontSize: "13px", color: "#00d4ff", fontWeight: "700", letterSpacing: "1px" }}>
                      MANCHE {gpSelect.round} • {saison}
                    </div>
                    <h2 style={{ fontFamily: "'Orbitron', sans-serif", fontSize: "23px", margin: "6px 0 4px" }}>
                      {drapeaux[gpSelect.Circuit.Location.country] || "🏁"} {gpSelect.raceName}
                    </h2>
                    <div style={{ color: "#888", fontSize: "14px" }}>
                      {gpSelect.Circuit.circuitName} • {gpSelect.Circuit.Location.locality}
                    </div>
                  </div>
                  <button
                    onClick={() => setGpSelect(null)}
                    style={{ padding: "8px 16px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px", color: "#aaa", cursor: "pointer", fontFamily: "'Rajdhani', sans-serif", fontSize: "14px" }}
                  >
                    ✕ Fermer
                  </button>
                </div>

                {/* Tableau des résultats */}
                <div style={{ padding: "20px 25px 25px" }}>
                  {chargementGp ? (
                    <p style={{ color: "#888", textAlign: "center", padding: "30px" }}>Chargement des résultats...</p>
                  ) : !resultats[gpSelect.round] || resultats[gpSelect.round].length === 0 ? (
                    <p style={{ color: "#888", textAlign: "center", padding: "30px" }}>
                      ⏳ Course pas encore disputée — résultats indisponibles
                    </p>
                  ) : (
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}>
                        <thead>
                          <tr style={{ borderBottom: "2px solid rgba(0,212,255,0.3)", color: "#00d4ff", fontSize: "13px", letterSpacing: "1px" }}>
                            <th style={{ padding: "10px 8px", textAlign: "left", width: "50px" }}>POS</th>
                            <th style={{ padding: "10px 8px", textAlign: "left" }}>PILOTE</th>
                            <th style={{ padding: "10px 8px", textAlign: "left" }}>ÉCURIE</th>
                            <th style={{ padding: "10px 8px", textAlign: "left" }}>TEMPS / ÉCART</th>
                            <th style={{ padding: "10px 8px", textAlign: "right", width: "60px" }}>PTS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resultats[gpSelect.round].map((r) => (
                            <tr key={r.position} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                              <td style={{
                                padding: "12px 8px",
                                fontWeight: "900",
                                fontFamily: "'Orbitron', sans-serif",
                                color: r.position === "1" ? "#FFD700" : r.position === "2" ? "#C0C0C0" : r.position === "3" ? "#CD7F32" : "#fff",
                              }}>
                                {r.position}
                              </td>
                              <td style={{ padding: "12px 8px", fontWeight: "600" }}>
                                {r.Driver.givenName} {r.Driver.familyName}
                              </td>
                              <td style={{ padding: "12px 8px", color: "#aaa" }}>{r.Constructor.name}</td>
                              <td style={{ padding: "12px 8px", color: "#00d4ff", fontFamily: "monospace", fontSize: "14px" }}>
                                {r.Time ? r.Time.time : r.status}
                              </td>
                              <td style={{ padding: "12px 8px", textAlign: "right", fontWeight: "700" }}>{r.points}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </>
      )}

      {/* FOOTER */}
      <footer style={{ padding: "30px 40px", borderTop: "1px solid rgba(255,255,255,0.1)", textAlign: "center", color: "#666", fontSize: "14px" }}>
        © 2026 Carstocars • Données fournies par l'API Jolpica
      </footer>
    </div>
  );
}
