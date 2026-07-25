import { useState, useEffect } from "react";

export default function Classement() {
  const [pilotes, setPilotes] = useState([]);
  const [ecuries, setEcuries] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch("/api/classement-f1")
      .then((res) => res.json())
      .then((data) => {
        setPilotes(data.pilotes || []);
        setEcuries(data.ecuries || []);
        setChargement(false);
      })
      .catch(() => setChargement(false));
  }, []);

  return (
    <main style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #141b2e 100%)", color: "#fff", minHeight: "100vh", fontFamily: "'Rajdhani', sans-serif" }}>

      {/* Barre du haut */}
      <header style={{ padding: "20px 40px", background: "rgba(10,14,26,0.8)", borderBottom: "3px solid #00d4ff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(10px)" }}>
        <h1 style={{ fontFamily: "'Racing Sans One', cursive", background: "linear-gradient(90deg, #00d4ff, #e10600)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, fontSize: "32px", letterSpacing: "1px" }}>CARSTOCARS</h1>
        <nav style={{ fontSize: "18px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
          <a href="/" style={{ color: "#fff", marginRight: "24px", textDecoration: "none" }}>Accueil</a>
          <a href="/auto" style={{ color: "#fff", marginRight: "24px", textDecoration: "none" }}>Automobile</a>
          <a href="/sport" style={{ color: "#fff", textDecoration: "none" }}>Sport Auto</a>
        </nav>
      </header>

      {/* Bandeau titre */}
      <section style={{ padding: "60px 40px 30px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Racing Sans One', cursive", fontSize: "48px", margin: "0 0 10px", textTransform: "uppercase" }}>
          Classement <span style={{ color: "#e10600" }}>F1</span> 2026
        </h2>
        <p style={{ color: "#8b9bb4", fontSize: "18px", margin: 0 }}>Le classement officiel des pilotes et des écuries</p>
        <div style={{ width: "80px", height: "4px", background: "linear-gradient(90deg, #00d4ff, #e10600)", margin: "20px auto 0", borderRadius: "2px" }}></div>
      </section>

      {chargement && (
        <p style={{ textAlign: "center", color: "#8b9bb4", fontSize: "18px", padding: "40px" }}>
          Chargement des classements... 🏁
        </p>
      )}

      {!chargement && (
        <section style={{ maxWidth: "900px", margin: "0 auto", padding: "0 40px 60px" }}>

          {/* TABLEAU PILOTES */}
          <h3 style={{ fontFamily: "'Racing Sans One', cursive", fontSize: "28px", margin: "0 0 20px", textTransform: "uppercase" }}>
            🏎️ Pilotes
          </h3>
          <div style={{ background: "#141b2e", borderRadius: "16px", overflow: "hidden", border: "1px solid #253150", marginBottom: "50px", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "linear-gradient(90deg, #00d4ff, #e10600)", textTransform: "uppercase", letterSpacing: "1px" }}>
                  <th style={{ padding: "14px" }}>Pos</th>
                  <th style={{ padding: "14px", textAlign: "left" }}>Pilote</th>
                  <th style={{ padding: "14px" }}>Écurie</th>
                  <th style={{ padding: "14px" }}>Victoires</th>
                  <th style={{ padding: "14px" }}>Points</th>
                </tr>
              </thead>
              <tbody>
                {pilotes.map((p) => (
                  <tr key={p.Driver.driverId} style={{ borderBottom: "1px solid #253150" }}>
                    <td style={{ padding: "14px", textAlign: "center", fontWeight: "700", color: "#00d4ff" }}>{p.position}</td>
                    <td style={{ padding: "14px" }}>{p.Driver.givenName} {p.Driver.familyName}</td>
                    <td style={{ padding: "14px", textAlign: "center", color: "#8b9bb4" }}>{p.Constructors[0].name}</td>
                    <td style={{ padding: "14px", textAlign: "center" }}>{p.wins}</td>
                    <td style={{ padding: "14px", textAlign: "center", fontWeight: "700" }}>{p.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TABLEAU ÉCURIES */}
          <h3 style={{ fontFamily: "'Racing Sans One', cursive", fontSize: "28px", margin: "0 0 20px", textTransform: "uppercase" }}>
            🏆 Écuries
          </h3>
          <div style={{ background: "#141b2e", borderRadius: "16px", overflow: "hidden", border: "1px solid #253150", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "linear-gradient(90deg, #00d4ff, #e10600)", textTransform: "uppercase", letterSpacing: "1px" }}>
                  <th style={{ padding: "14px" }}>Pos</th>
                  <th style={{ padding: "14px", textAlign: "left" }}>Écurie</th>
                  <th style={{ padding: "14px" }}>Victoires</th>
                  <th style={{ padding: "14px" }}>Points</th>
                </tr>
              </thead>
              <tbody>
                {ecuries.map((e) => (
                  <tr key={e.Constructor.constructorId} style={{ borderBottom: "1px solid #253150" }}>
                    <td style={{ padding: "14px", textAlign: "center", fontWeight: "700", color: "#00d4ff" }}>{e.position}</td>
                    <td style={{ padding: "14px" }}>{e.Constructor.name}</td>
                    <td style={{ padding: "14px", textAlign: "center" }}>{e.wins}</td>
                    <td style={{ padding: "14px", textAlign: "center", fontWeight: "700" }}>{e.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </section>
      )}

      {/* Bas de page */}
      <footer style={{ borderTop: "1px solid #253150", padding: "24px 40px", color: "#5a6b8c", fontSize: "14px", textAlign: "center" }}>
        © 2026 Carstocars — Passion automobile
      </footer>

    </main>
  );
}
