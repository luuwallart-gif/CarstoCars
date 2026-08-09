// pages/courses.js
import { useState } from 'react';
import Head from 'next/head';
import WorldMap from '../components/WorldMap'; // ton composant carte existant

const RACES = [
  { id: 1, name: 'Bahrein', country: 'Bahrein', date: '2026-03-08', lat: 26.03, lng: 50.51, done: true },
  { id: 2, name: 'Jeddah', country: 'Arabie Saoudite', date: '2026-03-15', lat: 21.63, lng: 39.10, done: true },
  { id: 3, name: 'Melbourne', country: 'Australie', date: '2026-03-22', lat: -37.84, lng: 144.97, done: false },
  // ... reste de tes courses
];

export default function Courses() {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <Head>
        <title>Calendrier — Carsto</title>
      </Head>

      <main className="min-h-screen bg-black text-white">
        {/* HERO */}
        <section className="px-6 pt-32 pb-20 max-w-5xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-white/50 mb-6">
            Saison 2026
          </p>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
            Calendrier
          </h1>
          <p className="mt-6 text-white/60 text-lg max-w-xl mx-auto">
            24 Grands Prix. Un monde. Une seule vitesse.
          </p>
        </section>

        {/* CARTE DU MONDE */}
        <section className="px-6 pb-32 max-w-6xl mx-auto">
          <div className="border border-white/10 rounded-3xl p-4 md:p-10 bg-white/[0.02]">
            <WorldMap
              races={RACES}
              onSelect={(race) => setSelected(race)}
            />
          </div>

          {selected && (
            <div className="mt-8 border border-white/10 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start gap-6 bg-white/[0.02]">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-white/40 mb-2">
                  {selected.country}
                </p>
                <h3 className="text-3xl font-bold">{selected.name}</h3>
                <p className="text-white/50 mt-2">
                  {new Date(selected.date).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
              {selected.done ? (
                <a
                  href={`/resultats/${selected.id}`}
                  className="border border-white/20 hover:bg-white hover:text-black transition-all px-6 py-3 rounded-full text-sm uppercase tracking-widest"
                >
                  Voir les résultats
                </a>
              ) : (
                <span className="text-white/30 text-sm uppercase tracking-widest px-6 py-3">
                  À venir
                </span>
              )}
            </div>
          )}
        </section>

        {/* LISTE DES COURSES */}
        <section className="px-6 pb-32 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 tracking-tight">
            Tous les Grands Prix
          </h2>

          <div className="divide-y divide-white/10">
            {RACES.map((race, i) => (
              <button
                key={race.id}
                onClick={() => setSelected(race)}
                className="w-full flex items-center justify-between py-6 group hover:bg-white/[0.02] transition-all px-2 -mx-2 rounded-lg"
              >
                <div className="flex items-center gap-6">
                  <span className="text-white/30 text-sm w-6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="text-left">
                    <p className="font-bold text-lg group-hover:translate-x-1 transition-transform">
                      {race.name}
                    </p>
                    <p className="text-white/40 text-sm">{race.country}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <span className="text-white/50 text-sm">
                    {new Date(race.date).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'short'
                    })}
                  </span>
                  <span
                    className={`text-xs uppercase tracking-widest px-3 py-1 rounded-full border ${
                      race.done
                        ? 'border-white/20 text-white/40'
                        : 'border-white text-white'
                    }`}
                  >
                    {race.done ? 'Terminé' : 'À venir'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
