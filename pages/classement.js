import { useState, useEffect } from "react";
import Layout from "../components/Layout";

export default function Classement() {
  const [pilotes, setPilotes] = useState([]);
  const [ecuries, setEcuries] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [vue, setVue] = useState("pilotes");

  useEffect(() => {
    fetch("/api/classement-f1")
      .then((r) => r.json())
      .then((d) => {
        setPilotes(d.pilotes || []);
        setEcuries(d.ecuries || []);
      })
      .catch(() => {})
      .finally(() => setChargement(false));
  }, []);

  const lignes = vue === "pilotes"
    ? pilotes.map((p) => ({ id: p.Driver.driverId, pos: p.position, nom: `${p.Driver.givenName} ${p.Driver.familyName}`, sous: p.Constructors[0]?.name, v: p.wins, pts: +p.points }))
    : ecuries.map((e) => ({ id: e.Constructor.constructorId, pos: e.position, nom: e.Constructor.name, sous: "", v: e.wins, pts: +e.points }));
  const max = Math.max(1, ...lignes.map((l) => l.pts));

  return (
    <Layout actif="classement" eyebrow="Formule 1 · 2026" titre="Le classement de la saison." accroche="Pilotes et écuries, mis à jour après chaque Grand Prix.">
      <div className="wrap">
        <div className="bar">
          <button className={`chip${vue === "pilotes" ? " on" : ""}`} onClick={() => setVue("pilotes")}>Pilotes</button>
          <button className={`chip${vue === "ecuries" ? " on" : ""}`} onClick={() => setVue("ecuries")}>Écuries</button>
        </div>

        {chargement && <div className="skeleton" />}

        {!chargement && (
          <>
            <div className="podium" key={vue + "p"}>
              {lignes.slice(0, 3).map((l) => (
                <div key={l.id}>
                  <small>P{l.pos}{l.sous ? ` · ${l.sous}` : ""}</small>
                  <strong>{l.nom}</strong>
                  <em>{l.pts}</em> <small>pts</small>
                </div>
              ))}
            </div>
            <div className="panel">
              <table className="table" key={vue}>
                <thead>
                  <tr>
                    <th>Pos</th><th>{vue === "pilotes" ? "Pilote" : "Écurie"}</th>
                    <th className="num">Victoires</th><th className="num">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {lignes.map((l) => (
                    <tr key={l.id}>
                      <td className="pos">{l.pos}</td>
                      <td>
                        {l.nom}{l.sous && <span style={{ color: "var(--muted)" }}> · {l.sous}</span>}
                        <div className="bar-pts"><i style={{ width: `${(l.pts / max) * 100}%` }} /></div>
                      </td>
                      <td className="num">{l.v}</td>
                      <td className="num"><b>{l.pts}</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
