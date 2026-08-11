import { useState, useEffect, useRef } from "react";
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
   TROPHÉE — coupe classique Grand Prix
   Proportions hautes, vasque évasée, cannelures, socle à étages
   ============================================================ */
const METAUX = {
  or: {
    stops: ["#FFF8D0", "#FFD700", "#C99700", "#FFE86B", "#8C6B00"],
    glow: "#FFD700",
    label: "Vainqueur",
  },
  argent: {
    stops: ["#FFFFFF", "#E8E8F0", "#A8A8B8", "#F2F2F8", "#6E6E7C"],
    glow: "#D8D8E8",
    label: "2ᵉ place",
  },
  bronze: {
    stops: ["#FFD9A8", "#CD7F32", "#8A4E1C", "#E8A05C", "#5C3410"],
    glow: "#CD7F32",
    label: "3ᵉ place",
  },
};

function Trophee({ metal = "or", taille = 96, actif = false, onClick }) {
  const m = METAUX[metal];
  const id = `tr-${metal}`;

  return (
    <motion.svg
      viewBox="0 0 100 160"
      width={taille}
      height={taille * 1.6}
      onClick={onClick}
      className="cursor-pointer select-none overflow-visible"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.07 }}
      whileTap={{ scale: 0.96 }}
      style={{ filter: `drop-shadow(0 0 ${actif ? 18 : 9}px ${m.glow}${actif ? "cc" : "77"})` }}
    >
      <defs>
        {/* Dégradé métallique vertical principal */}
        <linearGradient id={`${id}-corps`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={m.stops[2]} />
          <stop offset="18%" stopColor={m.stops[1]} />
          <stop offset="38%" stopColor={m.stops[0]} />
          <stop offset="52%" stopColor={m.stops[3]} />
          <stop offset="74%" stopColor={m.stops[1]} />
          <stop offset="100%" stopColor={m.stops[4]} />
        </linearGradient>

        {/* Dégradé socle, plus sombre */}
        <linearGradient id={`${id}-socle`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={m.stops[4]} />
          <stop offset="30%" stopColor={m.stops[1]} />
          <stop offset="60%" stopColor={m.stops[3]} />
          <stop offset="100%" stopColor={m.stops[4]} />
        </linearGradient>

        {/* Reflet balayant */}
        <linearGradient id={`${id}-shine`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="50%" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>

        <clipPath id={`${id}-clip`}>
          <path d="M28 18 L72 18 L68 52 Q64 70 50 72 Q36 70 32 52 Z" />
        </clipPath>
      </defs>

      {/* ---- Anses ---- */}
      <path
        d="M28 24 Q10 26 10 42 Q10 58 30 58"
        fill="none"
        stroke={`url(#${id}-corps)`}
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path
        d="M72 24 Q90 26 90 42 Q90 58 70 58"
        fill="none"
        stroke={`url(#${id}-corps)`}
        strokeWidth="5.5"
        strokeLinecap="round"
      />

      {/* ---- Vasque ---- */}
      <path
        d="M28 18 L72 18 L68 52 Q64 70 50 72 Q36 70 32 52 Z"
        fill={`url(#${id}-corps)`}
      />

      {/* Cannelures verticales dans la vasque */}
      <g clipPath={`url(#${id}-clip)`} opacity="0.28">
        {[36, 43, 50, 57, 64].map((x) => (
          <rect key={x} x={x} y="18" width="1.6" height="54" fill={m.stops[4]} />
        ))}
      </g>

      {/* Lèvre supérieure */}
      <rect x="25" y="14" width="50" height="7" rx="3.5" fill={`url(#${id}-corps)`} />
      <rect x="25" y="14" width="50" height="2.4" rx="1.2" fill={m.stops[0]} opacity="0.6" />

      {/* ---- Tige ---- */}
      <path d="M46 72 L54 72 L55 90 L45 90 Z" fill={`url(#${id}-corps)`} />
      {/* Nœud décoratif */}
      <ellipse cx="50" cy="82" rx="9" ry="4.5" fill={`url(#${id}-corps)`} />
      <ellipse cx="50" cy="80.5" rx="9" ry="2" fill={m.stops[0]} opacity="0.45" />

      {/* ---- Socle : trois étages ---- */}
      <path d="M38 90 L62 90 L66 100 L34 100 Z" fill={`url(#${id}-socle)`} />
      <rect x="30" y="100" width="40" height="9" rx="2" fill={`url(#${id}-corps)`} />
      <rect x="24" y="109" width="52" height="13" rx="2.5" fill={`url(#${id}-socle)`} />

      {/* Plaque gravée sur le socle */}
      <rect x="32" y="112.5" width="36" height="6.5" rx="1.5" fill={m.stops[4]} opacity="0.55" />
      <rect x="32" y="112.5" width="36" height="1.2" rx="0.6" fill={m.stops[0]} opacity="0.35" />

      {/* ---- Reflet animé ---- */}
      <motion.rect
        x="-40"
        y="0"
        width="26"
        height="160"
        fill={`url(#${id}-shine)`}
        transform="skewX(-18)"
        animate={{ x: [-40, 130] }}
        transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut" }}
      />
    </motion.svg>
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
    if (cachePhotos[titre] !== undefined) { setSrc(cachePhotos[titre]); return; }

    let annule = false;
    fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titre)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        let img = d?.thumbnail?.source || null;
        if (img) { cachePhotos[titre] = img; if (!annule) setSrc(img); return; }
        return fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titre)}`)
          .then((r) => (r.ok ? r.json() : null))
          .then((d2) => {
            const img2 = d2?.thumbnail?.source || null;
            cachePhotos[titre] = img2;
            if (!annule) setSrc(img2);
          });
      })
      .catch(() => { cachePhotos[titre] = null; });

    return () => { annule = true; };
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
        boxShadow: `0 0 20px ${couleur}55`,
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

{/* ============ PODIUM NÉON ============ */}
{!chargementResultats && resultats.length >= 3 && (
  <div className="mb-10 pt-4">
    {/* Sol réfléchissant */}
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 md:gap-5 items-end max-w-[820px] mx-auto">
        {[
          { idx: 1, metal: "argent", h: "h-[90px] md:h-[120px]", pos: 2 },
          { idx: 0, metal: "or", h: "h-[130px] md:h-[175px]", pos: 1 },
          { idx: 2, metal: "bronze", h: "h-[62px] md:h-[85px]", pos: 3 },
        ].map(({ idx, metal, h, pos }) => {
          const r = resultats[idx];
          const m = METAUX[metal];
          const couleur = COULEURS_ECURIES[r?.Constructor?.constructorId] || "#00d4ff";
          const ouvert = podiumOuvert === idx;

          return (
            <div key={idx} className="flex flex-col items-center">
              {/* Trophée */}
              <Trophee
                metal={metal}
                taille={pos === 1 ? 62 : 48}
                actif={ouvert}
                onClick={() => setPodiumOuvert(ouvert ? null : idx)}
              />

              {/* Avatar + nom */}
              <div className="flex flex-col items-center mt-2 mb-3 px-1">
                <AvatarPilote
                  driver={r?.Driver}
                  couleur={couleur}
                  taille={pos === 1 ? 56 : 46}
                />
                <div className="text-center mt-2">
                  <div className="text-[11px] md:text-xs text-cc-grey uppercase tracking-wide leading-tight">
                    {r?.Driver?.givenName}
                  </div>
                  <div className="text-sm md:text-lg font-bold leading-tight">
                    {r?.Driver?.familyName}
                  </div>
                  <div
                    className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider mt-0.5"
                    style={{ color: couleur }}
                  >
                    {r?.Constructor?.name}
                  </div>
                </div>
              </div>

              {/* ---- MARCHE NÉON ---- */}
              <motion.div
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.55, delay: 0.15 + pos * 0.12, ease: [0.34, 1.2, 0.64, 1] }}
                onClick={() => setPodiumOuvert(ouvert ? null : idx)}
                className={`${h} w-full origin-bottom relative rounded-t-lg cursor-pointer overflow-hidden`}
                style={{
                  background:
                    "linear-gradient(180deg, rgba(20,27,46,0.92) 0%, rgba(10,14,26,0.96) 100%)",
                  border: `1.5px solid ${m.glow}`,
                  boxShadow: ouvert
                    ? `0 0 28px ${m.glow}88, 0 0 60px ${m.glow}44, inset 0 0 26px ${m.glow}33`
                    : `0 0 14px ${m.glow}55, inset 0 0 16px ${m.glow}1f`,
                  transition: "box-shadow 0.3s ease",
                }}
              >
                {/* Lignes de scan */}
                <div
                  className="absolute inset-0 opacity-[0.13] pointer-events-none"
                  style={{
                    backgroundImage: `repeating-linear-gradient(0deg, ${m.glow} 0px, ${m.glow} 1px, transparent 1px, transparent 9px)`,
                  }}
                />

                {/* Liseré haut lumineux */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: m.glow, boxShadow: `0 0 10px ${m.glow}` }}
                />

                {/* Numéro néon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="font-racing text-3xl md:text-5xl"
                    style={{
                      color: "#fff",
                      textShadow: `0 0 6px #fff, 0 0 14px ${m.glow}, 0 0 30px ${m.glow}, 0 0 50px ${m.glow}aa`,
                    }}
                  >
                    {pos}
                  </span>
                </div>
              </motion.div>

              {/* Reflet au sol */}
              <div
                className={`${h} w-full rounded-b-lg pointer-events-none`}
                style={{
                  background: `linear-gradient(180deg, ${m.glow}22 0%, transparent 55%)`,
                  transform: "scaleY(-1)",
                  opacity: 0.4,
                  maskImage: "linear-gradient(180deg, transparent, black)",
                  WebkitMaskImage: "linear-gradient(180deg, transparent, black)",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>

    {/* Panneau de détail */}
    <AnimatePresence>
      {podiumOuvert !== null && resultats[podiumOuvert] && (
        <motion.div
          initial={{ opacity: 0, height: 0, marginTop: 0 }}
          animate={{ opacity: 1, height: "auto", marginTop: 20 }}
          exit={{ opacity: 0, height: 0, marginTop: 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden max-w-[820px] mx-auto"
        >
          {(() => {
            const r = resultats[podiumOuvert];
            const metal = ["or", "argent", "bronze"][podiumOuvert];
            const m = METAUX[metal];
            return (
              <div
                className="rounded-xl p-5 bg-cc-card/80 backdrop-blur"
                style={{
                  border: `1px solid ${m.glow}66`,
                  boxShadow: `0 0 24px ${m.glow}22`,
                }}
              >
                <div
                  className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
                  style={{ color: m.glow, textShadow: `0 0 10px ${m.glow}77` }}
                >
                  {m.label}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    ["Temps", r?.Time?.time || r?.status || "—"],
                    ["Grille", `P${r?.grid || "—"}`],
                    ["Tours", r?.laps || "—"],
                    ["Points", r?.points ?? 0],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="text-[11px] text-cc-grey2 uppercase tracking-wider mb-1">{k}</div>
                      <div className="text-base md:text-lg font-bold text-white">{v}</div>
                    </div>
                  ))}
                </div>
                {r?.FastestLap?.Time?.time && (
                  <div className="mt-4 pt-3 border-t border-cc-border text-sm text-cc-grey">
                    ⏱️ Meilleur tour :{" "}
                    <strong className="text-cc-cyan">{r.FastestLap.Time.time}</strong>
                    {r.FastestLap.lap && ` (tour ${r.FastestLap.lap})`}
                  </div>
                )}
              </div>
            );
          })()}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
)}

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

  return (
    <main className="font-rajdhani text-white min-h-screen overflow-x-hidden">

      {/* Barre du haut */}
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="px-4 md:px-10 py-5 bg-cc-bg/80 border-b-[3px] border-cc-cyan flex justify-between items-center flex-wrap gap-4 sticky top-0 z-[1000] backdrop-blur-lg"
      >
        <h1
          className="font-racing m-0 text-2xl md:text-3xl tracking-wide"
          style={{
            background: "linear-gradient(90deg, #00d4ff, #e10600)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          CARSTOCARS
        </h1>
        <nav className="text-base md:text-lg font-semibold uppercase tracking-wide flex gap-5 md:gap-6">
          {[
            { href: "/", label: "Accueil" },
            { href: "/auto", label: "Automobile" },
            { href: "/sport", label: "Sport Auto" },
            { href: "/courses", label: "Courses", active: true },
          ].map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
              className={`no-underline relative ${link.active ? "text-cc-cyan" : "text-white hover:text-cc-cyan"}`}
            >
              {link.label}
            </motion.a>
          ))}
        </nav>
      </motion.header>

      {/* Bandeau titre */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="px-4 md:px-10 pt-12 md:pt-16 pb-8 text-center"
      >
        <h2 className="font-racing text-3xl md:text-5xl mt-0 mb-2.5 uppercase">
          Les <span className="text-cc-red">Grands Prix</span>
        </h2>
        <p className="text-cc-grey text-base md:text-lg m-0">
          Clique sur un point de la carte pour voir les résultats de la course
        </p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="h-1 bg-gradient-to-r from-cc-cyan to-cc-red mx-auto mt-5 rounded-sm"
        />
      </motion.section>

      {/* Sélecteur de saison */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="flex justify-center items-center gap-4 px-4 md:px-10 pb-10 flex-wrap"
      >
        <span className="text-cc-grey text-lg font-bold uppercase tracking-wide">Saison</span>
        <motion.select
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          value={saison}
          onChange={(e) => setSaison(Number(e.target.value))}
          className="px-6 py-3 rounded-full border-2 border-cc-cyan bg-cc-card text-white text-xl font-bold font-rajdhani tracking-wide cursor-pointer outline-none hover:bg-cc-border transition-colors"
        >
          {SAISONS.map((an) => (
            <option key={an} value={an} className="bg-cc-card">{an}</option>
          ))}
        </motion.select>
        <span className="text-cc-grey2 text-base font-semibold">
          {chargementCourses ? "..." : `${courses.length} Grands Prix`}
        </span>
      </motion.section>

      {/* Carte du monde */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={fadeInUp}
        className="px-4 md:px-10 pb-10 max-w-[1400px] mx-auto"
      >
        {chargementCourses ? (
          <div className="h-[550px] flex items-center justify-center text-cc-grey bg-cc-card rounded-2xl border border-cc-border text-lg">
            Chargement du calendrier {saison}...
          </div>
        ) : (
          <CarteMonde
            courses={courses}
            gpSelect={gpSelectionne ? `${saison}-${gpSelectionne.round}` : null}
            saison={saison}
            onSelect={setGpSelectionne}
            drapeaux={DRAPEAUX}
          />
        )}
      </motion.section>

      {/* Message si rien sélectionné */}
      <AnimatePresence>
        {!gpSelectionne && !chargementCourses && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-cc-grey text-lg px-4 md:px-10 pb-16"
          >
            Sélectionne un Grand Prix sur la carte pour afficher le classement 🏁
          </motion.p>
        )}
      </AnimatePresence>

      {/* Détail du GP sélectionné */}
      <AnimatePresence mode="wait">
        {gpSelectionne && (
          <motion.section
            key={`${saison}-${gpSelectionne.round}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="px-4 md:px-10 pb-16 max-w-[1200px] mx-auto"
          >

            {/* Entête du GP */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              whileHover={{ boxShadow: "0 12px 40px rgba(0,212,255,0.15)" }}
              className="bg-cc-card rounded-2xl border border-cc-border p-5 md:p-7 mb-7 shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-shadow"
            >
              <div className="flex justify-between items-start flex-wrap gap-5">
                <div>
                  <div className="flex gap-2 flex-wrap mb-3">
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="inline-block bg-cc-red text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                    >
                      Manche {gpSelectionne.round} — {saison}
                    </motion.span>
                    {estAVenir && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="inline-block bg-cc-border text-cc-cyan px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                      >
                        À venir
                      </motion.span>
                    )}
                  </div>
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-racing text-2xl md:text-4xl mt-0 mb-2 leading-tight"
                  >
                    {drapeauGp} {gpSelectionne.raceName}
                  </motion.h3>
                  <p className="text-cc-grey text-base md:text-[17px] m-0">
                    {gpSelectionne.Circuit?.circuitName}
                    {loc?.locality && ` • ${loc.locality}`}
                    {loc?.country && `, ${loc.country}`}
                  </p>
                  {gpSelectionne.date && (
                    <p className="text-cc-grey2 text-[15px] mt-1.5 mb-0 font-semibold">
                      📅 {new Date(gpSelectionne.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      {gpSelectionne.time && ` — ${gpSelectionne.time.slice(0, 5)} UTC`}
                    </p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05, borderColor: "#e10600" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGpSelectionne(null)}
                  className="px-5 py-2.5 rounded-full border-2 border-cc-border bg-cc-bg text-cc-grey text-[15px] font-bold font-rajdhani uppercase tracking-wide cursor-pointer hover:text-white transition-colors"
                >
                  ✕ Fermer
                </motion.button>
              </div>

              {/* Liens circuit */}
              <div className="flex gap-3 flex-wrap mt-5">
                {gpSelectionne.Circuit?.url && (
                  <motion.a
                    whileHover={{ scale: 1.03, boxShadow: "0 12px 40px rgba(0,212,255,0.4)" }}
                    whileTap={{ scale: 0.97 }}
                    href={gpSelectionne.Circuit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-cc-cyan to-cc-red text-white no-underline text-base font-bold uppercase tracking-wide shadow-[0_8px_30px_rgba(0,212,255,0.3)] transition-shadow"
                  >
                    🏁 Voir le tracé du circuit →
                  </motion.a>
                )}
                {gpSelectionne.url && (
                  <motion.a
                    whileHover={{ scale: 1.03, borderColor: "#00d4ff" }}
                    whileTap={{ scale: 0.97 }}
                    href={gpSelectionne.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border-2 border-cc-border bg-cc-bg text-cc-cyan no-underline text-base font-bold uppercase tracking-wide transition-colors"
                  >
                    📖 Résumé du Grand Prix →
                  </motion.a>
                )}
              </div>
            </motion.div>

            {/* PODIUM 3D */}
            {!chargementResultats && resultats.length >= 3 && (
              <Podium resultats={resultats} />
            )}

            {/* Tableau des résultats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-cc-card rounded-2xl border border-cc-border shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
            >
              <div className="px-6 py-5 border-b border-cc-border">
                <h4 className="font-racing text-xl md:text-2xl m-0 uppercase">
                  Classement de la course
                </h4>
              </div>

              {chargementResultats ? (
                <motion.p
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  className="text-center text-cc-grey text-lg p-12"
                >
                  Chargement des résultats...
                </motion.p>
              ) : resultats.length === 0 ? (
                <p className="text-center text-cc-grey text-lg p-12">
                  {estAVenir
                    ? "Ce Grand Prix n'a pas encore eu lieu — reviens après la course ! 🏁"
                    : "Résultats non disponibles pour ce Grand Prix 🏁"}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-base">
                    <thead>
                      <tr className="bg-cc-bg">
                        <th className={TH}>Pos</th>
                        <th className={TH}>Pilote</th>
                        <th className={TH}>Écurie</th>
                        <th className={TH}>Grille</th>
                        <th className={TH}>Temps / Statut</th>
                        <th className={`${TH} !text-center`}>Pts</th>
                      </tr>
                    </thead>
                    <motion.tbody
                      initial="hidden"
                      animate="visible"
                      variants={staggerContainer}
                    >
                      {resultats.map((r, i) => {
                        const couleur = COULEURS_ECURIES[r?.Constructor?.constructorId] || "#5a6b8c";
                        const pts = Number(r?.points) || 0;
                        return (
                          <motion.tr
                            key={i}
                            variants={tableRowVariant}
                            whileHover={{ backgroundColor: "rgba(0,212,255,0.06)" }}
                            transition={{ duration: 0.15 }}
                            className={`border-t border-cc-border ${i % 2 === 0 ? "bg-transparent" : "bg-cc-bg/40"}`}
                          >
                            <td className={`px-4 py-3.5 font-bold text-lg ${i < 3 ? "text-cc-cyan" : "text-white"}`}>
                              {r?.position || "—"}
                            </td>
                            <td className="px-4 py-3.5">
                              <NomPiloteHover driver={r?.Driver} couleur={couleur} />
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className="inline-block w-1 h-4 mr-2.5 align-middle rounded-sm"
                                style={{ background: couleur }}
                              />
                              <span className="text-cc-light">{r?.Constructor?.name || "—"}</span>
                            </td>
                            <td className="px-4 py-3.5 text-cc-grey2 font-semibold">
                              {r?.grid || "—"}
                            </td>
                            <td className="px-4 py-3.5 text-cc-grey whitespace-nowrap">
                              {r?.Time?.time || r?.status || "—"}
                            </td>
                            <td className={`px-4 py-3.5 text-center text-[17px] ${pts > 0 ? "font-bold text-white" : "font-medium text-cc-faint"}`}>
                              {pts}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </motion.tbody>
                  </table>
                </div>
              )}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Bas de page */}
      <footer className="border-t border-cc-border px-4 md:px-10 py-6 text-cc-grey2 text-sm text-center">
        © 2026 Carstocars — Passion automobile · Données{" "}
        <a href="https://api.jolpi.ca" target="_blank" rel="noopener noreferrer" className="text-cc-cyan no-underline hover:underline">
          Jolpica F1 API
        </a>
      </footer>

    </main>
  );
}
