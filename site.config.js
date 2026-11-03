// Informations du site, utilisées partout (SEO, pages légales, flux RSS).
// À compléter : les champs vides s'affichent comme « à compléter » sur les pages légales.
module.exports = {
  nom: "Carstocars",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://carstocars.vercel.app").replace(/\/$/, ""),
  description:
    "Actualité automobile et sport auto : fiches de 94 marques, Grands Prix de F1 depuis 2015, classements et analyses quotidiennes.",
  langue: "fr-FR",
  editeur: {
    nom: "", // ex. « Prénom Nom » ou raison sociale
    statut: "", // ex. « Micro-entrepreneur, SIRET 000 000 000 00000 »
    adresse: "", // adresse postale (ou celle de l'hébergeur pour un particulier)
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
    directeurPublication: "",
  },
  hebergeur: {
    nom: "Vercel Inc.",
    adresse: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
    site: "https://vercel.com",
  },
};
