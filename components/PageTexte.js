import Layout from "./Layout";

/* Gabarit des pages de texte (à propos, mentions légales...) */
export default function PageTexte({ titre, accroche, chemin, description, children, noindex }) {
  return (
    <Layout titre={titre} accroche={accroche} seo={{ chemin, titre, description: description || accroche, noindex }}>
      <div className="wrap page-texte">{children}</div>
    </Layout>
  );
}

export function aCompleter(v) {
  return v ? v : <em className="a-completer">à compléter</em>;
}
