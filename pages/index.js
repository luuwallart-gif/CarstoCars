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
    <main style={{ background: "linear-gradient(180deg, #0a0e1a 0%, #141b2e 100%)", color: "#fff", minHeight: "100vh", fontFamily: "'Rajdhani', sans-serif" }}>

      {/* Barre du haut */}
      <header style={{ padding: "20px 40px", background: "rgba(10,14,26,0.8)", borderBottom: "3px solid #00d4ff", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", position: "sticky", top: 0, zIndex: 10, backdropFilter: "blur(10px)" }}>
        <h1 style={{ fontFamily: "'Racing Sans One', cursive", background: "linear-gradient(90deg, #00d4ff, #e10600)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0, fontSize: "32px", letterSpacing: "1px" }}>CARSTOCARS</h1>
        <nav style={{ fontSize: "18px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
          <a href="/" style={{ color: "#fff", marginRight: "24px", textDecoration: "none" }}>Accueil</a>
          <a href="/auto" style={{ color: "#fff", marginRight: "24px", textDecoration: "none" }}>Automobile</a>
          <a href="/sport" style={{ color: "#fff", textDecoration: "none" }}>Sport Auto</a>
        </nav>
      </header>

      {/* Bandeau titre */}
      <section style={{ padding: "60px 40px 30px", textAlign: "center" }}>
        <h2 style={{ fontFamily: "'Racing Sans One', cursive", fontSize: "48px", margin: "0 0 10px", textTransform: "uppercase" }}>
          Dernières <span style={{ color: "#e10600" }}>Actualités</span>
        </h2>
        <p style={{ color: "#8b9bb4", fontSize: "18px", margin: 0 }}>L'essentiel du monde automobile, mis à jour régulièrement</p>
        <div style={{ width: "80px", height: "4px", background: "linear-gradient(90deg, #00d4ff, #e10600)", margin: "20px auto 0", borderRadius: "2px" }}></div>
      </section>

      {/* Grille de cartes */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "28px", padding: "20px 40px 60px", maxWidth: "1200px", margin: "0 auto" }}>
        {articles.map((article, i) => (
          <a
            key={i}
            href={article.lien}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <div style={{ background: "#141b2e", borderRadius: "16px", overflow: "hidden", border: "1px solid #253150", height: "100%", boxShadow: "0 8px 30px rgba(0,0,0,0.4)" }}>
              <div style={{ position: "relative" }}>
                <img
                  src={article.image}
                  alt={article.titre}
                  style={{ width: "100%", height: "190px", objectFit: "cover", display: "block" }}
                />
                <span style={{ position: "absolute", top: "12px", left: "12px", background: "#e10600", color: "#fff", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {article.source}
                </span>
              </div>
              <div style={{ padding: "18px" }}>
                <h3 style={{ margin: "0 0 10px", fontSize: "20px", fontWeight: "700", lineHeight: "1.3" }}>{article.titre}</h3>
                <p style={{ color: "#8b9bb4", fontSize: "15px", margin: "0 0 14px", lineHeight: "1.5" }}>{article.resume}</p>
                <span style={{ color: "#00d4ff", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Lire l'article →
                </span>
              </div>
            </div>
          </a>
        ))}
      </section>

      {/* Bas de page */}
      <footer style={{ borderTop: "1px solid #253150", padding: "24px 40px", color: "#5a6b8c", fontSize: "14px", textAlign: "center" }}>
        © 2026 Carstocars — Passion automobile
      </footer>

    </main>
  );
}
