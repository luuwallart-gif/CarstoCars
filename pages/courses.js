import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const CarteMonde = dynamic(() => import("../components/CarteMonde"), {
  ssr: false,
  loading: () => (
    <div className="h-[550px] flex items-center justify-center text-neutral-500 bg-[#f5f1e8] rounded-3xl border border-neutral-200 text-lg">
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

const TH = "px-4 py-4 text-left text-neutral-500 text-[11px] font-semibold uppercase tracking-[0.15em]";

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
    <main className="font-sans text-neutral-900 min-h-screen bg-[#f5f1e8]">

      {/* Barre du haut */}
      <header className="px-6 md:px-12 py-6 bg-[#f5f1e8]/90 border-b border-neutral-300 flex justify-between items-center flex-wrap gap-4 sticky top-0 z-[1000] backdrop-blur-md">
        <h1 className="font-serif m-0 text-2xl md:text-[28px] tracking-tight text-neutral-900">
          Carstocars
        </h1>
        <nav className="text-[13px] font-medium uppercase tracking-[0.15em] flex gap-6 md:gap-8">
          <a href="/" className="text-neutral-600 no-underline hover:text-neutral-900 transition-colors">Accueil</a>
          <a href="/auto" className="text-neutral-600 no-underline hover:text-neutral-900 transition-colors">Automobile</a>
          <a href="/sport" className="text-neutral-600 no-underline hover:text-neutral-900 transition-colors">Sport Auto</a>
          <a href="/courses" className="text-neutral-900 no-underline border-b border-neutral-900 pb-0.5">Courses</a>
        </nav>
      </header>

      {/* Bandeau titre */}
      <section className="px-6 md:px-12 pt-20 md:pt-28 pb-14 text-center max-w-3xl mx-auto">
        <p className="text-[11px] uppercase tracking-[0.3em] text-neutral-500 mb-5 font-medium">
          Saison {saison}
        </p>
        <h2 className="font-serif text-4xl md:text-6xl mt-0 mb-6 leading-[1.1] text-neutral-900">
          Les Grands Prix
        </h2>
        <p className="text-neutral-600 text-base md:text-lg leading-relaxed">
          Clique sur un point de la carte pour découvrir les résultats de la course
        </p>
      </section>

      {/* Sélecteur de saison */}
      <section className="flex justify-center items-center gap-4 px-6 md:px-12 pb-14 flex-wrap">
        <span className="text-neutral-500 text-[13px] font-medium uppercase tracking-[0.15em]">Saison</span>
        <select
          value={saison}
          onChange={(e) => setSaison(Number(e.target.value))}
          className="px-6 py-2.5 rounded-full border border-neutral-300 bg-white text-neutral-900 text-base font-medium cursor-pointer outline-none hover:border-neutral-900 transition-colors"
        >
          {SAISONS.map((an) => (
            <option key={an} value={an}>{an}</option>
          ))}
        </select>
        <span className="text-neutral-500 text-sm">
          {chargementCourses ? "..." : `${courses.length} Grands Prix`}
        </span>
      </section>

      {/* Carte du monde */}
      <section className="px-6 md:px-12 pb-14 max-w-[1400px] mx-auto">
        {chargementCourses ? (
          <div className="h-[550px] flex items-center justify-center text-neutral-500 bg-white rounded-3xl border border-neutral-200 text-lg">
            Chargement du calendrier {saison}...
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden p-2">
            <CarteMonde
              courses={courses}
              gpSelect={gpSelectionne ? `${saison}-${gpSelectionne.round}` : null}
              saison={saison}
              onSelect={setGpSelectionne}
              drapeaux={DRAPEAUX}
            />
          </div>
        )}
      </section>

      {/* Message si rien sélectionné */}
      {!gpSelectionne && !chargementCourses && (
        <p className="text-center text-neutral-500 text-base px-6 md:px-12 pb-20">
          Sélectionne un Grand Prix sur la carte pour afficher le classement 🏁
        </p>
      )}

      {/* Détail du GP sélectionné */}
      {gpSelectionne && (
        <section className="px-6 md:px-12 pb-20 max-w-[1100px] mx-auto">

          {/* Entête du GP */}
          <div className="bg-white rounded-3xl border border-neutral-200 p-8 md:p-10 mb-8">
            <div className="flex justify-between items-start flex-wrap gap-6">
              <div>
                <div className="flex gap-2 flex-wrap mb-4">
                  <span className="inline-block bg-neutral-900 text-white px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.1em]">
                    Manche {gpSelectionne.round} — {saison}
                  </span>
                  {estAVenir && (
                    <span className="inline-block border border-neutral-300 text-neutral-600 px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.1em]">
                      À venir
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-3xl md:text-[44px] mt-0 mb-3 leading-tight text-neutral-900">
                  {drapeauGp} {gpSelectionne.raceName}
                </h3>
                <p className="text-neutral-600 text-base md:text-lg m-0">
                  {gpSelectionne.Circuit?.circuitName}
                  {loc?.locality && ` • ${loc.locality}`}
                  {loc?.country && `, ${loc.country}`}
                </p>
                {gpSelectionne.date && (
                  <p className="text-neutral-500 text-sm mt-2 mb-0 font-medium">
                    {new Date(gpSelectionne.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    {gpSelectionne.time && ` — ${gpSelectionne.time.slice(0, 5)} UTC`}
                  </p>
                )}
              </div>

              <button
                onClick={() => setGpSelectionne(null)}
                className="px-6 py-2.5 rounded-full border border-neutral-300 bg-transparent text-neutral-600 text-sm font-medium uppercase tracking-wide cursor-pointer hover:border-neutral-900 hover:text-neutral-900 transition-colors"
              >
                Fermer
              </button>
            </div>

            {/* Liens circuit */}
            <div className="flex gap-3 flex-wrap mt-8">
              {gpSelectionne.Circuit?.url && (
                <a
                  href={gpSelectionne.Circuit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-neutral-900 text-white no-underline text-sm font-medium uppercase tracking-wide hover:bg-neutral-700 transition-colors"
                >
                  Voir le tracé du circuit →
                </a>
              )}
              {gpSelectionne.url && (
                <a
                  href={gpSelectionne.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full border border-neutral-300 bg-transparent text-neutral-700 no-underline text-sm font-medium uppercase tracking-wide hover:border-neutral-900 transition-colors"
                >
                  Résumé du Grand Prix →
                </a>
              )}
            </div>
          </div>

          {/* Podium */}
          {!chargementResultats && resultats.length >= 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8 items-end">
              {[1, 0, 2].map((idx, ordre) => {
                const r = resultats[idx];
                const medailles = ["1er", "2e", "3e"];
                const couleur = COULEURS_ECURIES[r?.Constructor?.constructorId] || "#171717";
                return (
                  <div
                    key={idx}
                    className={`bg-white rounded-3xl p-7 text-center border border-neutral-200 ${idx === 0 ? "sm:pb-10 sm:-mt-4" : ""}`}
                    style={{ order: ordre }}
                  >
                    <p className="text-[11px] uppercase tracking-[0.2em] text-neutral-400 mb-3 font-semibold">
                      {medailles[idx]} place
                    </p>
                    <div className="font-serif text-xl md:text-2xl mb-2 text-neutral-900">
                      <span className="text-neutral-500 font-normal">{r?.Driver?.givenName} </span>
                      {r?.Driver?.familyName}
                    </div>
                    <div
                      className="text-[12px] font-semibold uppercase tracking-[0.1em] mb-3"
                      style={{ color: couleur }}
                    >
                      {r?.Constructor?.name || "—"}
                    </div>
                    <div className="text-neutral-500 text-sm">
                      {r?.Time?.time || r?.status || "—"} • {r?.points ?? 0} pts
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Tableau des résultats */}
          <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-neutral-200">
              <h4 className="font-serif text-2xl m-0 text-neutral-900">
                Classement de la course
              </h4>
            </div>

            {chargementResultats ? (
              <p className="text-center text-neutral-500 text-base p-14">
                Chargement des résultats...
              </p>
            ) : resultats.length === 0 ? (
              <p className="text-center text-neutral-500 text-base p-14">
                {estAVenir
                  ? "Ce Grand Prix n'a pas encore eu lieu — reviens après la course !"
                  : "Résultats non disponibles pour ce Grand Prix"}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-base">
                  <thead>
                    <tr className="bg-[#f5f1e8]">
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
                      const couleur = COULEURS_ECURIES[r?.Constructor?.constructorId] || "#a3a3a3";
                      const pts = Number(r?.points) || 0;
                      return (
                        <tr
                          key={i}
                          className="border-t border-neutral-200 hover:bg-neutral-50 transition-colors"
                        >
                          <td className={`px-4 py-4 font-semibold text-base ${i < 3 ? "text-neutral-900" : "text-neutral-600"}`}>
                            {r?.position || "—"}
                          </td>
                          <td className="px-4 py-4">
                            <span className="text-neutral-500">{r?.Driver?.givenName} </span>
                            <strong className="text-neutral-900 font-semibold">{r?.Driver?.familyName}</strong>
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className="inline-block w-1 h-4 mr-2.5 align-middle rounded-sm"
                              style={{ background: couleur }}
                            />
                            <span className="text-neutral-700">{r?.Constructor?.name || "—"}</span>
                          </td>
                          <td className="px-4 py-4 text-neutral-500 font-medium">
                            {r?.grid || "—"}
                          </td>
                          <td className="px-4 py-4 text-neutral-500 whitespace-nowrap">
                            {r?.Time?.time || r?.status || "—"}
                          </td>
                          <td className={`px-4 py-4 text-center text-base ${pts > 0 ? "font-semibold text-neutral-900" : "font-normal text-neutral-400"}`}>
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
      <footer className="border-t border-neutral-300 px-6 md:px-12 py-8 text-neutral-500 text-sm text-center">
        © 2026 Carstocars — Passion automobile · Données{" "}
        <a href="https://api.jolpi.ca" target="_blank" rel="noopener noreferrer" className="text-neutral-900 underline hover:no-underline">
          Jolpica F1 API
        </a>
      </footer>

    </main>
  );
}
