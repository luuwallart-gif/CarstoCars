import Head from "next/head";
import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

const LIENS = [
  { href: "/", label: "Actualités", id: "accueil" },
  { href: "/auto", label: "Marques", id: "auto" },
  { href: "/sport", label: "Sport auto", id: "sport" },
  { href: "/courses", label: "Grands Prix", id: "courses" },
  { href: "/classement", label: "Classement", id: "classement" },
];

export function Reveal({ children, delay = 0, y = 24, className }) {
  const reduit = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={{ height: "100%" }}
      initial={reduit ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function Layout({ actif, titre, accroche, eyebrow, children }) {
  const { scrollYProgress } = useScroll();
  const echelle = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });


  return (
    <>
      <Head>
        <title>{titre ? `${titre} — Carstocars` : "Carstocars"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0c0c0d" />
      </Head>
      <motion.div className="progress" style={{ scaleX: echelle }} />
      <header className="nav">
        <a href="/" className="logo">cars<b>to</b>cars</a>
        <nav className="nav-links">
          {LIENS.map((l) => (
            <a key={l.id} href={l.href} className={actif === l.id ? "on" : ""}>{l.label}</a>
          ))}
        </nav>
      </header>
      <main>
        {titre && (
          <section className="wrap hero">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              <h2>{titre}</h2>
              {accroche && <p>{accroche}</p>}
            </motion.div>
          </section>
        )}
        {children}
      </main>
      <footer className="foot">
        <div className="wrap">
          <span>© 2026 Carstocars</span>
          <span>Passion automobile</span>
        </div>
      </footer>
    </>
  );
}
