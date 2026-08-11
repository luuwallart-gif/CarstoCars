import Head from 'next/head';
import dynamic from 'next/dynamic';

const F1Scene = dynamic(() => import('../components/F1Scene'), {
  ssr: false,
  loading: () => <p style={{ color: 'white' }}>Chargement de la voiture...</p>
});

export default function F1Page() {
  return (
    <>
      <Head>
        <title>Ma F1 en 3D</title>
      </Head>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%)',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '1rem',
          color: '#e10600',
          textAlign: 'center'
        }}>
          🏎️ Ma Formule 1
        </h1>
        <p style={{ marginBottom: '2rem', opacity: 0.7 }}>
          Clique et fais glisser pour tourner autour du modèle
        </p>
        <F1Scene />
      </div>
    </>
  );
}
