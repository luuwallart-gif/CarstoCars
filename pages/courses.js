import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

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
    <main className="font-rajdhani text-white min-h-screen">

      {/* Barre du haut */}
      <header className="px-4 md:px-10 py-5 bg-cc-bg/80 border-b-[3px] border-cc-cyan flex justify-between items-center flex-wrap gap-4 sticky top-0 z-[1000] backdrop-blur-lg">
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
          <a href="/" className="text-white no-underline hover:text-cc-cyan transition-colors">Accueil</a>
          <a href="/auto" className="text-white no-underline hover:text-cc-cyan transition-colors">Automobile</a>
          <a href="/sport" className="text-white no-underline hover:text-cc-cyan transition-colors">Sport Auto</a>
          <a href="/courses" className="text-cc-cyan no-underline">Courses</a>
        </nav>
      </header>

      {/* Bandeau titre */}
      <section className="px-4 md:px-10 pt-12 md:pt-16 pb-8 text-center">
        <h2 className="font-racing text-3xl md:text-5xl mt-0 mb-2.5 uppercase">
          Les <span className="text-cc-red">Grands Prix</span>
        </h2>
        <p className="text-cc-grey text-base md:text-lg m-0">
          Clique sur un point de la carte pour voir les résultats de la course
        </p>
        <div className="w-20 h-1 bg-gradient-to-r from-cc-cyan to-cc-red mx-auto mt-5 rounded-sm" />
      </section>

      {/* Sélecteur de saison */}
      <section className="flex justify-center items-center gap-4 px-4 md:px-10 pb-10 flex-wrap">
        <span className="text-cc-grey text-lg font-bold uppercase tracking-wide">Saison</span>
        <select
          value={saison}
          onChange={(e) => setSaison(Number(e.target.value))}
          className="px-6 py-3 rounded-full border-2 border-cc-cyan bg-cc-card text-white text-xl font-bold font-rajdhani tracking-wide cursor-pointer outline-none hover:bg-cc-border transition-colors"
        >
          {SAISONS.map((an) => (
            <option key={an} value={an} className="bg-cc-card">{an}</option>
          ))}
        </select>
        <span className="text-cc-grey2 text-base font-semibold">
          {chargementCourses ? "..." : `${courses.length} Grands Prix`}
        </span>
      </section>

      {/* Carte du monde */}
      <section className="px-4 md:px-10 pb-10 max-w-[1400px] mx-auto">
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
      </section>

      {/* Message si rien sélectionné */}
      {!gpSelectionne && !chargementCourses && (
        <p className="text-center text-cc-grey text-lg px-4 md:px-10 pb-16">
          Sélectionne un Grand Prix sur la carte pour afficher le classement 🏁
        </p>
      )}

      {/* Détail du GP sélectionné */}
      {gpSelectionne && (
        <section className="px-4 md:px-10 pb-16 max-w-[1200px] mx-auto">

          {/* Entête du GP */}
          <div className="bg-cc-card rounded-2xl border border-cc-border p-5 md:p-7 mb-7 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <div className="flex justify-between items-start flex-wrap gap-5">
              <div>
                <div className="flex gap-2 flex-wrap mb-3">
                  <span className="inline-block bg-cc-red text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Manche {gpSelectionne.round} — {saison}
                  </span>
                  {estAVenir && (
                    <span className="inline-block bg-cc-border text-cc-cyan px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      À venir
                    </span>
                  )}
                </div>
                <h3 className="font-racing text-2xl md:text-4xl mt-0 mb-2 leading-tight">
                  {drapeauGp} {gpSelectionne.raceName}
                </h3>
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

              <button
                onClick={() => setGpSelectionne(null)}
                className="px-5 py-2.5 rounded-full border-2 border-cc-border bg-cc-bg text-cc-grey text-[15px] font-bold font-rajdhani uppercase tracking-wide cursor-pointer hover:border-cc-red hover:text-white transition-colors"
              >
                ✕ Fermer
              </button>
            </div>

            {/* Liens circuit */}
            <div className="flex gap-3 flex-wrap mt-5">
              {gpSelectionne.Circuit?.url && (
                <a
                  href={gpSelectionne.Circuit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-cc-cyan to-cc-red text-white no-underline text-base font-bold uppercase tracking-wide shadow-[0_8px_30px_rgba(0,212,255,0.3)] hover:brightness-110 transition"
                >
                  🏁 Voir le tracé du circuit →
                </a>
              )}
              {gpSelectionne.url && (
                <a
                  href={gpSelectionne.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border-2 border-cc-border bg-cc-bg text-cc-cyan no-underline text-base font-bold uppercase tracking-wide hover:border-cc-cyan transition-colors"
                >
                  📖 Résumé du Grand Prix →
                </a>
              )}
            </div>
          </div>

          {/* Podium */}
          {!chargementResultats && resultats.length >= 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7 items-end">
              {[1, 0, 2].map((idx, ordre) => {
                const r = resultats[idx];
                const medailles = ["🥇", "🥈", "🥉"];
                const bordures = ["#FFD700", "#C0C0C0", "#CD7F32"];
                const couleur = COULEURS_ECURIES[r?.Constructor?.constructorId] || "#00d4ff";
                return (
                  <div
                    key={idx}
                    className={`bg-cc-card rounded-2xl p-5 text-center shadow-[0_8px_30px_rgba(0,0,0,0.4)] border-2 ${idx === 0 ? "sm:pb-8" : ""}`}
                    style={{ borderColor: bordures[idx], order: ordre }}
                  >
                    <div className="text-4xl mb-2.5">{medailles[idx]}</div>
                    <div className="text-xl md:text-[22px] font-bold mb-1.5">
                      <span className="text-cc-grey font-semibold">{r?.Driver?.givenName} </span>
                      {r?.Driver?.familyName}
                    </div>
                    <div
                      className="text-[15px] font-bold uppercase tracking-wide mb-2.5"
                      style={{ color: couleur }}
                    >
                      {r?.Constructor?.name || "—"}
                    </div>
                    <div className="text-cc-grey2 text-[15px] font-semibold">
                      {r?.Time?.time || r?.status || "—"} • {r?.points ?? 0} pts
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tableau des résultats */}
          <div className="bg-cc-card rounded-2xl border border-cc-border overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <div className="px-6 py-5 border-b border-cc-border">
              <h4 className="font-racing text-xl md:text-2xl m-0 uppercase">
                Classement de la course
              </h4>
            </div>

            {chargementResultats ? (
              <p className="text-center text-cc-grey text-lg p-12">
                Chargement des résultats...
              </p>
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
                  <tbody>
                    {resultats.map((r, i) => {
                      const couleur = COULEURS_ECURIES[r?.Constructor?.constructorId] || "#5a6b8c";
                      const pts = Number(r?.points) || 0;
                      return (
                        <tr
                          key={i}
                          className={`border-t border-cc-border hover:bg-cc-border/40 transition-colors ${i % 2 === 0 ? "bg-transparent" : "bg-cc-bg/40"}`}
                        >
                          <td className={`px-4 py-3.5 font-bold text-lg ${i < 3 ? "text-cc-cyan" : "text-white"}`}>
                            {r?.position || "—"}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-cc-grey">{r?.Driver?.givenName} </span>
                            <strong>{r?.Driver?.familyName}</strong>
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
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

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
