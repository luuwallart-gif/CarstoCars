import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/* Bandeau de texte qui défile avec le scroll */
export default function Bandeau({ mots }) {
  const { scrollY } = useScroll();
  const brut = useTransform(scrollY, (v) => -v * 0.45);
  const x = useSpring(brut, { stiffness: 80, damping: 25 });
  const ligne = [...mots, ...mots, ...mots, ...mots];
  return (
    <div className="bandeau" aria-hidden="true">
      <motion.div style={{ x }} className="bandeau-piste">
        {ligne.map((m, i) => (
          <span key={i}>{m}<b>✦</b></span>
        ))}
      </motion.div>
    </div>
  );
}
