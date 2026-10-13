import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import { MARQUES } from "../data/marques";

const PAYS = ["Toutes", ...new Set(MARQUES.map((m) => m.pays))];

export default function Auto() {
  const [pays, setPays] = useState("Toutes");
  const [q, setQ] = useState("");

  const liste = useMemo(
    () =>
      MARQUES.filter(
        (m) => (pays === "Toutes" || m.pays === pays) && m.nom.toLowerCase().includes(q.toLowerCase())
      ).sort((a, b) => a.nom.localeCompare(b.nom, "fr")),
    [pays, q]
  );

  return (
    <Layout
      actif="auto"
      eyebrow={`${MARQUES.length} constructeurs`}
      titre="Toutes les marques."
      accroche="Des sportives italiennes aux électriques chinoises : filtre par pays ou cherche ta marque."
    >
      <div className="wrap">
        <div className="bar">
          {PAYS.map((p) => (
            <button key={p} className={`chip${pays === p ? " on" : ""}`} onClick={() => setPays(p)}>{p}</button>
          ))}
          <input className="search" placeholder="Rechercher une marque" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        <p className="empty" style={{ padding: "0 0 20px" }}>{liste.length} marque{liste.length > 1 ? "s" : ""}</p>

        <motion.div layout className="marques">
          <AnimatePresence mode="popLayout">
            {liste.map((m) => (
              <motion.div
                layout
                key={m.nom}
                className="marque"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.25 }}
              >
                <div className="logo-tile"><img src={m.logo} alt={m.nom} loading="lazy" /></div>
                <b>{m.nom}</b>
                <span>{m.pays}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        {liste.length === 0 && <p className="empty">Aucune marque ne correspond.</p>}
      </div>
    </Layout>
  );
}
