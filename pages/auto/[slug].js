import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout, { Reveal } from "../../components/Layout";
import Visuel from "../../components/Visuel";
import { MARQUES } from "../../data/marques";
import { PHARES } from "../../data/modeles";
import { resume, galerie } from "../../lib/wiki";

export function getStaticPaths() {
  return { paths: MARQUES.map((m) => ({ params: { slug: m.slug } })), fallback: false };
}

export function getStaticProps({ params }) {
  const liste = [...MARQUES].sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  const i = liste.findIndex((m) => m.slug === params.slug);
  return {
    props: {
      marque: liste[i],
      precedente: liste[(i - 1 + liste.length) % liste.length],
      suivante: liste[(i + 1) % liste.length],
      memePays: MARQUES.filter((m) => m.pays === liste[i].pays && m.slug !== params.slug).slice(0, 6),
    },
  };
}

export default function PageMarque({ marque, precedente, suivante, memePays }) {
  const info = PHARES[marque.nom] || [];
  const [fiche, setFiche] = useState(undefined);
  const [phare, setPhare] = useState(undefined);
  const [photos, setPhotos] = useState([]);
  const [actif, setActif] = useState(null);
  const [lu, setLu] = useState(false);

  useEffect(() => {
    let annule = false;
    setFiche(undefined); setPhare(undefined); setPhotos([]); setActif(null); setLu(false);
    resume(info[2] || marque.nom).then((r) => !annule && setFiche(r));
    resume(info[1]).then((r) => {
      if (annule) return;
      setPhare(r);
      galerie(info[1], r?.langue || "fr").then((g) => !annule && setPhotos(g));
    });
    return () => { annule = true; };
  }, [marque.slug]);

  const texte = fiche?.texte || `${marque.nom} est un constructeur automobile (${marque.pays}).`;
  const long = texte.length > 420;
  const principale = actif || phare?.img;

  return (
    <Layout actif="auto">
      <div className="wrap" style={{ paddingTop: 36 }}>
        <a href="/auto" className="retour">← Toutes les marques</a>

        <motion.header className="marque-tete" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="logo-tile grand"><img src={marque.logo} alt={marque.nom} /></div>
          <div>
            <p className="eyebrow" style={{ margin: "0 0 8px" }}>{marque.pays}</p>
            <h2 className="marque-titre">{marque.nom}</h2>
          </div>
        </motion.header>

        <div className="marque-intro">
          {fiche === undefined ? (
            <div className="skeleton" style={{ height: 110 }} />
          ) : (
            <>
              <p className="resume" style={!lu && long ? { display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden" } : {}}>{texte}</p>
              <div className="bar" style={{ marginBottom: 0 }}>
                {long && <button className="chip" onClick={() => setLu(!lu)}>{lu ? "Réduire" : "Lire la suite"}</button>}
                {fiche?.lien && <a className="chip" href={fiche.lien} target="_blank" rel="noopener noreferrer">Wikipédia ↗</a>}
              </div>
            </>
          )}
        </div>

        <Reveal>
          <section className="phare">
            <div>
              {phare === undefined ? (
                <div className="visuel"><div className="skeleton" style={{ position: "absolute", inset: 0, borderRadius: 0 }} /></div>
              ) : (
                <Visuel key={principale || "logo"} src={principale} secours={phare?.mini} alt={`${marque.nom} ${info[0] || ""}`} logo={marque.logo} />
              )}
              {photos.length > 1 && (
                <div className="vignettes">
                  {photos.map((p) => (
                    <button key={p} className={principale === p ? "on" : ""} onClick={() => setActif(p)} onError={(e) => (e.currentTarget.style.display = "none")}>
                      <img src={p} alt="" loading="lazy" referrerPolicy="no-referrer" onError={(e) => (e.currentTarget.parentNode.style.display = "none")} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <p className="eyebrow" style={{ margin: "0 0 8px" }}>Modèle phare</p>
              <h3 className="phare-nom">{marque.nom} {info[0]}</h3>
              <p className="resume">{phare?.texte ? phare.texte.slice(0, 520) + (phare.texte.length > 520 ? "…" : "") : phare === undefined ? "" : "Aucune présentation disponible pour ce modèle."}</p>
              {phare?.lien && <a className="btn ghost" href={phare.lien} target="_blank" rel="noopener noreferrer">En savoir plus ↗</a>}
            </div>
          </section>
        </Reveal>

        {memePays.length > 0 && (
          <section style={{ marginTop: 56 }}>
            <p className="eyebrow">Autres marques · {marque.pays}</p>
            <div className="marques">
              {memePays.map((m, i) => (
                <Reveal key={m.slug} delay={i * 0.05}>
                  <a href={`/auto/${m.slug}`} className="marque" style={{ display: "block" }}>
                    <div className="logo-tile"><img src={m.logo} alt={m.nom} loading="lazy" /></div>
                    <b>{m.nom}</b><span>{m.pays}</span>
                  </a>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        <div className="bar" style={{ marginTop: 48, justifyContent: "space-between" }}>
          <a className="chip" href={`/auto/${precedente.slug}`}>← {precedente.nom}</a>
          <a className="chip" href={`/auto/${suivante.slug}`}>{suivante.nom} →</a>
        </div>
      </div>
    </Layout>
  );
}
