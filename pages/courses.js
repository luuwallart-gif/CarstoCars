import { useState, useEffect, useRef, useMemo } from "react";
import Layout from "../components/Layout";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

const CarteMonde = dynamic(() => import("../components/CarteMonde"), {
  ssr: false,
  loading: () => (
    <div className="h-[550px] flex items-center justify-center text-cc-grey bg-cc-card rounded-2xl border border-cc-border text-lg">
      Chargement de la carte...
    </div>
  ),
});

const DRAPEAUX = {
  Bahrain: "🇧🇭", "Saudi Arabia": "🇸🇦", Australia: "🇦🇺", Japan: "🇯🇵",
  China: "🇨🇳", USA: "🇺🇸", "United States": "🇺🇸", Italy: "🇮🇹",
  Monaco: "🇲🇨", Canada: "🇨🇦", Spain: "🇪🇸", Austria: "🇦🇹",
  UK: "🇬🇧", "United Kingdom": "🇬🇧", Hungary: "🇭🇺", Belgium: "🇧🇪",
  Netherlands: "🇳🇱", Azerbaijan: "🇦🇿", Singapore: "🇸🇬", Mexico: "🇲🇽",
  Brazil: "🇧🇷", Qatar: "🇶🇦", UAE: "🇦🇪", France: "🇫🇷",
  Russia: "🇷🇺", Turkey: "🇹🇷", Germany: "🇩🇪", Portugal: "🇵🇹",
  Malaysia: "🇲🇾", India: "🇮🇳", Korea: "🇰🇷", "South Korea": "🇰🇷",
  Argentina: "🇦🇷", Switzerland: "🇨🇭", Sweden: "🇸🇪", Morocco: "🇲🇦",
  "South Africa": "🇿🇦",
};

const COULEURS_ECURIES = {
  red_bull: "#3671C6", ferrari: "#E8002D", mercedes: "#27F4D2",
  mclaren: "#FF8000", aston_martin: "#229971", alpine: "#0093CC",
  williams: "#64C4FF", rb: "#6692FF", alphatauri: "#5E8FAA",
  sauber: "#52E252", alfa: "#C92D4B", haas: "#B6BABD",
  racing_point: "#F596C8", renault: "#FFF500", toro_rosso: "#469BFF",
  force_india: "#F596C8", lotus_f1: "#FFB800", manor: "#6E0000",
};

const ANNEE_MIN = 2015;
const ANNEE_MAX = 2026;
const SAISONS = Array.from({ length: ANNEE_MAX - ANNEE_MIN + 1 }, (_, i) => ANNEE_MAX - i);

const TH = "px-4 py-3.5 text-left text-cc-grey text-[13px] font-bold uppercase tracking-wider";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const tableRowVariant = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

/* ============================================================
   TROPHÉE SVG TYPE F1 (forme moderne, dégradé métallique)
   ============================================================ */
const METAUX = {
  or:     { clair: "#FFF6C2", mid: "#FFD700", sombre: "#B8860B", glow: "#FFD700" },
  argent: { clair: "#FFFFFF", mid: "#D8D8DC", sombre: "#8A8A92", glow: "#C0C0C0" },
  bronze: { clair: "#F0C9A0", mid: "#CD7F32", sombre: "#7A4A1D", glow: "#CD7F32" },
};

function TropheeF1({ type = "or", taille = 90, id = "t" }) {
  const m = METAUX[type];
  const gid = `grad-${type}-${id}`;
  const sid = `shine-${type}-${id}`;
  return (
    <svg width={taille} height={taille * 1.35} viewBox="0 0 100 135" fill="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={m.clair} />
          <stop offset="35%" stopColor={m.mid} />
          <stop offset="70%" stopColor={m.sombre} />
          <stop offset="100%" stopColor={m.mid} />
        </linearGradient>
        <linearGradient id={sid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`clip-${id}`}>
          <path d="M28 12 H72 L68 58 Q64 78 50 80 Q36 78 32 58 Z" />
        </clipPath>
      </defs>

      {/* anses stylisées F1 */}
      <path d="M28 20 Q10 24 12 40 Q14 54 30 52" stroke={`url(#${gid})`} strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M72 20 Q90 24 88 40 Q86 54 70 52" stroke={`url(#${gid})`} strokeWidth="5" strokeLinecap="round" fill="none" />

      {/* coupe */}
      <path d="M28 12 H72 L68 58 Q64 78 50 80 Q36 78 32 58 Z" fill={`url(#${gid})`} />

      {/* reflet animé */}
      <g clipPath={`url(#clip-${id})`}>
        <motion.rect
          x="-40" y="0" width="26" height="90"
          fill={`url(#${sid})`}
          transform="skewX(-18)"
          animate={{ x: [-40, 110] }}
          transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
        />
      </g>

      {/* liseré haut */}
      <rect x="26" y="10" width="48" height="6" rx="3" fill={m.clair} opacity="0.9" />

      {/* tige */}
      <rect x="45" y="80" width="10" height="18" fill={`url(#${gid})`} />

      {/* socle */}
      <path d="M30 98 H70 L76 112 H24 Z" fill={`url(#${gid})`} />
      <rect x="20" y="112" width="60" height="10" rx="3" fill={m.sombre} />
      <rect x="20" y="112" width="60" height="4" rx="2" fill={m.mid} />
    </svg>
  );
}

/* ============================================================
   PHOTO PILOTE : Wikipedia -> fallback initiales
   ============================================================ */
const cachePhotos = {};

function usePhotoPilote(driver) {
  const [src, setSrc] = useState(null);
  const url = driver?.url;

  useEffect(() => {
    if (!url) return;
    const titre = decodeURIComponent(url.split("/wiki/")[1] || "");
    if (!titre) return;
    if (cachePhotos[titre] !== undefined) {
      setSrc(cachePhotos[titre]);
      return;
    }

    let annule = false;

    fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titre)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        let img = d?.thumbnail?.source || null;
        if (img) {
          cachePhotos[titre] = img;
          if (!annule) setSrc(img);
          return;
        }
        return fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titre)}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d2) => {
            const img2 = d2?.thumbnail?.source || null;
            cachePhotos[titre] = img2;
            if (!annule) setSrc(img2);
          });
      })
      .catch(() => {
        cachePhotos[titre] = null;
      });

    return () => {
      annule = true;
    };
  }, [url]);

  return src;
}

function AvatarPilote({ driver, couleur, taille = 88 }) {
  const photo = usePhotoPilote(driver);
  const initiales = `${driver?.givenName?.[0] || ""}${driver?.familyName?.[0] || ""}`.toUpperCase();
  return (
    <div
      className="rounded-full overflow-hidden flex items-center justify-center font-racing shrink-0"
      style={{
        width: taille, height: taille,
        border: `3px solid ${couleur}`,
        background: photo ? "#0b1220" : `linear-gradient(135deg, ${couleur}33, ${couleur}0d)`,
        
        fontSize: taille * 0.34,
        color: couleur,
      }}
    >
      {photo ? (
        <img src={photo} alt={driver?.familyName} className="w-full h-full object-cover" />
      ) : (
        initiales
      )}
    </div>
  );
}

/* Nom de pilote avec tooltip photo au survol (tableau) */
function NomPiloteHover({ driver, couleur }) {
  const [ouvert, setOuvert] = useState(false);
  return (
    <span
      className="relative inline-block cursor-default"
      onMouseEnter={() => setOuvert(true)}
      onMouseLeave={() => setOuvert(false)}
    >
      <span className="text-cc-grey">{driver?.givenName} </span>
      <strong className="border-b border-dotted border-cc-border">{driver?.familyName}</strong>

      <AnimatePresence>
        {ouvert && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 bottom-full mb-2 z-[2000] flex items-center gap-3 p-3 rounded-xl bg-cc-bg border shadow-[0_12px_40px_rgba(0,0,0,0.6)] whitespace-nowrap"
            style={{ borderColor: couleur }}
          >
            <AvatarPilote driver={driver} couleur={couleur} taille={56} />
            <span className="block text-left">
              <span className="block text-white font-bold text-[15px]">
                {driver?.givenName} {driver?.familyName}
              </span>
              <span className="block text-[13px] font-semibold" style={{ color: couleur }}>
                {driver?.nationality || "—"}
                {driver?.permanentNumber ? ` • #${driver.permanentNumber}` : ""}
              </span>
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
/* ============================================================
   PODIUM 3D
   ============================================================ */
function Podium({ resultats }) {
  const [actif, setActif] = useState(null);

  // ordre visuel : P2 gauche, P1 centre, P3 droite
  const places = [
    { idx: 1, hauteur: 96,  metal: "argent", label: "2" },
    { idx: 0, hauteur: 140, metal: "or",     label: "1" },
    { idx: 2, hauteur: 66,  metal: "bronze", label: "3" },
  ];

  return (
    <div className="mb-8 rounded-[14px] bg-cc-card border border-cc-border p-6 md:p-8 overflow-hidden">
      <div className="flex items-end justify-center gap-3 md:gap-6 flex-wrap md:flex-nowrap">
        {places.map(({ idx, hauteur, metal, label }, i) => {
          const r = resultats[idx];
          if (!r) return null;

          const couleur = COULEURS_ECURIES[r?.Constructor?.constructorId] || "#ff5a1f";
          const m = METAUX[metal];
          const estActif = actif === idx;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 * i }}
              className="flex flex-col items-center w-[30%] md:w-[220px] min-w-[100px]"
            >
              {/* Trophée */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActif(estActif ? null : idx)}
                className="cursor-pointer mb-2"
                style={{
                  filter: `drop-shadow(0 6px 10px rgba(0,0,0,.5))`,
                }}
              >
                <TropheeF1 type={metal} taille={idx === 0 ? 92 : 74} id={`podium-${idx}`} />
              </motion.div>

              {/* Avatar pilote */}
              <div className="mb-2">
                <AvatarPilote driver={r?.Driver} couleur={couleur} taille={idx === 0 ? 84 : 68} />
              </div>

              {/* Nom */}
              <div className="text-center mb-2 px-1">
                <div className={`font-bold leading-tight ${idx === 0 ? "text-lg md:text-xl" : "text-base md:text-lg"}`}>
                  <span className="text-cc-grey font-semibold">{r?.Driver?.givenName} </span>
                  <span className="text-white">{r?.Driver?.familyName}</span>
                </div>
                <div className="text-[13px] font-bold uppercase tracking-wide mt-0.5" style={{ color: couleur }}>
                  {r?.Constructor?.name || "—"}
                </div>
              </div>

              {/* Marche du podium */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: hauteur }}
                transition={{ duration: 0.7, delay: 0.3 + 0.15 * i, ease: "easeOut" }}
                whileHover={{ filter: "brightness(1.15)" }}
                onClick={() => setActif(estActif ? null : idx)}
                className="w-full rounded-t-lg relative flex items-start justify-center pt-3 cursor-pointer overflow-hidden"
                style={{
                  background: `linear-gradient(180deg, ${m.mid} 0%, ${m.sombre} 100%)`,
                  boxShadow: `inset 0 3px 0 ${m.clair}`,
                }}
              >
                <span
                  className="font-racing leading-none"
                  style={{
                    fontSize: idx === 0 ? 46 : 36,
                    color: "rgba(0,0,0,0.35)",
                    textShadow: `0 2px 0 ${m.clair}66`,
                  }}
                >
                  {label}
                </span>
              </motion.div>

              {/* Détail au clic */}
              <AnimatePresence>
                {estActif && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full mt-3 p-3 rounded-lg bg-cc-bg border text-[13px] text-cc-grey overflow-hidden"
                    style={{ borderColor: couleur }}
                  >
                    <div className="flex justify-between mb-1">
                      <span>Grille</span>
                      <strong className="text-white">{r?.grid ?? "—"}</strong>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Points</span>
                      <strong className="text-white">{r?.points ?? "—"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Temps / Statut</span>
                      <strong className="text-white">
                        {r?.Time?.time || r?.status || "—"}
                      </strong>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-cc-grey2 text-[13px] mt-5 mb-0 uppercase tracking-wider font-semibold">
        Clique sur un trophée pour voir les détails
      </p>
    </div>
  );
}
/* ============================================================
   PAGE
   ============================================================ */
export default function Courses() {
  const [saison, setSaison] = useState(2026);
  const [courses, setCourses] = useState([]);
  const [gpSelectionne, setGpSelectionne] = useState(null);
  const [resultats, setResultats] = useState([]);
  const [chargementCourses, setChargementCourses] = useState(true);
  const [chargementResultats, setChargementResultats] = useState(false);
  const [survol, setSurvol] = useState(null);
  const [maintenant, setMaintenant] = useState(null);
  const detailRef = useRef(null);

  useEffect(() => {
    setMaintenant(Date.now());
    const t = setInterval(() => setMaintenant(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setChargementCourses(true);
    setGpSelectionne(null);
    setResultats([]);
    fetch(`https://api.jolpi.ca/ergast/f1/${saison}/races/?limit=100`)
      .then((res) => res.json())
      .then((data) => {
        setCourses(data?.MRData?.RaceTable?.Races || []);
        setChargementCourses(false);
      })
      .catch(() => {
        setCourses([]);
        setChargementCourses(false);
      });
  }, [saison]);

  useEffect(() => {
    if (!gpSelectionne) return;
    setChargementResultats(true);
    setResultats([]);
    fetch(`https://api.jolpi.ca/ergast/f1/${saison}/${gpSelectionne.round}/results/?limit=100`)
      .then((res) => res.json())
      .then((data) => {
        setResultats(data?.MRData?.RaceTable?.Races?.[0]?.Results || []);
        setChargementResultats(false);
      })
      .catch(() => {
        setResultats([]);
        setChargementResultats(false);
      });
  }, [gpSelectionne, saison]);

  const loc = gpSelectionne?.Circuit?.Location;
  const drapeauGp = loc?.country ? (DRAPEAUX[loc.country] || "🏁") : "🏁";
  const estAVenir = gpSelectionne?.date ? new Date(gpSelectionne.date) > new Date() : false;

  const prochain = useMemo(
    () => (maintenant ? courses.find((c) => new Date(`${c.date}T${c.time || "12:00:00Z"}`) > maintenant) : null),
    [courses, maintenant]
  );
  const reste = prochain ? new Date(`${prochain.date}T${prochain.time || "12:00:00Z"}`) - maintenant : 0;
  const j = Math.floor(reste / 864e5), h = Math.floor(reste / 36e5) % 24, mn = Math.floor(reste / 6e4) % 60, sec = Math.floor(reste / 1e3) % 60;
  const nbPays = new Set(courses.map((c) => c.Circuit?.Location?.country)).size;
  const faites = maintenant ? courses.filter((c) => new Date(c.date) < maintenant).length : 0;
  const idx = gpSelectionne ? courses.findIndex((c) => c.round === gpSelectionne.round) : -1;

  const choisir = (c) => {
    setGpSelectionne(c);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  };

  return (
    <Layout
      actif="courses"
      eyebrow="Formule 1"
      titre="Les Grands Prix, du monde entier."
      accroche="Choisis une saison, explore le calendrier sur la carte et ouvre n'importe quelle course pour voir le podium et les résultats."
    >
      <div className="wrap">
        {/* Saisons */}
        <div className="bar">
          {SAISONS.map((an) => (
            <button key={an} className={`chip${saison === an ? " on" : ""}`} onClick={() => setSaison(an)}>{an}</button>
          ))}
        </div>

        {/* Chiffres clés */}
        <div className="stats">
          <motion.div className="stat" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <small>Grands Prix</small><strong>{courses.length}</strong>
          </motion.div>
          <motion.div className="stat" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            <small>Pays visités</small><strong>{nbPays}</strong>
          </motion.div>
          <motion.div className="stat" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
            <small>Courses disputées</small><strong>{faites}/{courses.length}</strong>
          </motion.div>
          <motion.div className="stat" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
            <small>{prochain ? `Prochain : ${prochain.Circuit.Location.locality}` : "Saison terminée"}</small>
            <strong className="acc">{prochain ? `${j}j ${String(h).padStart(2, "0")}:${String(mn).padStart(2, "0")}:${String(sec).padStart(2, "0")}` : "—"}</strong>
          </motion.div>
        </div>

        {/* Carte + calendrier */}
        <div className="explorer">
          {chargementCourses ? (
            <div className="skeleton" style={{ height: 560 }} />
          ) : (
            <CarteMonde
              courses={courses}
              gpSelect={gpSelectionne ? `${saison}-${gpSelectionne.round}` : null}
              survol={survol}
              saison={saison}
              onSelect={choisir}
              drapeaux={DRAPEAUX}
            />
          )}
          <div className="calendrier">
            {courses.map((c, i) => {
              const fait = maintenant && new Date(c.date) < maintenant;
              const on = gpSelectionne?.round === c.round;
              return (
                <motion.button
                  key={c.round}
                  className={`cal-item${on ? " on" : ""}${fait ? " fait" : ""}`}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(i * 0.025, 0.6) }}
                  onMouseEnter={() => setSurvol(c.round)}
                  onMouseLeave={() => setSurvol(null)}
                  onClick={() => choisir(c)}
                >
                  <span className="r">{String(c.round).padStart(2, "0")}</span>
                  <span style={{ minWidth: 0 }}>
                    <b>{DRAPEAUX[c.Circuit.Location.country] || ""} {c.raceName.replace(" Grand Prix", " GP")}</b>
                    <small>{new Date(c.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} · {c.Circuit.Location.locality}</small>
                  </span>
                  {prochain?.round === c.round && !on && <span className="badge">Prochain</span>}
                </motion.button>
              );
            })}
          </div>
        </div>

        {!gpSelectionne && !chargementCourses && (
          <p className="empty">Clique sur un point de la carte ou une course du calendrier pour ouvrir le détail.</p>
        )}

        {/* Détail */}
        <div ref={detailRef} style={{ scrollMarginTop: 90, paddingTop: 32 }}>
          <AnimatePresence mode="wait">
            {gpSelectionne && (
              <motion.section
                key={gpSelectionne.round + "-" + saison}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
              >
                <div className="gp-head">
                  <p className="eyebrow" style={{ margin: "0 0 8px" }}>Round {gpSelectionne.round} · {saison}</p>
                  <h3>{drapeauGp} {gpSelectionne.raceName}</h3>
                  <p>
                    {loc?.locality ? `${loc.locality}, ` : ""}{loc?.country || ""} ·{" "}
                    {gpSelectionne.date ? new Date(gpSelectionne.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "—"}
                  </p>
                  <div className="nav-gp">
                    <button className="chip" disabled={idx <= 0} onClick={() => choisir(courses[idx - 1])} style={{ opacity: idx <= 0 ? 0.4 : 1 }}>← Précédent</button>
                    <button className="chip" disabled={idx >= courses.length - 1} onClick={() => choisir(courses[idx + 1])} style={{ opacity: idx >= courses.length - 1 ? 0.4 : 1 }}>Suivant →</button>
                    {gpSelectionne.Circuit?.url && <a className="btn ghost" href={gpSelectionne.Circuit.url} target="_blank" rel="noopener noreferrer">Le circuit</a>}
                    {gpSelectionne.url && <a className="btn ghost" href={gpSelectionne.url} target="_blank" rel="noopener noreferrer">Résumé</a>}
                    <button className="chip" onClick={() => setGpSelectionne(null)}>Fermer</button>
                  </div>
                </div>

                {!chargementResultats && resultats.length >= 3 && <Podium resultats={resultats} />}

                <div className="panel">
                  {chargementResultats ? (
                    <div className="skeleton" style={{ height: 240 }} />
                  ) : resultats.length === 0 ? (
                    <p className="empty" style={{ padding: 32, margin: 0 }}>
                      {estAVenir ? "Ce Grand Prix n'a pas encore eu lieu, reviens après la course." : "Résultats non disponibles pour ce Grand Prix."}
                    </p>
                  ) : (
                    <table className="table">
                      <thead>
                        <tr><th>Pos</th><th>Pilote</th><th>Écurie</th><th className="num">Grille</th><th>Temps / statut</th><th className="num">Pts</th></tr>
                      </thead>
                      <motion.tbody initial="hidden" animate="visible" variants={staggerContainer}>
                        {resultats.map((r) => {
                          const couleur = COULEURS_ECURIES[r?.Constructor?.constructorId] || "#ff5a1f";
                          const gain = parseInt(r.grid) - parseInt(r.position);
                          return (
                            <motion.tr key={r.position} variants={tableRowVariant}>
                              <td className="pos">{r.position}</td>
                              <td><NomPiloteHover driver={r.Driver} couleur={couleur} /></td>
                              <td><span style={{ borderLeft: `3px solid ${couleur}`, paddingLeft: 8 }}>{r.Constructor?.name}</span></td>
                              <td className="num" style={{ color: "var(--muted)" }}>
                                {r.grid}{r.grid > 0 && gain !== 0 && !isNaN(gain) && (
                                  <span style={{ color: gain > 0 ? "#5fd38d" : "#ff6b6b", marginLeft: 6, fontSize: 12 }}>{gain > 0 ? `▲${gain}` : `▼${-gain}`}</span>
                                )}
                              </td>
                              <td style={{ color: "var(--muted)" }}>{r.Time?.time || r.status}</td>
                              <td className="num"><b>{r.points}</b></td>
                            </motion.tr>
                          );
                        })}
                      </motion.tbody>
                    </table>
                  )}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
