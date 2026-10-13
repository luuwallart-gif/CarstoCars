import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { PHARES } from "../data/modeles";

const cache = {};

async function resume(titre) {
  if (!titre) return null;
  if (cache[titre] !== undefined) return cache[titre];
  for (const langue of ["fr", "en"]) {
    try {
      const r = await fetch(`https://${langue}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titre.replace(/ /g, "_"))}`);
      if (!r.ok) continue;
      const d = await r.json();
      if (d.type === "disambiguation") continue;
      let img = d.thumbnail?.source || null;
      if (img) img = img.replace(/\/\d+px-/, "/1000px-");
      return (cache[titre] = { texte: d.extract || "", img, lien: d.content_urls?.desktop?.page });
    } catch (e) {}
  }
  return (cache[titre] = null);
}

function Visuel({ src, alt, logo }) {
  const [zoom, setZoom] = useState(false);
  const [charge, setCharge] = useState(false);
  const rx = useSpring(useMotionValue(0), { stiffness: 140, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 140, damping: 16 });
  const px = useSpring(useMotionValue(50), { stiffness: 120, damping: 20 });
  const py = useSpring(useMotionValue(50), { stiffness: 120, damping: 20 });

  const origine = useTransform([px, py], ([x, y]) => `${x}% ${y}%`);
  useEffect(() => { setCharge(false); setZoom(false); }, [src]);

  const bouger = (e) => {
    const b = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
    ry.set((x - 0.5) * 16); rx.set(-(y - 0.5) * 12);
    px.set(x * 100); py.set(y * 100);
  };
  const quitter = () => { rx.set(0); ry.set(0); px.set(50); py.set(50); };

  if (!src) {
    return (
      <div className="visuel vide"><img src={logo} alt={alt} style={{ width: "45%" }} /></div>
    );
  }
  return (
    <div className="visuel" onMouseMove={bouger} onMouseLeave={quitter} onClick={() => setZoom(!zoom)} style={{ perspective: 1000, cursor: zoom ? "zoom-out" : "zoom-in" }}>
      {!charge && <div className="skeleton" style={{ position: "absolute", inset: 0, borderRadius: 0 }} />}
      <motion.img
        src={src}
        alt={alt}
        onLoad={() => setCharge(true)}
        style={{
          rotateX: rx, rotateY: ry,
          transformOrigin: zoom ? origine : "50% 50%",
          opacity: charge ? 1 : 0,
        }}
        animate={{ scale: zoom ? 2 : 1 }}
        transition={{ duration: 0.4 }}
        draggable={false}
      />
      <span className="aide">{zoom ? "Bouge la souris pour explorer" : "Clique pour zoomer · survole pour incliner"}</span>
    </div>
  );
}

export default function FicheMarque({ marque, onFermer, onPrecedent, onSuivant }) {
  const [phare, setPhare] = useState(undefined);
  const [fiche, setFiche] = useState(undefined);
  const [lu, setLu] = useState(false);
  const info = PHARES[marque.nom];

  useEffect(() => {
    let annule = false;
    setPhare(undefined); setFiche(undefined); setLu(false);
    resume(info?.[1]).then((r) => !annule && setPhare(r));
    resume(info?.[2] || marque.nom).then((r) => !annule && setFiche(r));
    return () => { annule = true; };
  }, [marque.nom]);

  useEffect(() => {
    const t = (e) => {
      if (e.key === "Escape") onFermer();
      if (e.key === "ArrowRight") onSuivant();
      if (e.key === "ArrowLeft") onPrecedent();
    };
    window.addEventListener("keydown", t);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", t); document.body.style.overflow = ""; };
  }, [onFermer, onSuivant, onPrecedent]);

  const texte = fiche?.texte || `${marque.nom} est un constructeur automobile (${marque.pays}).`;
  const long = texte.length > 360;

  return (
    <motion.div className="fond-fiche" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onFermer}>
      <motion.div
        className="fiche"
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="x" onClick={onFermer} aria-label="Fermer">✕</button>
        <div className="fiche-grille">
          <div>
            {phare === undefined ? (
              <div className="visuel"><div className="skeleton" style={{ position: "absolute", inset: 0, borderRadius: 0 }} /></div>
            ) : (
              <Visuel key={marque.nom} src={phare?.img} alt={`${marque.nom} ${info?.[0] || ""}`} logo={marque.logo} />
            )}
            <p className="legende">Modèle phare · <b>{marque.nom} {info?.[0]}</b></p>
          </div>

          <div className="fiche-texte">
            <div className="logo-tile petit"><img src={marque.logo} alt="" /></div>
            <p className="eyebrow" style={{ margin: "16px 0 6px" }}>{marque.pays}</p>
            <h3>{marque.nom}</h3>
            {fiche === undefined ? (
              <div className="skeleton" style={{ height: 120 }} />
            ) : (
              <>
                <p className="resume" style={!lu && long ? { WebkitLineClamp: 6, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden" } : {}}>{texte}</p>
                {long && <button className="chip" onClick={() => setLu(!lu)}>{lu ? "Réduire" : "Lire la suite"}</button>}{" "}
                {fiche?.lien && <a className="chip" href={fiche.lien} target="_blank" rel="noopener noreferrer">Wikipédia ↗</a>}
              </>
            )}
            <div className="nav-fiche">
              <button className="chip" onClick={onPrecedent}>← Précédente</button>
              <button className="chip" onClick={onSuivant}>Suivante →</button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
