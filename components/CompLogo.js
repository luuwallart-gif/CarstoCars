import { useState, useEffect } from "react";

/* Logo d'une compétition.
   Dépose le fichier officiel dans public/logos/<id>.svg (ou .png) pour qu'il s'affiche ;
   sans fichier, un badge typographique prend le relais. */
const BADGES = {
  f1: { txt: "F1", fond: "#e10600", col: "#fff" },
  f2: { txt: "F2", fond: "#0090d0", col: "#fff" },
  f3: { txt: "F3", fond: "#e6007e", col: "#fff" },
  f4: { txt: "F4", fond: "#f2efe9", col: "#0c0c0d" },
  wrc: { txt: "WRC", fond: "#00a651", col: "#fff" },
  gt: { txt: "GT", fond: "#ffd400", col: "#0c0c0d" },
  wec: { txt: "WEC", fond: "#0b3d91", col: "#fff" },
  fe: { txt: "FE", fond: "#00d1c1", col: "#0c0c0d" },
  motogp: { txt: "MotoGP", fond: "#d0021b", col: "#fff" },
};

export default function CompLogo({ id, hauteur = 22 }) {
  const [fichier, setFichier] = useState(null);
  const b = BADGES[id] || { txt: id?.toUpperCase(), fond: "#2a2a2e", col: "#fff" };

  // On teste d'abord que le fichier existe, sinon on garde le badge
  useEffect(() => {
    let annule = false;
    setFichier(null);
    const essayer = (ext, suite) => {
      const im = new Image();
      im.onload = () => !annule && setFichier(`/logos/${id}.${ext}`);
      im.onerror = suite;
      im.src = `/logos/${id}.${ext}`;
    };
    essayer("svg", () => essayer("png", () => essayer("webp", () => {})));
    return () => { annule = true; };
  }, [id]);

  if (fichier) {
    // Pastille claire : les logos officiels sont souvent noirs ou sur fond blanc
    return (
      <span style={{ display: "inline-flex", alignItems: "center", background: "#f2efe9", borderRadius: Math.max(4, hauteur * 0.18), padding: `${hauteur * 0.14}px ${hauteur * 0.3}px` }}>
        <img src={fichier} alt={b.txt} style={{ height: hauteur, width: "auto", display: "block" }} />
      </span>
    );
  }
  return (
    <span
      aria-label={b.txt}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        height: hauteur, padding: `0 ${hauteur * 0.4}px`, borderRadius: hauteur * 0.2,
        background: b.fond, color: b.col, fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700, fontSize: hauteur * 0.55, fontStyle: "italic", letterSpacing: "-.02em", lineHeight: 1,
      }}
    >
      {b.txt}
    </span>
  );
}
