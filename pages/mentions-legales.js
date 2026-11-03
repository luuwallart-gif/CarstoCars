import PageTexte, { aCompleter } from "../components/PageTexte";
import config from "../site.config";

export default function Mentions() {
  const e = config.editeur, h = config.hebergeur;
  return (
    <PageTexte chemin="/mentions-legales" titre="Mentions légales" accroche="Informations légales relatives à l'édition et à l'hébergement du site." noindex={!e.nom}>
      <h2>Éditeur du site</h2>
      <ul>
        <li>Nom ou raison sociale : {aCompleter(e.nom)}</li>
        <li>Statut : {aCompleter(e.statut)}</li>
        <li>Adresse : {aCompleter(e.adresse)}</li>
        <li>Contact : {e.email ? <a href={`mailto:${e.email}`}>{e.email}</a> : aCompleter("")}</li>
        <li>Directeur de la publication : {aCompleter(e.directeurPublication)}</li>
      </ul>

      <h2>Hébergeur</h2>
      <p>{h.nom}, {h.adresse}. <a href={h.site} target="_blank" rel="noopener noreferrer">{h.site}</a></p>

      <h2>Propriété intellectuelle</h2>
      <p>Les textes originaux, la conception et le code de {config.nom} sont protégés. Les logos, noms de marques, photographies de véhicules et de compétitions appartiennent à leurs propriétaires respectifs et sont utilisés à titre d'information pour identifier les marques et les disciplines. Les extraits de Wikipédia sont reproduits sous licence CC BY-SA 4.0 avec indication de la source.</p>
      <p>Les titres et résumés de la revue de presse renvoient vers les articles des sites d'origine, qui restent seuls propriétaires de leurs contenus.</p>

      <h2>Responsabilité</h2>
      <p>Nous apportons le plus grand soin aux informations publiées, mais elles peuvent contenir des erreurs ou évoluer. Les données sportives proviennent de services tiers. Pour toute erreur, voir la page <a href="/contact">Contact</a>.</p>
    </PageTexte>
  );
}
