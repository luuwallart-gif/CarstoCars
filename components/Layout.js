import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Seo from "./Seo";
import config from "../site.config";
import CompLogo from "./CompLogo";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

const LIENS = [
  { href: "/", label: "Accueil", id: "accueil" },
  { href: "/actus", label: "Analyses", id: "actus" },
  { href: "/auto", label: "Marques", id: "auto" },
  { href: "/sport", label: "Sport auto", id: "sport" },
  { href: "/courses", label: "Grands Prix", id: "courses" },
  { href: "/classement", label: "Classement", id: "classement" },
];

export function Reveal({ children, delay = 0, y = 40, className }) {
  const reduit = useReducedMotion();
  return (
    <div style={{ perspective: 1100, height: "100%" }}>
      <motion.div
        className={className}
        style={{ height: "100%", transformOrigin: "50% 100%" }}
        initial={reduit ? false : { opacity: 0, y, rotateX: 16, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Layout({ actif, titre, accroche, eyebrow, logo, seo, children }) {
  const { scrollYProgress } = useScroll();
  const echelle = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const [menu, setMenu] = useState(false);
  const { asPath } = useRouter();
  const chemin = seo?.chemin || asPath.split("?")[0].split("#")[0] || "/";

  useEffect(() => {
    const fermer = (e) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", fermer);
    return () => window.removeEventListener("keydown", fermer);
  }, []);


  return (
    <>
      <Seo titre={seo?.titre ?? titre} description={seo?.description ?? accroche} chemin={chemin} type={seo?.type} image={seo?.image} jsonLd={seo?.jsonLd} noindex={seo?.noindex} datePublication={seo?.datePublication} />
      <a href="#contenu" className="lien-evitement">Aller au contenu</a>
      <motion.div className="progress" style={{ scaleX: echelle }} />
      <header className="nav">
        <a href="/" className="logo">cars<b>to</b>cars</a>
        <button className={`burger${menu ? " ouvert" : ""}`} aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(!menu)}>
          <span /><span /><span />
        </button>
        <nav className={`nav-links${menu ? " ouvert" : ""}`}>
          {LIENS.map((l) => (
            <a key={l.id} href={l.href} className={actif === l.id ? "on" : ""}>{l.label}</a>
          ))}
        </nav>
      </header>
      <main id="contenu">
        {titre && (
          <section className="wrap hero">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {(eyebrow || logo) && (
                <p className="eyebrow" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {logo && <CompLogo id={logo} hauteur={26} />}
                  {eyebrow}
                </p>
              )}
              <h2>{titre}</h2>
              {accroche && <p>{accroche}</p>}
            </motion.div>
          </section>
        )}
        {children}
      </main>
      <footer className="foot">
        <div className="wrap pied">
          <div className="pied-marque">
            <a href="/" className="logo">cars<b>to</b>cars</a>
            <p>{config.description}</p>
          </div>
          <nav aria-label="Explorer">
            <h4>Explorer</h4>
            <a href="/actus">Analyses</a>
            <a href="/auto">Marques</a>
            <a href="/sport">Sport auto</a>
            <a href="/courses">Grands Prix</a>
            <a href="/classement">Classement F1</a>
          </nav>
          <nav aria-label="Le site">
            <h4>Le site</h4>
            <a href="/a-propos">À propos</a>
            <a href="/contact">Contact</a>
            <a href="/mentions-legales">Mentions légales</a>
            <a href="/confidentialite">Confidentialité</a>
            <a href="/flux.xml">Flux RSS</a>
          </nav>
        </div>
        <div className="wrap pied-bas">
          <span>© {new Date().getFullYear()} {config.nom}</span>
          <span>Logos et marques : propriété de leurs détenteurs, cités à titre d'information.</span>
        </div>
      </footer>
    </>
  );
}
