import { useState } from "react";
import Layout, { Reveal } from "../../components/Layout";
import Couverture from "../../components/Couverture";
import { tousLesArticles, resume } from "../../lib/articles";
import { dateFr } from "../../lib/articles-client";

export function getStaticProps() {
  return { props: { articles: tousLesArticles().map(resume) } };
}

export default function Actus({ articles }) {
  const categories = ["Tout", ...new Set(articles.map((a) => (a.type === "guide" ? "Guides" : a.categorie)))];
  const [cat, setCat] = useState("Tout");
  const liste = articles.filter((a) => cat === "Tout" || (a.type === "guide" ? "Guides" : a.categorie) === cat);

  return (
    <Layout
      actif="actus"
      eyebrow="Analyses et guides"
      titre="Les analyses Carstocars."
      accroche="L'essentiel de l'actualité auto et sport auto, expliqué clairement, avec la source à chaque fois."
      seo={{ chemin: "/actus", titre: "Analyses et guides auto et sport auto", description: "Analyses quotidiennes de l'actualité automobile et du sport auto, et guides pour comprendre la F1, le WEC, le WRC ou le MotoGP." }}
    >
      <div className="wrap">
        {categories.length > 2 && (
          <div className="bar">
            {categories.map((c) => (
              <button key={c} className={`chip${cat === c ? " on" : ""}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
        )}
        {liste.length === 0 && <p className="empty">Les premières analyses arrivent bientôt.</p>}
        <div className="grid">
          {liste.map((a, i) => (
            <Reveal key={a.slug} delay={(i % 3) * 0.06}>
              <a href={`/actus/${a.slug}`} className="card">
                <Couverture categorie={a.categorie} type={a.type} />
                <div className="body">
                  <span className="tag">{a.type === "guide" ? "Guide" : a.categorie} · {dateFr(a.date)}</span>
                  <h3>{a.titre}</h3>
                  <p>{a.chapeau}</p>
                  <span className="more">{a.minutes} min de lecture <i>→</i></span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </Layout>
  );
}
