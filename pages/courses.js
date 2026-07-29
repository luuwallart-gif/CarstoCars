import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const CarteMonde = dynamic(() => import('../components/CarteMonde'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
      Chargement de la carte...
    </div>
  ),
});

// Nom du fichier SVG sur Wikimedia Commons pour chaque circuit
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
  nurburgring: 'Nurburgring_-_Grand-Prix-Strecke.svg',
  mugello: 'Mugello_Racing_Circuit_track_map.svg',
  portimao: 'Algarve_International_Circuit.svg',
  hockenheimring: 'Hockenheim.svg',
  sepang: 'Sepang_International_Circuit.svg',
  buddh: 'Buddh_International_Circuit.svg',
  yeongam: 'Korean_International_Circuit.svg',
  valencia: 'Valencia_Street_Circuit_2008.svg',
};

const COULEURS_ECURIES = {
  ferrari: '#DC0000',
  mercedes: '#00D2BE',
  red_bull: '#0600EF',
  mclaren: '#FF8700',
  alpine: '#0090FF',
  aston_martin: '#006F62',
  williams: '#005AFF',
  rb: '#6692FF',
  sauber: '#52E252',
  haas: '#B6BABD',
  alphatauri: '#2B4562',
  alfa: '#900000',
  renault: '#FFF500',
  racing_point: '#F596C8',
  toro_rosso: '#469BFF',
  force_india: '#F596C8',
  lotus_f1: '#FFB800',
  manor: '#323232',
};

export default function Courses() {
  const [saison, setSaison] = useState('2025');
  const [courses, setCourses] = useState([]);
  const [gpSelectionne, setGpSelectionne] = useState(null);
  const [resultats, setResultats] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [urlTrace, setUrlTrace] = useState(null);

  const saisons = [];
  for (let a = 2025; a >= 2015; a--) saisons.push(String(a));

  // Charger le calendrier de la saison
  useEffect(() => {
    setCourses([]);
    setGpSelectionne(null);
    setResultats([]);
    setUrlTrace(null);

    fetch(`https://api.jolpi.ca/ergast/f1/${saison}/races/?format=json&limit=100`)
      .then((r) => r.json())
      .then((d) => {
        setCourses(d?.MRData?.RaceTable?.Races || []);
      })
      .catch(() => setCourses([]));
  }, [saison]);

  // Récupérer l'URL réelle du tracé via l'API Wikimedia
  useEffect(() => {
    if (!gpSelectionne) return;

    const fichier = FICHIERS_TRACES[gpSelectionne.Circuit.circuitId];
    if (!fichier) {
      setUrlTrace(null);
      return;
    }

    setUrlTrace(null);

    fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(
        fichier
      )}&prop=imageinfo&iiprop=url&iiurlwidth=500&format=json&origin=*`
    )
      .then((r) => r.json())
      .then((d) => {
        const pages = d?.query?.pages || {};
        const premiere = Object.values(pages)[0];
        const url = premiere?.imageinfo?.[0]?.thumburl || null;
        setUrlTrace(url);
      })
      .catch(() => setUrlTrace(null));
  }, [gpSelectionne]);

  // Charger les résultats d'un GP
  const chargerResultats = (course) => {
    setGpSelectionne(course);
    setResultats([]);
    setChargement(true);

    fetch(
      `https://api.jolpi.ca/ergast/f1/${saison}/${course.round}/results/?format=json&limit=100`
    )
      .then((r) => r.json())
      .then((d) => {
        setResultats(d?.MRData?.RaceTable?.Races?.[0]?.Results || []);
        setChargement(false);
      })
      .catch(() => setChargement(false));
  };

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh', padding: '30px 20px', color: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>
          🏁 Grands Prix de Formule 1
        </h1>
        <p style={{ color: '#888', marginBottom: '25px' }}>
          Clique sur un point de la carte pour voir les résultats de la course.
        </p>

        {/* Sélecteur de saison */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ marginRight: '10px', color: '#aaa' }}>Saison :</label>
          <select
            value={saison}
            onChange={(e) => setSaison(e.target.value)}
            style={{
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #333',
              borderRadius: '6px',
              padding: '8px 14px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            {saisons.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        {/* Carte */}
        <div
          style={{
            border: '1px solid #222',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '10px',
          }}
        >
          <CarteMonde courses={courses} onSelect={chargerResultats} />
        </div>

        {courses.length > 0 && (
          <p style={{ color: '#666', fontSize: '0.85rem', marginBottom: '30px' }}>
            {courses.length} Grands Prix en {saison}
          </p>
        )}

        {/* Résultats + tracé */}
        {gpSelectionne && (
          <div
            style={{
              display: 'flex',
              gap: '30px',
              flexWrap: 'wrap',
              background: '#111',
              border: '1px solid #222',
              borderRadius: '12px',
              padding: '25px',
            }}
          >
            {/* Colonne gauche : infos + tracé */}
            <div style={{ flex: '0 0 300px', minWidth: '260px' }}>
              <h2 style={{ fontSize: '1.3rem', margin: '0 0 8px' }}>
                {gpSelectionne.raceName}
              </h2>
              <p style={{ color: '#888', fontSize: '0.9rem', margin: '0 0 6px' }}>
                {gpSelectionne.Circuit.circuitName}
              </p>
              <p style={{ color: '#666', fontSize: '0.85rem', margin: '0 0 18px' }}>
                📍 {gpSelectionne.Circuit.Location.locality}, {gpSelectionne.Circuit.Location.country}
                <br />
                📅 {new Date(gpSelectionne.date).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
                <br />
                🔢 Manche {gpSelectionne.round}
              </p>

              {urlTrace ? (
                <img
                  src={urlTrace}
                  alt={`Tracé du ${gpSelectionne.Circuit.circuitName}`}
                  style={{
                    width: '100%',
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '12px',
                    boxSizing: 'border-box',
                  }}
                />
              ) : (
                <div
                  style={{
                    background: '#1a1a1a',
                    border: '1px dashed #333',
                    borderRadius: '8px',
                    padding: '30px 15px',
                    textAlign: 'center',
                    color: '#555',
                    fontSize: '0.85rem',
                  }}
                >
                  Tracé non disponible
                </div>
              )}
            </div>

            {/* Colonne droite : résultats */}
            <div style={{ flex: '1 1 420px', minWidth: '300px' }}>
              {chargement ? (
                <p style={{ color: '#888' }}>Chargement des résultats...</p>
              ) : resultats.length === 0 ? (
                <p style={{ color: '#888' }}>
                  Pas encore de résultats pour ce Grand Prix.
                </p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #333', color: '#888', textAlign: 'left' }}>
                        <th style={{ padding: '10px 8px' }}>Pos</th>
                        <th style={{ padding: '10px 8px' }}>Pilote</th>
                        <th style={{ padding: '10px 8px' }}>Écurie</th>
                        <th style={{ padding: '10px 8px' }}>Temps</th>
                        <th style={{ padding: '10px 8px', textAlign: 'center' }}>Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultats.map((r) => {
                        const couleur = COULEURS_ECURIES[r.Constructor.constructorId] || '#666';
                        const podium = ['#FFD700', '#C0C0C0', '#CD7F32'][parseInt(r.position) - 1];
                        return (
                          <tr key={r.position} style={{ borderBottom: '1px solid #1e1e1e' }}>
                            <td
                              style={{
                                padding: '10px 8px',
                                fontWeight: 'bold',
                                color: podium || '#fff',
                              }}
                            >
                              {r.positionText}
                            </td>
                            <td style={{ padding: '10px 8px' }}>
                              {r.Driver.givenName} <strong>{r.Driver.familyName}</strong>
                            </td>
                            <td style={{ padding: '10px 8px' }}>
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
                              <span style={{ color: '#bbb' }}>{r.Constructor.name}</span>
                            </td>
                            <td style={{ padding: '10px 8px', color: '#aaa', whiteSpace: 'nowrap' }}>
                              {r.Time?.time || r.status}
                            </td>
                            <td
                              style={{
                                padding: '10px 8px',
                                textAlign: 'center',
                                fontWeight: r.points > 0 ? 'bold' : 'normal',
                                color: r.points > 0 ? '#fff' : '#555',
                              }}
                            >
                              {r.points}
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

        {!gpSelectionne && courses.length > 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#555',
              border: '1px dashed #222',
              borderRadius: '12px',
            }}
          >
            👆 Sélectionne un Grand Prix sur la carte
          </div>
        )}

      </div>
    </div>
  );
}
