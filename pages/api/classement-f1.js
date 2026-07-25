// Ce fichier va chercher les classements F1 sur l'API Jolpica
export default async function handler(req, res) {
  try {
    // On récupère la saison demandée (ou 2026 par défaut)
    const saison = req.query.saison || "2026";

    // On appelle les 2 classements en même temps (plus rapide !)
    const [reponsePilotes, reponseEcuries] = await Promise.all([
      fetch(`http://api.jolpi.ca/ergast/f1/${saison}/driverStandings/`),
      fetch(`http://api.jolpi.ca/ergast/f1/${saison}/constructorStandings/`),
    ]);

    const donneesPilotes = await reponsePilotes.json();
    const donneesEcuries = await reponseEcuries.json();

    // On extrait les listes de classement
    const pilotes =
      donneesPilotes.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
    const ecuries =
      donneesEcuries.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];

    // On renvoie tout au site
    res.status(200).json({ pilotes, ecuries, saison });
  } catch (erreur) {
    res.status(500).json({ erreur: "Impossible de récupérer les classements" });
  }
}
