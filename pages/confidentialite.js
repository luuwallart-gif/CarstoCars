import PageTexte from "../components/PageTexte";
import config from "../site.config";

export default function Confidentialite() {
  return (
    <PageTexte chemin="/confidentialite" titre="Politique de confidentialité" accroche="Ce que le site fait, et ne fait pas, avec vos données.">
      <h2>En bref</h2>
      <p>{config.nom} ne demande aucune inscription, ne crée pas de compte et ne dépose pas de cookie publicitaire ou de mesure d'audience. Si cela change (publicité, statistiques), cette page sera mise à jour et un bandeau de consentement sera ajouté avant toute collecte.</p>

      <h2>Données traitées</h2>
      <ul>
        <li><b>Journaux techniques de l'hébergeur :</b> adresse IP, navigateur et pages demandées, conservés par {config.hebergeur.nom} pour assurer la sécurité et le bon fonctionnement du site.</li>
        <li><b>Services tiers appelés depuis votre navigateur :</b> pour afficher certains contenus, votre navigateur contacte directement l'API Jolpica (calendrier et résultats de F1), Wikipédia (présentations et photos des modèles), les tuiles de carte OpenStreetMap et Google Fonts (polices). Ces services reçoivent votre adresse IP selon leurs propres règles.</li>
        <li><b>Stockage local :</b> aucune donnée personnelle n'est enregistrée dans votre navigateur par le site.</li>
      </ul>

      <h2>Vos droits</h2>
      <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et d'effacement des données qui vous concernent. Pour les exercer, utilisez la page <a href="/contact">Contact</a>. Vous pouvez aussi saisir la CNIL (cnil.fr).</p>
    </PageTexte>
  );
}
