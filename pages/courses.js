import { useState, useEffect, useRef, useMemo } from "react";
import Layout from "../components/Layout";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

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
   PODIUM : cartes pilotes inclinables
   ============================================================ */
function CartePodium({ r, rang, delai }) {
  const photo = usePhotoPilote(r.Driver);
  const couleur = COULEURS_ECURIES[r?.Constructor?.constructorId] || "#ff5a1f";
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotX = useSpring(rx, { stiffness: 160, damping: 18 });
  const rotY = useSpring(ry, { stiffness: 160, damping: 18 });
  const [ouvert, setOuvert] = useState(false);
  const gain = parseInt(r.grid) - parseInt(r.position);

  const bouger = (e) => {
    const b = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - b.left) / b.width - 0.5) * 14);
    rx.set(-((e.clientY - b.top) / b.height - 0.5) * 14);
  };
  const quitter = () => { rx.set(0); ry.set(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delai, ease: [0.2, 0.8, 0.2, 1] }}
      style={{ perspective: 900 }}
      className={`flex-1 min-w-[min(260px,100%)] ${["md:order-1 md:mt-0", "md:order-0 md:mt-7", "md:order-2 md:mt-14"][rang]}`}
    >
      <motion.div
        onMouseMove={bouger}
        onMouseLeave={quitter}
        onClick={() => setOuvert(!ouvert)}
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d", borderColor: couleur }}
        className="relative overflow-hidden rounded-2xl border bg-cc-card cursor-pointer group"
      >
        {/* grand numéro en arrière-plan */}
        <span
          className="absolute -right-2 -top-6 font-racing font-bold leading-none select-none pointer-events-none"
          style={{ fontSize: 190, color: "transparent", WebkitTextStroke: `2px ${couleur}`, opacity: 0.5 }}
        >
          {rang + 1}
        </span>

        <div className="relative flex items-end gap-4 p-5 pb-0 h-[200px]">
          <div className="w-[130px] h-[170px] rounded-t-xl overflow-hidden bg-cc-bg shrink-0 self-end" style={{ borderBottom: `4px solid ${couleur}` }}>
            {photo ? (
              <img src={photo} alt={r.Driver.familyName} className="w-full h-full object-cover object-top grayscale group-hover:grayscale-0 transition duration-500 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-racing text-4xl text-cc-grey2">
                {r.Driver.givenName?.[0]}{r.Driver.familyName?.[0]}
              </div>
            )}
          </div>
          <div className="pb-4 min-w-0">
            <div className="text-cc-grey text-sm">{r.Driver.givenName}</div>
            <div className="font-racing font-bold text-2xl leading-tight tracking-tight">{r.Driver.familyName}</div>
            <div className="text-sm font-semibold mt-1" style={{ color: couleur }}>{r.Constructor?.name}</div>
          </div>
        </div>

        <div className="border-t border-cc-border text-center" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
          {[
            ["Temps", r.Time?.time || r.status],
            ["Grille", r.grid],
            ["Points", r.points],
          ].map(([l, v]) => (
            <div key={l} className="py-3 px-2 border-r last:border-r-0 border-cc-border">
              <div className="text-[11px] text-cc-grey2">{l}</div>
              <div className="text-sm font-semibold truncate">{v}</div>
            </div>
          ))}
        </div>

        <motion.div
          initial={false}
          animate={{ height: ouvert ? "auto" : 0 }}
          className="overflow-hidden bg-cc-bg"
        >
          <div className="p-4 text-sm text-cc-grey flex justify-between">
            <span>{r.Driver.nationality}{r.Driver.permanentNumber ? ` · #${r.Driver.permanentNumber}` : ""}</span>
            <span>
              {isNaN(gain) || r.grid === "0" ? "Départ des stands" : gain === 0 ? "Position conservée" : gain > 0 ? `+${gain} places gagnées` : `${gain} places perdues`}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Podium({ resultats }) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-5 items-start">
        {[0, 1, 2].map((i) => resultats[i] && (
          <CartePodium key={i} r={resultats[i]} rang={i} delai={0.12 * i} />
        ))}
      </div>
      <p className="text-cc-grey2 text-[13px] mt-4 mb-0">Survole une carte pour l'incliner, clique pour afficher le détail.</p>
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
      logo="f1"
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
