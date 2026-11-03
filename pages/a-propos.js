import PageTexte from "../components/PageTexte";
import config from "../site.config";

export default function APropos() {
  return (
    <PageTexte
      chemin="/a-propos"
      titre="À propos de Carstocars"
      accroche="Un site pour comprendre l'automobile et le sport auto, avec des sources claires et des données ouvertes."
    >
      <h2>Notre mission</h2>
      <p>{config.nom} rassemble au même endroit l'actualité automobile, les fiches de plus de 90 constructeurs, le calendrier et les résultats des Grands Prix de Formule 1 depuis 2015, ainsi que le suivi de disciplines comme le WEC, le WRC, la Formule E ou le MotoGP.</p>
      <p>Notre objectif : rendre ces sujets accessibles, visuels et faciles à parcourir, sans jargon inutile.</p>

      <h2 id="ligne-editoriale">Ligne éditoriale</h2>
      <ul>
        <li><b>Les sources sont toujours citées.</b> Chaque analyse d'actualité indique l'article dont elle s'inspire et renvoie vers lui.</li>
        <li><b>Pas d'invention.</b> Nous ne publions pas de chiffre, de citation ou de fait qui ne figure pas dans la source. En cas de doute, nous ne le disons pas.</li>
        <li><b>Un ton neutre.</b> Pas de sensationnalisme, pas de rumeur présentée comme un fait.</li>
        <li><b>Les contenus sponsorisés seront signalés.</b> Si un partenariat ou une publicité apparaît un jour sur le site, il sera clairement identifié comme tel.</li>
      </ul>

      <h2>Utilisation de l'intelligence artificielle</h2>
      <p>Une partie de nos analyses est rédigée avec l'aide d'une intelligence artificielle, à partir d'une source citée et selon une trame fixe : un titre factuel, un chapeau, l'essentiel en quelques points, un contexte, puis la source. Ces articles portent une mention explicite en bas de page.</p>
      <p>Les articles sont publiés après une étape de validation. Si vous repérez une erreur, <a href="/contact">écrivez-nous</a> : nous corrigeons rapidement et indiquons la correction.</p>

      <h2>D'où viennent les données</h2>
      <ul>
        <li><b>Résultats, calendriers et classements de F1 :</b> API <a href="https://api.jolpi.ca" target="_blank" rel="noopener noreferrer">Jolpica F1</a>, successeur du projet Ergast.</li>
        <li><b>Présentations des marques et des modèles :</b> extraits de <a href="https://fr.wikipedia.org" target="_blank" rel="noopener noreferrer">Wikipédia</a>, disponibles sous licence CC BY-SA, avec un lien vers la page d'origine.</li>
        <li><b>Revue de presse de l'accueil :</b> titres et courts résumés issus des flux publics de médias spécialisés, avec un lien vers chaque article d'origine.</li>
        <li><b>Logos :</b> propriété de leurs détenteurs, affichés pour identifier les marques et les compétitions.</li>
      </ul>

      <h2>Contact et corrections</h2>
      <p>Une question, une correction, une proposition de partenariat ? Rendez-vous sur la page <a href="/contact">Contact</a>.</p>
    </PageTexte>
  );
}
