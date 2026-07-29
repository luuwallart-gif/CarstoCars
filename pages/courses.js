import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const CarteMonde = dynamic(() => import("../components/CarteMonde"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "550px", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b9bb4", background: "#141b2e", borderRadius: "16px", border: "1px solid #253150", fontSize: "18px" }}>
      Chargement de la carte...
    </div>
  ),
});

const DRAPEAUX = {
  Bahrain: "🇧🇭", "Saudi Arabia": "🇸🇦", Australia: "🇦🇺", Japan: "🇯🇵",
  China: "🇨🇳", USA: "🇺🇸", "United States": "🇺🇸", Italy: "🇮🇹",
  Monaco: "🇲🇨", Canada: "🇨🇦", Spain: "🇪🇸", Austria: "🇦🇹",
  UK: "🇬🇧", "United Kingdom": "🇬🇧", Hungary: "🇭🇺", Belgium: "🇧🇪",
  Netherlands: "🇳🇱", Azerbaijan: "🇦🇿", Singapore: "🇸🇬", Mexico: "🇲🇽",
  Brazil: "🇧🇷", Qatar: "🇶🇦", UAE: "🇦🇪", France: "🇫🇷",
  Russia: "🇷🇺", Turkey: "🇹🇷", Germany: "🇩🇪", Portugal: "🇵🇹",
  Malaysia: "🇲🇾", India: "🇮🇳", Korea: "🇰🇷", "South Korea": "🇰🇷",
  Argentina: "🇦🇷", Switzerland: "🇨🇭", Sweden: "🇸🇪", Morocco: "🇲🇦",
  "South Africa": "🇿🇦",
};

const COULEURS_ECURIES = {
  red_bull: "#3671C6", ferrari: "#E8002D", mercedes: "#27F4D2",
  mclaren: "#FF8000", aston_martin: "#229971", alpine: "#0093CC",
  williams: "#64C4FF", rb: "#6692FF", alphatauri: "#5E8FAA",
  sauber: "#52E252", alfa: "#C92D4B", haas: "#B6BABD",
  racing_point: "#F596C8", renault: "#FFF500", toro_rosso: "#469BFF",
  force_india: "#F596C8", lotus_f1: "#FFB800", manor: "#6E0000",
};

const ANNEE_MIN = 2015;
const ANNEE_MAX = 2026;
const SAISONS = Array.from({ length: ANNEE_MAX - ANNEE_MIN + 1 }, (_, i) => ANNEE_MAX - i);

export default function Courses() {
  const [saison, setSaison] = useState(2026);
  const [courses, setCourses] = useState([]);
  const [gpSelectionne, setGpSelectionne] = useState(null);
  const [resultats, setResultats] = useState([]);
  const [chargementCourses, setChargementCourses] = useState(true);
  const [chargementResultats, setChargementResultats] = useState(false);

  // Charge le calendrier de la saison
  useEffect(() => {
    setChargementCourses(true);
    setGpSelectionne(null);
    setResultats([]);
    fetch(`https://api.jolpi.ca/ergast/f1/${saison}/races/?limit=100`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data?.MRData?.RaceTable?.Races || []);
        setChargementCourses(false);
      })
      .catch(() => {
        setCourses([]);
        setChargementCourses(false);
      });
  }, [saison]);

  // Charge les résultats du GP sélectionné
  useEffect(() => {
    if (!gpSelectionne) return;
    setChargementResultats(true);
    setResultats([]);
    fetch(`https://api.jolpi.ca/ergast/f1/${saison}/${gpSelectionne.round}/results/?limit=100`)
      .then((res) => res.json())
      .then((data) => {
        setResultats(data?.MRData?.RaceTable?.Races?.[0]?.Results || []);
        setChargementResultats(false);
      })
      .catch(() => {
        setResultats([]);
        setChargementResultats(false);
      });
  }, [gpSelectionne, saison]);

  const loc = gpSelectionne?.Circuit?.Location;
  const drapeauGp = loc?.country ? (DRAPEAUX[loc.country] || "🏁") : "🏁";
  const estAVenir = gpSelectionne?.date ? new Date(gpSelectionne.date) > new Date() : false;

  return (
    <main style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #141b2e 100%)", color: "#fff", minHeight: "100vh", fontFamily: "'Rajdhani', sans-serif" }}>

      {/* Barre du haut */}
      <header style={{ padding: "20px 40px", background: "rgba(10,14,26,0.8)", borderBottom: "3px solid #00d4ff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", position: "sticky", top: 0, zIndex: 1000, backdropFilter: "blur(10px)" }}>
        <h1 style={{ fontFamily: "'Racing Sans One', cursive", background: "linear-gradient(90deg, #00d4ff, #e10600)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, fontSize: "32px", letterSpacing: "1px" }}>CARSTOCARS</h1>
        <nav style={{ fontSize: "18px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
          <a href="/" style={{ color: "#fff", marginRight: "24px", textDecoration: "none" }}>Accueil</a>
          <a href="/auto" style={{ color: "#fff", marginRight: "24px", textDecoration: "none" }}>Automobile</a>
          <a href="/sport" style={{ color: "#fff", marginRight: "24px", textDecoration: "none" }}>Sport Auto</a>
          <a href="/courses" style={{ color: "#00d4ff", textDecoration: "none" }}>Courses</a>
        </nav>
      </header>

      {/* Bandeau titre */}
      <section style={{ padding: "60px 40px 30px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Racing Sans One', cursive", fontSize: "48px", margin: "0 0 10px", textTransform: "uppercase" }}>
          Les <span style={{ color: "#e10600" }}>Grands Prix</span>
        </h2>
        <p style={{ color: "#8b9bb4", fontSize: "18px", margin: 0 }}>Clique sur un point de la carte pour voir les résultats de la course</p>
        <div style={{ width: "80px", height: "4px", background: "linear-gradient(90deg, #00d4ff, #e10600)", margin: "20px auto 0", borderRadius: "2px" }}></div>
      </section>

      {/* Sélecteur de saison */}
      <section style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", padding: "0 40px 40px", flexWrap: "wrap" }}>
        <span style={{ color: "#8b9bb4", fontSize: "18px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Saison</span>
        <select
          value={saison}
          onChange={(e) => setSaison(Number(e.target.value))}
          style={{
            padding: "12px 26px",
            borderRadius: "30px",
            border: "2px solid #00d4ff",
            background: "#141b2e",
            color: "#fff",
            fontSize: "20px",
            fontWeight: "700",
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: "1px",
            cursor: "pointer",
            outline: "none",
          }}
        >
          {SAISONS.map((an) => (
            <option key={an} value={an} style={{ background: "#141b2e" }}>{an}</option>
          ))}
        </select>
        <span style={{ color: "#5a6b8c", fontSize: "16px", fontWeight: "600" }}>
          {chargementCourses ? "..." : `${courses.length} Grands Prix`}
        </span>
      </section>

      {/* Carte du monde */}
      <section style={{ padding: "0 40px 40px", maxWidth: "1400px", margin: "0 auto" }}>
        {chargementCourses ? (
          <div style={{ height: "550px", display: "flex", alignItems: "center", justifyContent: "center", color: "#8b9bb4", background: "#141b2e", borderRadius: "16px", border: "1px solid #253150", fontSize: "18px" }}>
            Chargement du calendrier {saison}...
          </div>
        ) : (
          <CarteMonde
            courses={courses}
            gpSelect={gpSelectionne ? `${saison}-${gpSelectionne.round}` : null}
            saison={saison}
            onSelect={setGpSelectionne}
            drapeaux={DRAPEAUX}
          />
        )}
      </section>

      {/* Message si rien sélectionné */}
      {!gpSelectionne && !chargementCourses && (
        <p style={{ textAlign: "center", color: "#8b9bb4", fontSize: "18px", padding: "0 40px 60px" }}>
          Sélectionne un Grand Prix sur la carte pour afficher le classement 🏁
        </p>
      )}

      {/* Détail du GP sélectionné */}
      {gpSelectionne && (
        <section style={{ padding: "0 40px 60px", maxWidth: "1200px", margin: "0 auto" }}>

          {/* Entête du GP */}
          <div style={{ background: "#141b2e", borderRadius: "16px", border: "1px solid #253150", padding: "28px", marginBottom: "28px", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
              <div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                  <span style={{ display: "inline-block", background: "#e10600", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Manche {gpSelectionne.round} — {saison}
                  </span>
                  {estAVenir && (
                    <span style={{ display: "inline-block", background: "#253150", color: "#00d4ff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                      À venir
                    </span>
                  )}
                </div>
                <h3 style={{ fontFamily: "'Racing Sans One', cursive", fontSize: "34px", margin: "0 0 8px", lineHeight: "1.2" }}>
                  {drapeauGp} {gpSelectionne.raceName}
                </h3>
                <p style={{ color: "#8b9bb4", fontSize: "17px", margin: 0 }}>
                  {gpSelectionne.Circuit?.circuitName}
                  {loc?.locality && ` • ${loc.locality}`}
                  {loc?.country && `, ${loc.country}`}
                </p>
                {gpSelectionne.date && (
                  <p style={{ color: "#5a6b8c", fontSize: "15px", margin: "6px 0 0", fontWeight: "600" }}>
                    📅 {new Date(gpSelectionne.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    {gpSelectionne.time && ` — ${gpSelectionne.time.slice(0, 5)} UTC`}
                  </p>
                )}
              </div>

              <button
                onClick={() => setGpSelectionne(null)}
                style={{
                  padding: "10px 22px",
                  borderRadius: "30px",
                  border: "2px solid #253150",
                  background: "#0a0e1a",
                  color: "#8b9bb4",
                  fontSize: "15px",
                  fontWeight: "700",
                  fontFamily: "'Rajdhani', sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  cursor: "pointer",
                }}
              >
                ✕ Fermer
              </button>
            </div>

            {/* Liens circuit */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "22px" }}>
              {gpSelectionne.Circuit?.url && (
                <a
                  href={gpSelectionne.Circuit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "13px 26px",
                    borderRadius: "30px",
                    background: "linear-gradient(90deg, #00d4ff, #e10600)",
                    color: "#fff",
                    textDecoration: "none",
                    fontSize: "16px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    boxShadow: "0 8px 30px rgba(0,212,255,0.3)",
                  }}
                >
                  🏁 Voir le tracé du circuit →
                </a>
              )}
              {gpSelectionne.url && (
                <a
                  href={gpSelectionne.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "13px 26px",
                    borderRadius: "30px",
                    border: "2px solid #253150",
                    background: "#0a0e1a",
                    color: "#00d4ff",
                    textDecoration: "none",
                    fontSize: "16px",
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  📖 Résumé du Grand Prix →
                </a>
              )}
            </div>
          </div>

          {/* Podium */}
          {!chargementResultats && resultats.length >= 3 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "28px" }}>
              {resultats.slice(0, 3).map((r, i) => {
                const medailles = ["🥇", "🥈", "🥉"];
                const bordures = ["#FFD700", "#C0C0C0", "#CD7F32"];
                const couleur = COULEURS_ECURIES[r?.Constructor?.constructorId] || "#00d4ff";
                return (
                  <div key={i} style={{ background: "#141b2e", borderRadius: "16px", border: `2px solid ${bordures[i]}`, padding: "22px", textAlign: "center", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
                    <div style={{ fontSize: "38px", marginBottom: "10px" }}>{medailles[i]}</div>
                    <div style={{ fontSize: "22px", fontWeight: "700", marginBottom: "6px" }}>
                      <span style={{ color: "#8b9bb4", fontWeight: "600" }}>{r?.Driver?.givenName} </span>
                      {r?.Driver?.familyName}
                    </div>
                    <div style={{ color: couleur, fontSize: "15px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>
                      {r?.Constructor?.name || "—"}
                    </div>
                    <div style={{ color: "#5a6b8c", fontSize: "15px", fontWeight: "600" }}>
                      {r?.Time?.time || r?.status || "—"} • {r?.points ?? 0} pts
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tableau des résultats */}
          <div style={{ background: "#141b2e", borderRadius: "16px", border: "1px solid #253150", overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #253150" }}>
              <h4 style={{ fontFamily: "'Racing Sans One', cursive", fontSize: "24px", margin: 0, textTransform: "uppercase" }}>
                Classement de la course
              </h4>
            </div>

            {chargementResultats ? (
              <p style={{ textAlign: "center", color: "#8b9bb4", fontSize: "18px", padding: "50px" }}>
                Chargement des résultats...
              </p>
            ) : resultats.length === 0 ? (
              <p style={{ textAlign: "center", color: "#8b9bb4", fontSize: "18px", padding: "50px" }}>
                {estAVenir
                  ? "Ce Grand Prix n'a pas encore eu lieu — reviens après la course ! 🏁"
                  : "Résultats non disponibles pour ce Grand Prix 🏁"}
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "16px" }}>
                  <thead>
                    <tr style={{ background: "#0a0e1a" }}>
                      <th style={{ padding: "14px 16px", textAlign: "left", color: "#8b9bb4", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Pos</th>
                      <th style={{ padding: "14px 16px", textAlign: "left", color: "#8b9bb4", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Pilote</th>
                      <th style={{ padding: "14px 16px", textAlign: "left", color: "#8b9bb4", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Écurie</th>
                      <th style={{ padding: "14px 16px", textAlign: "left", color: "#8b9bb4", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Grille</th>
                      <th style={{ padding: "14px 16px", textAlign: "left", color: "#8b9bb4", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Temps / Statut</th>
                      <th style={{ padding: "14px 16px", textAlign: "center", color: "#8b9bb4", fontSize: "13px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resultats.map((r, i) => {
                      const couleur = COULEURS_ECURIES[r?.Constructor?.constructorId] || "#5a6b8c";
                      const pts = Number(r?.points) || 0;
                      return (
                        <tr key={i} style={{ borderTop: "1px solid #253150", background: i % 2 === 0 ? "transparent" : "rgba(10,14,26,0.4)" }}>
                          <td style={{ padding: "14px 16px", fontWeight: "700", fontSize: "18px", color: i < 3 ? "#00d4ff" : "#fff" }}>
                            {r?.position || "—"}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{ color: "#8b9bb4" }}>{r?.Driver?.givenName} </span>
                            <strong>{r?.Driver?.familyName}</strong>
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span style={{ display: "inline-block", width: "4px", height: "16px", background: couleur, marginRight: "10px", verticalAlign: "middle", borderRadius: "2px" }} />
                            <span style={{ color: "#bbc9dd" }}>{r?.Constructor?.name || "—"}</span>
                          </td>
                          <td style={{ padding: "14px 16px", color: "#5a6b8c", fontWeight: "600" }}>
                            {r?.grid || "—"}
                          </td>
                          <td style={{ padding: "14px 16px", color: "#8b9bb4", whiteSpace: "nowrap" }}>
                            {r?.Time?.time || r?.status || "—"}
                          </td>
                          <td style={{ padding: "14px 16px", textAlign: "center", fontWeight: pts > 0 ? "700" : "400", fontSize: "17px", color: pts > 0 ? "#fff" : "#3a4560" }}>
                            {pts}
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

      {/* Bas de page */}
      <footer style={{ borderTop: "1px solid #253150", padding: "24px 40px", color: "#5a6b8c", fontSize: "14px", textAlign: "center" }}>
        © 2026 Carstocars — Passion automobile · Données <a href="https://api.jolpi.ca" target="_blank" rel="noopener noreferrer" style={{ color: "#00d4ff", textDecoration: "none" }}>Jolpica F1 API</a>
      </footer>

    </main>
  );
}
