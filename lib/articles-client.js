// Constantes sans accès au disque : utilisables côté navigateur.
export const LOGOS_CATEGORIE = {
  "F1": "f1", "F2": "f2", "F3": "f3", "F4": "f4", "WRC": "wrc", "WEC": "wec",
  "GT": "gt", "Formule E": "fe", "MotoGP": "motogp",
};
export function dateFr(iso) {
  return new Date(iso + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}
