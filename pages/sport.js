import { useState, useEffect } from 'react';
import Link from 'next/link';

// Les 8 compétitions avec leurs mots-clés de filtrage
const COMPETITIONS = [
  { id: 'f1', nom: 'F1', emoji: '🏎️', mots: ['formule 1', 'formula 1', 'f1', 'grand prix'] },
  { id: 'f2', nom: 'F2', emoji: '🏎️', mots: ['formule 2', 'formula 2', 'f2'] },
  { id: 'f3', nom: 'F3', emoji: '🏎️', mots: ['formule 3', 'formula 3', 'f3'] },
  { id: 'f4', nom: 'F4', emoji: '🏎️', mots: ['formule 4', 'formula 4', 'f4'] },
  { id: 'wrc', nom: 'WRC', emoji: '🌍', mots: ['wrc', 'rallye', 'rally'] },
  { id: 'gt', nom: 'GT World', emoji: '🏆', mots: ['gt world', 'gt3', 'gt world challenge'] },
  { id: 'wec', nom: 'WEC', emoji: '🏆', mots: ['wec', 'endurance', 'le mans', 'hypercar'] },
  { id: 'fe', nom: 'Formule E', emoji: '⚡', mots: ['formule e', 'formula e', 'formule-e'] },
];

export default function Sport() {
  const [actus, setActus] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [ongletActif, setOngletActif] = useState('f1');

  useEffect(() => {
    fetch('/api/news')
      .then((res) => res.json())
      .then((data) => {
        // On s'assure que data est bien un tableau
        setActus(Array.isArray(data) ? data : []);
        setChargement(false);
      })
      .catch(() => setChargement(false));
  }, []);

  // On récupère la compétition sélectionnée
  const competition = COMPETITIONS.find((c) => c.id === ongletActif);

  // On filtre les actus selon les mots-clés (avec les BONS noms de champs !)
  const actusFiltrees = actus.filter((article) => {
    const texte = ((article.titre || '') + ' ' + (article.resume || '')).toLowerCase();
    return competition.mots.some((mot) => texte.includes(mot));
  });

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', fontFamily: 'system-ui, sans-serif' }}>
      {/* Barre de navigation */}
      <nav style={{ padding: '20px 40px', borderBottom: '1px solid #222', display: 'flex', gap: '30px', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold', fontSize: '20px' }}>
          Carstocars
        </Link>
        <Link href="/" style={{ color: '#aaa', textDecoration: 'none' }}>Accueil</Link>
        <Link href="/sport" style={{ color: '#e10600', textDecoration: 'none', fontWeight: 'bold' }}>Compétitions</Link>
      </nav>

      {/* Titre */}
      <div style={{ padding: '40px 40px 20px' }}>
        <h1 style={{ fontSize: '32px', margin: 0 }}>Compétitions</h1>
        <p style={{ color: '#888', marginTop: '8px' }}>Les actus de tes championnats préférés</p>
      </div>

      {/* Onglets */}
      <div style={{ padding: '0 40px', display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '30px' }}>
        {COMPETITIONS.map((c) => (
          <button
            key={c.id}
            onClick={() => setOngletActif(c.id)}
            style={{
              padding: '10px 20px',
              borderRadius: '25px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '15px',
              background: ongletActif === c.id ? '#e10600' : '#1a1a1a',
              color: '#fff',
              transition: 'background 0.2s',
            }}
          >
            {c.nom}
          </button>
        ))}
      </div>

      {/* Liste des actus */}
      <div style={{ padding: '0 40px 60px' }}>
        {chargement ? (
          <p style={{ color: '#888' }}>Chargement des actus...</p>
        ) : actusFiltrees.length === 0 ? (
          <div style={{ background: '#1a1a1a', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
            <p style={{ fontSize: '18px', margin: 0 }}>
              Aucune actu {competition.nom} pour le moment
            </p>
            <p style={{ color: '#888', marginTop: '10px' }}>
              Reviens plus tard, les news se mettent à jour tous les jours !
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
            {actusFiltrees.map((article, i) => (
              <a
                key={i}
                href={article.lien}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', color: '#fff', background: '#1a1a1a', borderRadius: '12px', overflow: 'hidden' }}
              >
                {article.image && (
                  <img src={article.image} alt={article.titre} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                )}
                <div style={{ padding: '20px' }}>
                  <h3 style={{ margin: '0 0 10px', fontSize: '17px', lineHeight: '1.4' }}>{article.titre}</h3>
                  <p style={{ color: '#888', fontSize: '13px', margin: 0 }}>{article.source}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
