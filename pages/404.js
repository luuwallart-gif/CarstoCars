import Layout from "../components/Layout";

export default function NonTrouvee() {
  return (
    <Layout titre="Page introuvable." accroche="Cette page n'existe pas ou a changé d'adresse." seo={{ titre: "Page introuvable", noindex: true, chemin: "/404" }}>
      <div className="wrap" style={{ paddingTop: 8 }}>
        <div className="bar">
          <a className="btn" href="/">Retour à l'accueil</a>
          <a className="btn ghost" href="/actus">Voir les analyses</a>
          <a className="btn ghost" href="/auto">Explorer les marques</a>
        </div>
      </div>
    </Layout>
  );
}
