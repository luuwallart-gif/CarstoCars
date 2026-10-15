import { motion, useTransform, useMotionValue, useSpring } from "framer-motion";

/* Image de voiture (fond transparent) qui entre et sort au rythme du scroll */
export default function VoitureImage({ i, n, progress, src, nom }) {
  const debut = i / n, fin = (i + 1) / n, e = 0.045;
  const premiere = i === 0, derniere = i === n - 1;
  const cles = [debut - e, debut + e, fin - e, fin + e];
  const opacity = useTransform(progress, cles, [premiere ? 1 : 0, 1, 1, derniere ? 1 : 0]);
  const x = useTransform(progress, cles, [premiere ? 0 : 260, 0, 0, derniere ? 0 : -260]);
  const scale = useTransform(progress, cles, [premiere ? 1 : 0.82, 1, 1, derniere ? 1 : 0.82]);
  const inclinaison = useTransform(progress, cles, [premiere ? 0 : -9, 0, 0, derniere ? 0 : 9]);
  const flou = useTransform(progress, cles, [premiere ? 0 : 8, 0, 0, derniere ? 0 : 8]);
  const filter = useTransform(flou, (v) => `blur(${v}px)`);

  const mx = useSpring(useMotionValue(0), { stiffness: 120, damping: 16 });
  const my = useSpring(useMotionValue(0), { stiffness: 120, damping: 16 });
  const bouger = (e2) => {
    const b = e2.currentTarget.getBoundingClientRect();
    mx.set(((e2.clientX - b.left) / b.width - 0.5) * 14);
    my.set(-((e2.clientY - b.top) / b.height - 0.5) * 8);
  };
  const quitter = () => { mx.set(0); my.set(0); };

  return (
    <motion.div className="voiture-img" style={{ opacity, x, scale, skewX: inclinaison, filter }} onPointerMove={bouger} onPointerLeave={quitter}>
      <motion.div style={{ rotateY: mx, rotateX: my, perspective: 900 }} animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
        <img src={src} alt={nom} draggable={false} />
      </motion.div>
      <i className="voiture-ombre" />
    </motion.div>
  );
}
