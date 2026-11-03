import CompLogo from "./CompLogo";
import { LOGOS_CATEGORIE } from "../lib/articles-client";

/* Couverture d'article : aucune photo, donc aucun droit à gérer. Le logo de la compétition et un fond coloré. */
export default function Couverture({ categorie, type, grand }) {
  const logo = LOGOS_CATEGORIE[categorie];
  return (
    <div className={`couv${grand ? " grand" : ""}`}>
      <span className="couv-cat">{type === "guide" ? "Guide" : categorie}</span>
      {logo ? <CompLogo id={logo} hauteur={grand ? 40 : 30} /> : <span className="couv-marque">cars<b>to</b>cars</span>}
    </div>
  );
}
