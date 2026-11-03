import PageTexte from "../components/PageTexte";
import config from "../site.config";

export default function Contact() {
  const email = config.editeur.email;
  return (
    <PageTexte chemin="/contact" titre="Contact" accroche="Corrections, questions, propositions de partenariat : nous lisons tout.">
      <h2>Nous écrire</h2>
      {email ? (
        <p>Par e-mail : <a href={`mailto:${email}`}>{email}</a></p>
      ) : (
        <p>L'adresse de contact sera publiée prochainement.</p>
      )}
      <h2>Signaler une erreur</h2>
      <p>Indiquez l'adresse de la page, ce qui est inexact et, si possible, une source. Nous vérifions et corrigeons dans les meilleurs délais.</p>
      <h2>Partenariats</h2>
      <p>Annonceurs, marques, équipementiers : écrivez-nous en précisant votre projet. Tout contenu sponsorisé sera clairement signalé sur le site.</p>
    </PageTexte>
  );
}
