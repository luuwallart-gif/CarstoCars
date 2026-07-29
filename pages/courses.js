import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Leaflet ne fonctionne que côté navigateur → import dynamique obligatoire
const CarteMonde = dynamic(() => import("../components/CarteMonde"), {
  ssr: false,
  loading: () => (
    <div style={{
      height: "500px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#111",
      borderRadius: "16px",
      color: "#666",
    }}>
      Chargement de la carte… 🗺️
    </div>
  ),
});

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
  const [gpSelect, setGpSelect] = useState(null);
  const [resultats, setResultats] = useState({});
  const [chargementGp, setChargementGp] = useState(false);

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
      <header style={{ padding: "24px 40px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <a href="/" style={{ color: "#fff", textDecoration: "none", fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px" }}>
          CARSTO<span style={{ color: "#00d4ff" }}>CARS</span>
        </a>
        <nav style={{ display: "flex", gap: "28px" }}>
          <a href="/" style={{ color: "#aaa", textDecoration: "none", fontSize: "15px" }}>Accueil</a>
          <a href="/courses" style={{ color: "#00d4ff", textDecoration: "none", fontSize: "15px", fontWeight: "600" }}>Courses</a>
        </nav>
      </header>

      {/* TITRE + SÉLECTEUR */}
      <section style={{ padding: "50px 40px 30px", textAlign: "center" }}>
        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: "900", margin: "0 0 12px", letterSpacing: "-1.5px" }}>
          Calendrier <span style={{ color: "#00d4ff" }}>F1</span>
        </h1>
        <p style={{ color: "#888", fontSize: "17px", margin: "0 0 32px" }}>
          Clique sur un circuit de la carte pour voir les résultats
        </p>

        <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.05)", padding: "10px 18px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
          <span style={{ color: "#888", fontSize: "14px" }}>Saison</span>
          <select
            value={saison}
            onChange={(e) => setSaison(e.target.value)}
            style={{ background: "#1a1a1a", color: "#fff", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px", padding: "8px 14px", fontSize: "16px", fontWeight: "700", cursor: "pointer", outline: "none" }}
          >
            {saisons.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </section>

      {chargement ? (
        <div style={{ textAlign: "center", padding: "80px", color: "#666" }}>
          Chargement du calendrier… ⏳
        </div>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px", color: "#666" }}>
          Aucune course disponible pour {saison} 🤷
        </div>
      ) : (
        <>
          {/* CARTE LEAFLET */}
          <section style={{ padding: "0 40px 40px", maxWidth: "1400px", margin: "0 auto" }}>
            <CarteMonde
              courses={courses}
              gpSelect={gpSelect}
              saison={saison}
              onSelect={chargerResultat}
              drapeaux={drapeaux}
            />
          </section>

          {/* LISTE DES GP */}
          <section style={{ padding: "0 40px 50px", maxWidth: "1400px", margin: "0 auto" }}>
            <h2 style={{ fontSize: "20px", marginBottom: "20px", color: "#888", fontWeight: "600" }}>
              {courses.length} Grands Prix
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
              {courses.map((c) => {
                const cle = `${saison}-${c.round}`;
                const actif = gpSelect === cle;
                const passe = new Date(c.date) < aujourdhui;
                return (
                  <div
                    key={cle}
                    onClick={() => chargerResultat(c)}
                    style={{
                      background: actif ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.04)",
                      border: actif ? "1px solid #00d4ff" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "12px",
                      padding: "16px 18px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      opacity: passe ? 1 : 0.6,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                      <span style={{ fontSize: "22px" }}>
                        {drapeaux[c.Circuit?.Location?.country] || "🏁"}
                      </span>
                      <span style={{ fontSize: "12px", color: "#00d4ff", fontWeight: "700", background: "rgba(0,212,255,0.1)", padding: "2px 8px", borderRadius: "5px" }}>
                        R{c.round}
                      </span>
                      {!passe && (
                        <span style={{ fontSize: "11px", color: "#888", marginLeft: "auto" }}>
                          à venir
                        </span>
                      )}
                    </div>
                    <div style={{ fontWeight: "700", fontSize: "15px", marginBottom: "4px" }}>
                      {c.raceName}
                    </div>
                    <div style={{ color: "#777", fontSize: "13px" }}>
                      {c.Circuit?.Location?.locality} • {new Date(c.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* RÉSULTATS */}
          {gpSelect && courseSelectionnee && (
            <section style={{ padding: "0 40px 60px", maxWidth: "1100px", margin: "0 auto" }}>
              <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", overflow: "hidden" }}>

                <div style={{ padding: "24px 28px", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", gap: "14px" }}>
                  <span style={{ fontSize: "32px" }}>
                    {drapeaux[courseSelectionnee.Circuit?.Location?.country] || "🏁"}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: "22px", fontWeight: "800" }}>
                      {courseSelectionnee.raceName}
                    </h3>
                    <p style={{ margin: "4px 0 0", color: "#888", fontSize: "14px" }}>
                      {courseSelectionnee.Circuit?.circuitName} • {new Date(courseSelectionnee.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <button
                    onClick={() => setGpSelect(null)}
                    style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#aaa", width: "34px", height: "34px", borderRadius: "8px", cursor: "pointer", fontSize: "18px" }}
                  >
                    ✕
                  </button>
                </div>

                {chargementGp ? (
                  <div style={{ padding: "50px", textAlign: "center", color: "#666" }}>
                    Chargement des résultats… ⏳
                  </div>
                ) : !resultats[gpSelect] || resultats[gpSelect].length === 0 ? (
                  <div style={{ padding: "50px", textAlign: "center", color: "#666" }}>
                    Course pas encore disputée 🏁
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ background: "rgba(0,0,0,0.3)" }}>
                          <th style={{ padding: "12px 18px", textAlign: "left", color: "#888", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Pos</th>
                          <th style={{ padding: "12px 18px", textAlign: "left", color: "#888", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Pilote</th>
                          <th style={{ padding: "12px 18px", textAlign: "left", color: "#888", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Écurie</th>
                          <th style={{ padding: "12px 18px", textAlign: "left", color: "#888", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Temps</th>
                          <th style={{ padding: "12px 18px", textAlign: "right", color: "#888", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultats[gpSelect].map((r) => {
                          const pos = parseInt(r.position);
                          const medaille = pos === 1 ? "🥇" : pos === 2 ? "🥈" : pos === 3 ? "🥉" : null;
                          return (
                            <tr key={r.position} style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: pos <= 3 ? "rgba(0,212,255,0.04)" : "transparent" }}>
                              <td style={{ padding: "14px 18px", fontWeight: "800", fontSize: "16px" }}>
                                {medaille || r.position}
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
    </div>
  );
}
