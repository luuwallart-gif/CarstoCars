import { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/* Photo interactive : s'incline avec la souris, zoom au clic */
export default function Visuel({ src, secours, alt, logo }) {
  const [courant, setCourant] = useState(src);
  const [zoom, setZoom] = useState(false);
  const [charge, setCharge] = useState(false);
  const rx = useSpring(useMotionValue(0), { stiffness: 140, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 140, damping: 16 });
  const px = useSpring(useMotionValue(50), { stiffness: 120, damping: 20 });
  const py = useSpring(useMotionValue(50), { stiffness: 120, damping: 20 });
  const origine = useTransform([px, py], ([x, y]) => `${x}% ${y}%`);

  useEffect(() => { setCourant(src); setCharge(false); setZoom(false); }, [src]);

  const bouger = (e) => {
    const b = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
    ry.set((x - 0.5) * 16); rx.set(-(y - 0.5) * 12);
    px.set(x * 100); py.set(y * 100);
  };
  const quitter = () => { rx.set(0); ry.set(0); px.set(50); py.set(50); };
  // si l'image agrandie échoue, on retente avec la miniature, puis on affiche le logo
  const erreur = () => {
    if (secours && courant !== secours) setCourant(secours);
    else setCourant(null);
  };

  if (!courant) {
    return <div className="visuel vide"><img src={logo} alt={alt} /></div>;
  }
  return (
    <div className="visuel" onMouseMove={bouger} onMouseLeave={quitter} onClick={() => setZoom(!zoom)} style={{ perspective: 1000, cursor: zoom ? "zoom-out" : "zoom-in" }}>
      {!charge && <div className="skeleton" style={{ position: "absolute", inset: 0, borderRadius: 0 }} />}
      <motion.img
        key={courant}
        src={courant}
        alt={alt}
        referrerPolicy="no-referrer"
        onLoad={() => setCharge(true)}
        onError={erreur}
        ref={(el) => { if (el && el.complete && el.naturalWidth > 0) setCharge(true); }}
        style={{ rotateX: rx, rotateY: ry, transformOrigin: zoom ? origine : "50% 50%", opacity: charge ? 1 : 0 }}
        animate={{ scale: zoom ? 2 : 1 }}
        transition={{ duration: 0.4 }}
        draggable={false}
      />
      <span className="aide">{zoom ? "Bouge la souris pour explorer" : "Clique pour zoomer · survole pour incliner"}</span>
    </div>
  );
}
