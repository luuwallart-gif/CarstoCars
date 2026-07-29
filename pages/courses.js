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

// Projection équirectangulaire standard (-180/+180, -90/+90)
const projection = (lat, long) => ({
  x: ((parseFloat(long) + 180) / 360) * 100,
  y: ((90 - parseFloat(lat)) / 180) * 100,
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
    fetch(`https://api.jolpi.ca/ergast/f1/${saison}/races/?format=json`)
      .then((r) => r.json())
      .then((data) => {
        setCourses(data?.MRData?.RaceTable?.Races || []);
        setChargement(false);
      })
      .catch(() => setChargement(false));
  }, [saison]);

  const chargerResultat = (course) => {
    const cle = `${saison}-${course.round}`;
    if (gpSelect === cle) {
      setGpSelect(null);
      return;
    }
    setGpSelect(cle);
    if (resultats[cle]) return;
    setChargementGp(true);
    fetch(`https://api.jolpi.ca/ergast/f1/${saison}/${course.round}/results/?format=json`)
      .then((r) => r.json())
      .then((data) => {
        const res = data?.MRData?.RaceTable?.Races?.[0]?.Results || [];
        setResultats((prev) => ({ ...prev, [cle]: res }));
        setChargementGp(false);
      })
      .catch(() => setChargementGp(false));
  };

  const aujourdhui = new Date();
  const courseSelectionnee = courses.find(
    (c) => `${saison}-${c.round}` === gpSelect
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      
      {/* HEADER */}
      <header style={{ padding: "20px 40px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: "30px" }}>
        <a href="/" style={{ color: "#fff", textDecoration: "none", fontSize: "22px", fontWeight: "700", letterSpacing: "-0.5px" }}>
          Carstocars
        </a>
        <nav style={{ display: "flex", gap: "24px" }}>
          <a href="/auto" style={{ color: "#888", textDecoration: "none", fontSize: "15px" }}>Auto</a>
          <a href="/sport" style={{ color: "#888", textDecoration: "none", fontSize: "15px" }}>Sport</a>
          <a href="/classement" style={{ color: "#888", textDecoration: "none", fontSize: "15px" }}>Classement</a>
          <a href="/courses" style={{ color: "#00d4ff", textDecoration: "none", fontSize: "15px", fontWeight: "600" }}>Courses</a>
        </nav>
      </header>

      {/* TITRE */}
      <section style={{ padding: "50px 40px 30px", textAlign: "center" }}>
        <h1 style={{ fontSize: "42px", fontWeight: "800", margin: "0 0 12px", letterSpacing: "-1px" }}>
          Calendrier & Résultats F1
        </h1>
        <p style={{ color: "#888", fontSize: "17px", margin: 0 }}>
          Clique sur un point de la carte pour voir les résultats du Grand Prix
        </p>
      </section>

      {/* SÉLECTEUR DE SAISON */}
      <section style={{ padding: "0 40px 30px", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
        {saisons.map((a) => (
          <button
            key={a}
            onClick={() => setSaison(a)}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: saison === a ? "1px solid #00d4ff" : "1px solid rgba(255,255,255,0.15)",
              background: saison === a ? "rgba(0,212,255,0.15)" : "transparent",
              color: saison === a ? "#00d4ff" : "#aaa",
              fontSize: "15px",
              fontWeight: saison === a ? "700" : "500",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {a}
          </button>
        ))}
      </section>

      {chargement ? (
        <div style={{ textAlign: "center", padding: "80px", color: "#666", fontSize: "17px" }}>
          Chargement du calendrier…
        </div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px", color: "#666", fontSize: "17px" }}>
          Aucune course disponible pour cette saison.
        </div>
      ) : (
        <>
          {/* CARTE DU MONDE */}
          <section style={{ padding: "0 40px 40px" }}>
            <div
              style={{
                maxWidth: "1200px",
                margin: "0 auto",
                position: "relative",
                width: "100%",
                aspectRatio: "2 / 1",
                background: "#0d1b2a",
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {/* Fond planisphère */}
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/World_map_-_low_resolution.svg/2000px-World_map_-_low_resolution.svg.png"
                alt="Carte du monde"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "fill",
                }}
              />

              {/* Points des Grands Prix */}
              {courses.map((c) => {
                const lat = c.Circuit?.Location?.lat;
                const long = c.Circuit?.Location?.long;
                if (!lat || !long) return null;

                const pos = projection(lat, long);
                const cle = `${saison}-${c.round}`;
                const passee = new Date(c.date) < aujourdhui;
                const actif = gpSelect === cle;

                return (
                  <div
                    key={cle}
                    onClick={() => chargerResultat(c)}
                    onMouseEnter={() => setSurvol(cle)}
                    onMouseLeave={() => setSurvol(null)}
                    style={{
                      position: "absolute",
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: "translate(-50%, -50%)",
                      cursor: "pointer",
                      zIndex: actif || survol === cle ? 20 : 10,
                    }}
                  >
                    {/* Halo pulsant */}
                    {passee && (
                      <span
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          background: "rgba(0,212,255,0.35)",
                          animation: "pulse 2s infinite",
                        }}
                      />
                    )}

                    {/* Point */}
                    <span
                      style={{
                        display: "block",
                        position: "relative",
                        width: actif ? "16px" : "11px",
                        height: actif ? "16px" : "11px",
                        borderRadius: "50%",
                        background: actif ? "#fff" : passee ? "#00d4ff" : "#888",
                        border: actif ? "3px solid #00d4ff" : "2px solid rgba(255,255,255,0.9)",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
                        transition: "all 0.2s",
                      }}
                    />

                    {/* Infobulle */}
                    {survol === cle && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: "24px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "rgba(10,10,10,0.96)",
                          border: "1px solid rgba(0,212,255,0.5)",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          whiteSpace: "nowrap",
                          fontSize: "13px",
                          pointerEvents: "none",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.8)",
                        }}
                      >
                        <div style={{ fontWeight: "700", marginBottom: "2px" }}>
                          {drapeaux[c.Circuit?.Location?.country] || "🏁"} {c.raceName}
                        </div>
                        <div style={{ color: "#888", fontSize: "12px" }}>
                          {new Date(c.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Légende */}
            <div style={{ maxWidth: "1200px", margin: "16px auto 0", display: "flex", justifyContent: "center", gap: "28px", flexWrap: "wrap", fontSize: "14px", color: "#888" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#00d4ff", border: "2px solid #fff", display: "inline-block" }} />
                Course disputée
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ width: "11px", height: "11px", borderRadius: "50%", background: "#888", border: "2px solid #fff", display: "inline-block" }} />
                À venir
              </span>
            </div>
          </section>

          {/* RÉSULTATS */}
          {gpSelect && courseSelectionnee && (
            <section style={{ padding: "0 40px 60px" }}>
              <div
                style={{
                  maxWidth: "1000px",
                  margin: "0 auto",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(0,212,255,0.3)",
                  borderRadius: "16px",
                  overflow: "hidden",
                }}
              >
                {/* En-tête */}
                <div style={{ padding: "24px 28px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
                  <div>
                    <h2 style={{ margin: "0 0 6px", fontSize: "24px", fontWeight: "700" }}>
                      {drapeaux[courseSelectionnee.Circuit?.Location?.country] || "🏁"} {courseSelectionnee.raceName}
                    </h2>
                    <p style={{ margin: 0, color: "#888", fontSize: "15px" }}>
                      {courseSelectionnee.Circuit?.circuitName} • {courseSelectionnee.Circuit?.Location?.locality}
                      {" • "}
                      {new Date(courseSelectionnee.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <button
                    onClick={() => setGpSelect(null)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "transparent",
                      color: "#aaa",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    ✕ Fermer
                  </button>
                </div>

                {/* Tableau */}
                {chargementGp ? (
                  <div style={{ padding: "50px", textAlign: "center", color: "#666" }}>
                    Chargement des résultats…
                  </div>
                ) : !resultats[gpSelect] || resultats[gpSelect].length === 0 ? (
                  <div style={{ padding: "50px", textAlign: "center", color: "#666" }}>
                    Course pas encore disputée — résultats indisponibles.
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "15px" }}>
                      <thead>
                        <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                          <th style={{ padding: "14px 18px", textAlign: "left", color: "#888", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Pos</th>
                          <th style={{ padding: "14px 18px", textAlign: "left", color: "#888", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Pilote</th>
                          <th style={{ padding: "14px 18px", textAlign: "left", color: "#888", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Écurie</th>
                          <th style={{ padding: "14px 18px", textAlign: "left", color: "#888", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Temps / Écart</th>
                          <th style={{ padding: "14px 18px", textAlign: "right", color: "#888", fontWeight: "600", fontSize: "13px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultats[gpSelect].map((r) => {
                          const podium = parseInt(r.position) <= 3;
                          return (
                            <tr key={r.position} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                              <td style={{ padding: "14px 18px", fontWeight: "700", color: podium ? "#00d4ff" : "#fff", fontSize: "16px" }}>
                                {r.position}
                              </td>
                              <td style={{ padding: "14px 18px", fontWeight: "600" }}>
                                {r.Driver?.givenName} {r.Driver?.familyName}
                              </td>
                              <td style={{ padding: "14px 18px", color: "#aaa" }}>
                                {r.Constructor?.name}
                              </td>
                              <td style={{ padding: "14px 18px", color: "#aaa", fontFamily: "monospace", fontSize: "14px" }}>
                                {r.Time?.time || r.status}
                              </td>
                              <td style={{ padding: "14px 18px", textAlign: "right", fontWeight: "700", color: parseInt(r.points) > 0 ? "#00d4ff" : "#555" }}>
                                {r.points}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}

      {/* FOOTER */}
      <footer style={{ padding: "30px 40px", borderTop: "1px solid rgba(255,255,255,0.1)", textAlign: "center", color: "#666", fontSize: "14px" }}>
        © 2026 Carstocars • Données fournies par l'API Jolpica
      </footer>

      {/* Animation */}
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
          70% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
