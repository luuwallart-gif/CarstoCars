import { useState } from "react";
import Layout, { Reveal } from "../components/Layout";

const marques = [
  { nom: "Ferrari", pays: "Italie", logo: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800" },
  { nom: "Porsche", pays: "Allemagne", logo: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800" },
  { nom: "Mercedes", pays: "Allemagne", logo: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800" },
  { nom: "BMW", pays: "Allemagne", logo: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800" },
  { nom: "Bugatti", pays: "France", logo: "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?w=800" },
  { nom: "Lamborghini", pays: "Italie", logo: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800" },
];
const pays = ["Tous", ...new Set(marques.map((m) => m.pays))];

export default function Auto() {
  const [filtre, setFiltre] = useState("Tous");
  const liste = marques.filter((m) => filtre === "Tous" || m.pays === filtre);

  return (
    <Layout actif="auto" eyebrow="Constructeurs" titre="Les marques qui font rêver." accroche="Passe d'un pays à l'autre et explore les constructeurs mythiques.">
      <div className="wrap">
        <div className="bar">
          {pays.map((p) => (
            <button key={p} className={`chip${filtre === p ? " on" : ""}`} onClick={() => setFiltre(p)}>{p}</button>
          ))}
        </div>
        <div className="grid">
          {liste.map((m, i) => (
            <Reveal key={m.nom} delay={i * 0.05}>
              <div className="brand">
                <img src={m.logo} alt={m.nom} loading="lazy" />
                <div className="meta"><h3>{m.nom}</h3><span>{m.pays}</span></div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Layout>
  );
}
