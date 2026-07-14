// Liste des articles (pour l'instant écrits à la main)
const articles = [
  {
    titre: "Ferrari dévoile sa nouvelle supercar hybride",
    resume: "La marque italienne repousse les limites avec un V8 hybride de plus de 1000 chevaux.",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600",
    source: "Auto Moto",
    lien: "https://www.automoto.fr",
  },
  {
    titre: "Nouvelle réglementation F1 pour 2026",
    resume: "Les moteurs deviennent plus électriques et les carburants 100% durables.",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600",
    source: "Motorsport",
    lien: "https://www.motorsport.com",
  },
  {
    titre: "Les meilleures voitures électriques de 2026",
    resume: "Notre comparatif des modèles électriques qui marquent l'année.",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600",
    source: "Caradisiac",
    lien: "https://www.caradisiac.com",
  },
];

export default function Home() {
  return (
    <main style={{ backgroundColor: "#111", color: "#fff", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>

      {/* Barre du haut */}
      <header style={{ padding: "20px 40px", borderBottom: "2px solid #e10600", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
        <h1 style={{ color: "#e10600", margin: 0 }}>🏎️ Carstocars</h1>
        <nav>
          <a href="/" style={{ color: "#fff", marginRight: "20px", textDecoration: "none" }}>Accueil</a>
          <a href="/auto" style={{ color: "#fff", marginRight: "20px", textDecoration: "none" }}>Automobile</a>
          <a href="/sport" style={{ color: "#fff", textDecoration: "none" }}>Sport Auto</a>
        </nav>
      </header>

      {/* Titre de section */}
      <section style={{ padding: "40px 40px 20px" }}>
        <h2 style={{ fontSize: "28px" }}>📰 Les dernières actualités</h2>
        <p style={{ color: "#aaa" }}>L'essentiel du monde automobile, mis à jour régulièrement.</p>
      </section>

      {/* Grille de cartes */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px", padding: "0 40px 60px" }}>
        {articles.map((article, i) => (
          <a
            key={i}
            href={article.lien}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <div style={{ backgroundColor: "#1c1c1c", borderRadius: "12px", overflow: "hidden", border: "1px solid #333", height: "100%" }}>
              <img
                src={article.image}
                alt={article.titre}
                style={{ width: "100%", height: "180px", objectFit: "cover" }}
              />
              <div style={{ padding: "16px" }}>
                <h3 style={{ margin: "0 0 10px", fontSize: "18px" }}>{article.titre}</h3>
                <p style={{ color: "#bbb", fontSize: "14px", margin: "0 0 12px" }}>{article.resume}</p>
                <span style={{ color: "#e10600", fontSize: "13px", fontWeight: "bold" }}>
                  Source : {article.source} →
                </span>
              </div>
            </div>
          </a>
        ))}
      </section>

      {/* Bas de page */}
      <footer style={{ borderTop: "1px solid #333", padding: "20px 40px", color: "#666", fontSize: "13px" }}>
        © 2026 Carstocars — Passion automobile
      </footer>

    </main>
  );
}
