import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const CarteMonde = dynamic(() => import('../components/CarteMonde'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '550px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
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
};

const COULEURS_ECURIES = {
  red_bull: "#3671C6", ferrari: "#E8002D", mercedes: "#27F4D2",
  mclaren: "#FF8000", aston_martin: "#229971", alpine: "#0093CC",
  williams: "#64C4FF", rb: "#6692FF", alphatauri: "#5E8FAA",
  sauber: "#52E252", alfa: "#C92D4B", haas: "#B6BABD",
  racing_point: "#F596C8", renault: "#FFF500", toro_rosso: "#469BFF",
  force_india: "#F596C8", lotus_f1: "#FFB800", manor: "#6E0000",
};

const FICHIERS_TRACES = {
  bahrain: 'Bahrain_International_Circuit--Grand_Prix_Layout.svg',
  jeddah: 'Jeddah_Street_Circuit_2021.svg',
  albert_park: 'Albert_Park_Circuit_2021.svg',
  suzuka: 'Suzuka_circuit_map--2005.svg',
  shanghai: 'Shanghai_International_Racing_Circuit_track_map.svg',
  miami: 'Miami_International_Autodrome_2022.svg',
  imola: 'Imola_2009.svg',
  monaco: 'Circuit_Monaco.svg',
  villeneuve: 'Circuit_Gilles_Villeneuve.svg',
  catalunya: 'Circuit_de_Barcelona-Catalunya_2021.svg',
  red_bull_ring: 'Red_Bull_Ring_2022.svg',
  silverstone: 'Silverstone_Circuit_2020.svg',
  hungaroring: 'Hungaroring.svg',
  spa: 'Circuit_Spa_2007.svg',
  zandvoort: 'Circuit_Zandvoort_2020.svg',
  monza: 'Monza_track_map.svg',
  baku: 'Baku_Formula_One_circuit_map.svg',
  marina_bay: 'Singapore_Street_Circuit_2023.svg',
  americas: 'Circuit_of_the_Americas.svg',
  rodriguez: 'Autodromo_Hermanos_Rodriguez_2015.svg',
  interlagos: 'Interlagos_2000_version.svg',
  vegas: 'Las_Vegas_Grand_Prix_Circuit.svg',
  losail: 'Losail_International_Circuit_2023.svg',
  yas_marina: 'Yas_Marina_Circuit_2021.svg',
  ricard: 'Circuit_Paul_Ricard_2018.svg',
  sochi: 'Sochi_Autodrom_2014.svg',
  istanbul: 'Istanbul_park.svg',
  hockenheimring: 'Hockenheimring_2002.svg',
  portimao: 'Algarve_International_Circuit.svg',
  sepang: 'Sepang_International_Circuit.svg',
  nurburgring: 'Nurburgring_-_Grand-Prix-Strecke.svg',
  mugello: 'Mugello_Racing_Circuit_track_map.svg',
  buddh: 'Buddh_International_Circuit--2011.svg',
  yeongam: 'Korean_International_Circuit.svg',
};

export default function Courses() {
  const [saison, setSaison] = useState(2025);
  const [courses, setCourses] = useState([]);
  const [gpSelectionne, setGpSelectionne] = useState(null);
  const [resultats, setResultats] = useState([]);
  const [urlTrace, setUrlTrace] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [chargementResultats, setChargementResultats] = useState(false);

  // Charge le calendrier de la saison
  useEffect(() => {
    setChargement(true);
    setGpSelectionne(null);
    setResultats([]);

    fetch(`https://api.jolpi.ca/ergast/f1/${saison}/races/?format=json&limit=100`)
      .then((r) => r.json())
      .then((d) => {
        setCourses(d?.MRData?.RaceTable?.Races || []);
        setChargement(false);
      })
      .catch(() => {
        setCourses([]);
        setChargement(false);
      });
  }, [saison]);

  // Charge les résultats du GP sélectionné
  useEffect(() => {
    if (!gpSelectionne?.round) {
      setResultats([]);
      return;
    }

    setChargementResultats(true);

    fetch(`https://api.jolpi.ca/ergast/f1/${saison}/${gpSelectionne.round}/results/?format=json&limit=100`)
      .then((r) => r.json())
      .then((d) => {
        const race = d?.MRData?.RaceTable?.Races?.[0];
        setResultats(race?.Results || []);
        setChargementResultats(false);
      })
      .catch(() => {
        setResultats([]);
        setChargementResultats(false);
      });
  }, [gpSelectionne, saison]);

  // Récupère le tracé du circuit via Wikimedia Commons
  useEffect(() => {
    const circuitId = gpSelectionne?.Circuit?.circuitId;
    setUrlTrace(null);

    if (!circuitId) return;

    const fichier = FICHIERS_TRACES[circuitId];
    if (!fichier) return;

    fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(
        fichier
      )}&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json&origin=*`
    )
      .then((r) => r.json())
      .then((d) => {
        const pages = d?.query?.pages || {};
        const premiere = Object.values(pages)[0];
        setUrlTrace(premiere?.imageinfo?.[0]?.thumburl || null);
      })
      .catch(() => setUrlTrace(null));
  }, [gpSelectionne]);

  const annees = [];
  for (let a = 2025; a >= 2015; a--) annees.push(a);

  const loc = gpSelectionne?.Circuit?.Location;

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', color: '#fff', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* En-tête */}
        <h1 style={{ fontSize: '2.2rem', margin: '0 0 8px', fontWeight: 800 }}>
          🏁 Grands Prix
        </h1>
        <p style={{ color: '#888', margin: '0 0 24px' }}>
          Clique sur un point de la carte pour voir les résultats de la course.
        </p>

        {/* Sélecteur de saison */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {annees.map((a) => (
            <button
              key={a}
              onClick={() => setSaison(a)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid ' + (saison === a ? '#e10600' : '#2a2a2a'),
                background: saison === a ? '#e10600' : 'transparent',
                color: saison === a ? '#fff' : '#999',
                cursor: 'pointer',
                fontWeight: saison === a ? 700 : 500,
                fontSize: '0.9rem',
                transition: 'all 0.15s',
              }}
            >
              {a}
            </button>
          ))}
        </div>

        {/* Carte */}
        {chargement ? (
          <div style={{ height: '550px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
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

        {/* Message d'invitation */}
        {!gpSelectionne && !chargement && courses.length > 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              marginTop: '24px',
              color: '#555',
              border: '1px dashed #222',
              borderRadius: '12px',
            }}
          >
            👆 Sélectionne un Grand Prix sur la carte
          </div>
        )}

        {/* Détails du GP sélectionné */}
        {gpSelectionne && (
          <div
            style={{
              marginTop: '32px',
              display: 'flex',
              gap: '32px',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
            }}
          >
            {/* Colonne gauche : infos + tracé */}
            <div style={{ flex: '0 0 300px', minWidth: '260px' }}>
              <h2 style={{ fontSize: '1.4rem', margin: '0 0 8px', fontWeight: 700 }}>
                {DRAPEAUX[loc?.country] || '🏁'} {gpSelectionne?.raceName || 'Grand Prix'}
              </h2>
              <p style={{ color: '#888', fontSize: '0.9rem', margin: '0 0 6px' }}>
                {gpSelectionne?.Circuit?.circuitName || ''}
              </p>
              <p style={{ color: '#666', fontSize: '0.85rem', margin: '0 0 18px', lineHeight: 1.7 }}>
                {loc && (
                  <>
                    📍 {loc.locality}, {loc.country}
                    <br />
                  </>
                )}
                {gpSelectionne?.date && (
                  <>
                    📅{' '}
                    {new Date(gpSelectionne.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    <br />
                  </>
                )}
                {gpSelectionne?.round && <>🔢 Manche {gpSelectionne.round}</>}
              </p>

              {urlTrace ? (
                <div
                  style={{
                    background: '#111',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #1e1e1e',
                  }}
                >
                  <img
                    src={urlTrace}
                    alt={`Tracé de ${gpSelectionne?.Circuit?.circuitName || 'circuit'}`}
                    style={{
                      width: '100%',
                      height: 'auto',
                      filter: 'invert(1) brightness(1.1)',
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{
                    background: '#111',
                    borderRadius: '12px',
                    padding: '30px 16px',
                    border: '1px dashed #222',
                    textAlign: 'center',
                    color: '#444',
                    fontSize: '0.85rem',
                  }}
                >
                  Tracé non disponible
                </div>
              )}
            </div>

            {/* Colonne droite : résultats */}
            <div style={{ flex: 1, minWidth: '320px' }}>
              <h3 style={{ fontSize: '1.1rem', margin: '0 0 16px', color: '#aaa', fontWeight: 600 }}>
                Résultats de la course
              </h3>

              {chargementResultats ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  Chargement des résultats...
                </div>
              ) : resultats.length === 0 ? (
                <div
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#555',
                    border: '1px dashed #222',
                    borderRadius: '12px',
                  }}
                >
                  Aucun résultat disponible pour cette course.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #222', color: '#666', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <th style={{ padding: '10px 8px', textAlign: 'left' }}>Pos</th>
                        <th style={{ padding: '10px 8px', textAlign: 'left' }}>Pilote</th>
                        <th style={{ padding: '10px 8px', textAlign: 'left' }}>Écurie</th>
                        <th style={{ padding: '10px 8px', textAlign: 'left' }}>Temps</th>
                        <th style={{ padding: '10px 8px', textAlign: 'center' }}>Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultats.map((r, i) => {
                        const couleur = COULEURS_ECURIES[r?.Constructor?.constructorId] || '#666';
                        const podium = ['#FFD700', '#C0C0C0', '#CD7F32'][parseInt(r?.position) - 1];
                        return (
                          <tr key={r?.position || i} style={{ borderBottom: '1px solid #1a1a1a' }}>
                            <td style={{ padding: '11px 8px', fontWeight: 'bold', color: podium || '#fff' }}>
                              {r?.positionText || '-'}
                            </td>
                            <td style={{ padding: '11px 8px' }}>
                              <span style={{ color: '#888' }}>{r?.Driver?.givenName}</span>{' '}
                              <strong>{r?.Driver?.familyName}</strong>
                            </td>
                            <td style={{ padding: '11px 8px' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  width: '3px',
                                  height: '14px',
                                  background: couleur,
                                  marginRight: '8px',
                                  verticalAlign: 'middle',
                                  borderRadius: '2px',
                                }}
                              />
                              <span style={{ color: '#bbb' }}>{r?.Constructor?.name || '—'}</span>
                            </td>
                            <td style={{ padding: '11px 8px', color: '#aaa', whiteSpace: 'nowrap' }}>
                              {r?.Time?.time || r?.status || '—'}
                            </td>
                            <td
                              style={{
                                padding: '11px 8px',
                                textAlign: 'center',
                                fontWeight: Number(r?.points) > 0 ? 'bold' : 'normal',
                                color: Number(r?.points) > 0 ? '#fff' : '#555',
                              }}
                            >
                              {r?.points ?? '0'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
