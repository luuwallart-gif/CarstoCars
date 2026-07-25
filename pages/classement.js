import { useState, useEffect } from "react";

export default function Classement() {
  const [pilotes, setPilotes] = useState([]);
  const [ecuries, setEcuries] = useState([]);
  const [chargement, setChargement] = useState(true);

  // On va chercher les données dès que la page s'ouvre
  useEffect(() => {
    fetch("/api/classement-f1")
      .then((reponse) => reponse.json())
      .then((donnees) => {
        setPilotes(donnees.pilotes);
        setEcuries(donnees.ecuries);
        setChargement(false);
      });
  }, []);

  if (chargement) {
    return <p style={{ textAlign: "center", padding: "40px" }}>Chargement des classements... ⏳</p>;
  }

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>🏁 Classements F1 2026</h1>

      {/* CLASSEMENT PILOTES */}
      <h2>🏎️ Classement Pilotes</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "40px" }}>
        <thead>
          <tr style={{ background: "#e10600", color: "white" }}>
            <th style={{ padding: "10px" }}>Pos</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Pilote</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Écurie</th>
            <th style={{ padding: "10px" }}>Victoires</th>
            <th style={{ padding: "10px" }}>Points</th>
          </tr>
        </thead>
        <tbody>
          {pilotes.map((p) => (
            <tr key={p.Driver.driverId} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px", textAlign: "center" }}>{p.position}</td>
              <td style={{ padding: "10px" }}>{p.Driver.givenName} {p.Driver.familyName}</td>
              <td style={{ padding: "10px" }}>{p.Constructors[0].name}</td>
              <td style={{ padding: "10px", textAlign: "center" }}>{p.wins}</td>
              <td style={{ padding: "10px", textAlign: "center", fontWeight: "bold" }}>{p.points}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* CLASSEMENT ÉCURIES */}
      <h2>🏭 Classement Écuries</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#15151e", color: "white" }}>
            <th style={{ padding: "10px" }}>Pos</th>
            <th style={{ padding: "10px", textAlign: "left" }}>Écurie</th>
            <th style={{ padding: "10px" }}>Victoires</th>
            <th style={{ padding: "10px" }}>Points</th>
          </tr>
        </thead>
        <tbody>
          {ecuries.map((e) => (
            <tr key={e.Constructor.constructorId} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px", textAlign: "center" }}>{e.position}</td>
              <td style={{ padding: "10px" }}>{e.Constructor.name}</td>
              <td style={{ padding: "10px", textAlign: "center" }}>{e.wins}</td>
              <td style={{ padding: "10px", textAlign: "center", fontWeight: "bold" }}>{e.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
