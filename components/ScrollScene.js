import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
const Voitures3D = dynamic(() => import("./Voitures3D"), { ssr: false });
import VoitureImage from "./VoitureImage";
const NOMS_VOITURES = ["Formule 1", "WRC", "GT3", "Hypercar WEC"];
const IDS_VOITURES = ["f1", "wrc", "gt3", "wec"];

const CHAPITRES = [
  { id: "actus", nom: "Actualités", kicker: "Le quotidien de l'auto", titre: "Tout ce qui roule.", texte: "Essais, nouveautés et infos des meilleures rédactions, au même endroit.", lien: "#actus", bouton: "Lire les actus" },
  { id: "marques", nom: "Marques", kicker: "94 constructeurs", titre: "Toutes les marques.", texte: "Des sportives italiennes aux électriques chinoises : logo, histoire et modèle phare.", lien: "/auto", bouton: "Explorer les marques" },
  { id: "sport", nom: "Sport auto", kicker: "9 compétitions", titre: "Chaque course compte.", texte: "F1, WRC, WEC, Formule E, MotoGP : suis ta discipline, actu après actu.", lien: "/sport", bouton: "Voir le sport auto" },
  { id: "gp", nom: "Grands Prix", kicker: "Formule 1", titre: "Le monde en circuits.", texte: "Une carte, un calendrier et le podium de chaque Grand Prix depuis 2015.", lien: "/courses", bouton: "Ouvrir la carte" },
];

function Chapitre({ i, n, progress, c }) {
  const debut = i / n, fin = (i + 1) / n, e = 0.03;
  const entree = i === 0 ? [0, 0] : [debut - e, debut + e];
  const sortie = i === n - 1 ? [1, 1] : [fin - e * 1.5, fin];
  const opacity = useTransform(progress, [entree[0], entree[1], sortie[0], sortie[1]], [i === 0 ? 1 : 0, 1, 1, i === n - 1 ? 1 : 0]);
  const y = useTransform(progress, [entree[0], entree[1], sortie[0], sortie[1]], [i === 0 ? 0 : 50, 0, 0, i === n - 1 ? 0 : -50]);
  const flou = useTransform(progress, [entree[0], entree[1], sortie[0], sortie[1]], [i === 0 ? 0 : 10, 0, 0, i === n - 1 ? 0 : 10]);
  const filter = useTransform(flou, (v) => `blur(${v}px)`);
  const numeroY = useTransform(progress, [debut, fin], [60, -60]);

  return (
    <motion.div className="chap" style={{ opacity, y, filter }}>
      <motion.span className="chap-num" style={{ y: numeroY }} aria-hidden="true">{String(i + 1).padStart(2, "0")}</motion.span>
      <p className="chap-kicker">{c.kicker}</p>
      <h2 className="chap-titre">{c.titre}</h2>
      <p className="chap-texte">{c.texte}</p>
      <a className="bouton-carre" href={c.lien}>{c.bouton}</a>
    </motion.div>
  );
}

export default function ScrollScene() {
  const ref = useRef(null);
  const n = CHAPITRES.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [actif, setActif] = useState(0);
  const [debut, setDebut] = useState(true);
  const [images, setImages] = useState({}); // id -> url de l'image, si elle existe

  // Cherche /voitures/<id>.png|webp|jpg : sinon on garde le modèle 3D
  useEffect(() => {
    let annule = false;
    IDS_VOITURES.forEach((id) => {
      const essayer = (exts) => {
        if (!exts.length) return;
        const url = `/voitures/${id}.${exts[0]}`;
        const im = new Image();
        im.onload = () => !annule && setImages((o) => ({ ...o, [id]: url }));
        im.onerror = () => essayer(exts.slice(1));
        im.src = url;
      };
      essayer(["png", "webp", "avif"]);
    });
    return () => { annule = true; };
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActif(Math.min(n - 1, Math.floor(p * n + 0.02)));
    setDebut(p < 0.04);
  });

  const aller = (i) => {
    const b = ref.current.getBoundingClientRect();
    const haut = window.scrollY + b.top;
    const scrollable = ref.current.offsetHeight - window.innerHeight;
    window.scrollTo({ top: haut + ((i + 0.5) / n) * scrollable, behavior: "smooth" });
  };

  const lueur = useTransform(scrollYProgress, [0, 1], ["30% 70%", "75% 30%"]);
  const fond = useTransform(lueur, (v) => `radial-gradient(ellipse 60% 55% at ${v}, rgba(255,90,31,.22), transparent 70%)`);

  return (
    <section ref={ref} className="scene" style={{ height: `${n * 100}vh` }}>
      <div className="scene-fixe">
        <motion.div className="scene-lueur" style={{ background: fond }} />
        {IDS_VOITURES.some((id) => !images[id]) && <Voitures3D progress={scrollYProgress} ignorer={IDS_VOITURES.filter((id) => images[id])} />}
        {IDS_VOITURES.map((id, i) => images[id] && (
          <VoitureImage key={id} i={i} n={n} progress={scrollYProgress} src={images[id]} nom={NOMS_VOITURES[i]} />
        ))}
        <div className="scene-grain" />

        <nav className="scene-nav" aria-label="Chapitres">
          {CHAPITRES.map((c, i) => (
            <button key={c.id} className={actif === i ? "on" : ""} onClick={() => aller(i)}>
              <i />
              <span>{c.nom}</span>
            </button>
          ))}
        </nav>

        <div className="scene-textes">
          {CHAPITRES.map((c, i) => (
            <Chapitre key={c.id} i={i} n={n} progress={scrollYProgress} c={c} />
          ))}
        </div>

        <div className="voiture-etiquette">
          <motion.b key={actif} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{NOMS_VOITURES[actif]}</motion.b>
          <span>{images[IDS_VOITURES[actif]] ? "Survole pour l'incliner" : "Glisse pour la faire tourner"}</span>
        </div>

        <motion.div className="defiler" animate={{ opacity: debut ? 1 : 0 }}>
          <span>Défiler</span>
          <motion.i animate={{ y: [0, 8, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
        </motion.div>

        <div className="scene-barre"><motion.i style={{ scaleX: scrollYProgress }} /></div>
      </div>
    </section>
  );
}
