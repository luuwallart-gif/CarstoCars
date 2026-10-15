import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

/* ---------- utilitaires de géométrie ---------- */

// Polygone (profil de côté, x = avant, y = haut) aux coins arrondis
function profilArrondi(points, rayon = 0.12) {
  const s = new THREE.Shape();
  const n = points.length;
  const pt = (i) => new THREE.Vector2(...points[(i + n) % n]);
  for (let i = 0; i < n; i++) {
    const p = pt(i), a = pt(i - 1), b = pt(i + 1);
    const r = Array.isArray(rayon) ? rayon[i] : rayon;
    const da = a.clone().sub(p), db = b.clone().sub(p);
    const ra = Math.min(r, da.length() / 2), rb = Math.min(r, db.length() / 2);
    const p1 = p.clone().add(da.normalize().multiplyScalar(ra));
    const p2 = p.clone().add(db.normalize().multiplyScalar(rb));
    if (i === 0) s.moveTo(p1.x, p1.y); else s.lineTo(p1.x, p1.y);
    s.quadraticCurveTo(p.x, p.y, p2.x, p2.y);
  }
  s.closePath();
  return s;
}

// Profil extrudé sur la largeur (axe Z), centré
function Corps({ points, largeur, rayon, bevel = 0.05, mat, position = [0, 0, 0], scale = [1, 1, 1] }) {
  const geo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(profilArrondi(points, rayon), {
      depth: largeur - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 10,
    });
    g.translate(0, 0, -(largeur - bevel * 2) / 2);
    g.computeVertexNormals();
    return g;
  }, [points, largeur, rayon, bevel]);
  return <mesh geometry={geo} material={mat} position={position} scale={scale} castShadow />;
}

const Boite = ({ taille, position, rotation, mat }) => (
  <mesh position={position} rotation={rotation} material={mat} castShadow>
    <boxGeometry args={taille} />
  </mesh>
);

function Roue({ r = 0.34, l = 0.3, position, jante, pneu, rayons = 5 }) {
  const ref = useRef();
  useFrame((_, dt) => { if (ref.current) ref.current.rotation.z -= dt * 3; });
  return (
    <group position={position}>
      <group ref={ref}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={pneu} castShadow>
          <cylinderGeometry args={[r, r, l, 40]} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={jante} position={[0, 0, 0]}>
          <cylinderGeometry args={[r * 0.66, r * 0.66, l + 0.02, 32]} />
        </mesh>
        {Array.from({ length: rayons }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i / rayons) * Math.PI * 2]} position={[0, 0, l / 2 + 0.012]} material={pneu}>
            <boxGeometry args={[r * 1.1, r * 0.1, 0.01]} />
          </mesh>
        ))}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, l / 2 + 0.02]} material={pneu}>
          <cylinderGeometry args={[r * 0.12, r * 0.12, 0.03, 16]} />
        </mesh>
      </group>
    </group>
  );
}

function useMateriaux(couleur, accent) {
  return useMemo(() => ({
    peinture: new THREE.MeshPhysicalMaterial({ color: couleur, metalness: 0.55, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.08 }),
    accent: new THREE.MeshPhysicalMaterial({ color: accent, metalness: 0.4, roughness: 0.3, clearcoat: 0.8 }),
    carbone: new THREE.MeshStandardMaterial({ color: "#121214", metalness: 0.5, roughness: 0.45 }),
    verre: new THREE.MeshPhysicalMaterial({ color: "#06080c", metalness: 0.9, roughness: 0.05, clearcoat: 1 }),
    pneu: new THREE.MeshStandardMaterial({ color: "#0b0b0c", roughness: 0.92 }),
    jante: new THREE.MeshStandardMaterial({ color: "#c9c6be", metalness: 1, roughness: 0.25 }),
    blanc: new THREE.MeshStandardMaterial({ color: "#f2efe9", roughness: 0.4, metalness: 0.2 }),
    lumiere: new THREE.MeshStandardMaterial({ color: "#fff4d6", emissive: "#fff4d6", emissiveIntensity: 1.6 }),
    rouge: new THREE.MeshStandardMaterial({ color: "#ff2a1a", emissive: "#ff2a1a", emissiveIntensity: 1.2 }),
  }), [couleur, accent]);
}

/* ---------- Formule 1 ---------- */
function F1() {
  const m = useMateriaux("#ff5a1f", "#f2efe9");
  const chassis = useMemo(() => [[-1.55, 0.14], [-1.55, 0.6], [-0.7, 0.72], [0.3, 0.66], [0.55, 0.55], [2.35, 0.38], [2.62, 0.3], [2.62, 0.16]], []);
  const capot = useMemo(() => [[-1.5, 0.5], [-0.9, 0.98], [-0.45, 1.08], [0.1, 0.9], [-0.2, 0.62], [-1.0, 0.55]], []);
  const aileron = useMemo(() => [[-0.2, 0], [0.45, 0], [0.5, 0.05], [-0.2, 0.09]], []);
  return (
    <group>
      <Boite taille={[4.4, 0.05, 1.5]} position={[0.2, 0.1, 0]} mat={m.carbone} />
      <Corps points={chassis} largeur={0.62} rayon={0.16} mat={m.peinture} />
      <Corps points={capot} largeur={0.34} rayon={0.12} mat={m.accent} />
      {/* pontons */}
      {[-1, 1].map((s) => (
        <group key={s} position={[0, 0, s * 0.5]}>
          <Corps points={[[-1.2, 0.14], [-1.1, 0.62], [-0.2, 0.7], [0.55, 0.58], [0.6, 0.14]]} largeur={0.42} rayon={0.15} mat={m.peinture} />
          <Boite taille={[0.5, 0.2, 0.05]} position={[0.55, 0.36, s * 0.2]} rotation={[0, 0, 0]} mat={m.carbone} />
        </group>
      ))}
      {/* halo + casque */}
      <mesh position={[0.28, 0.78, 0]} rotation={[0, Math.PI / 2, 0]} material={m.carbone}>
        <torusGeometry args={[0.27, 0.025, 10, 30, Math.PI]} />
      </mesh>
      <Boite taille={[0.04, 0.3, 0.04]} position={[0.62, 0.78, 0]} rotation={[0, 0, -0.5]} mat={m.carbone} />
      <mesh position={[0.2, 0.76, 0]} material={m.blanc} castShadow><sphereGeometry args={[0.13, 20, 16]} /></mesh>
      <Boite taille={[0.1, 0.05, 0.2]} position={[0.3, 0.77, 0]} mat={m.verre} />
      {/* aileron avant */}
      <Boite taille={[0.5, 0.035, 2.05]} position={[2.5, 0.1, 0]} mat={m.carbone} />
      <Boite taille={[0.38, 0.03, 2.0]} position={[2.35, 0.2, 0]} rotation={[0, 0, 0.12]} mat={m.accent} />
      {[-1, 1].map((s) => <Boite key={s} taille={[0.6, 0.28, 0.03]} position={[2.45, 0.2, s * 1.03]} mat={m.carbone} />)}
      {/* aileron arrière */}
      <Boite taille={[0.42, 0.04, 1.4]} position={[-1.7, 0.98, 0]} rotation={[0, 0, -0.1]} mat={m.accent} />
      <Boite taille={[0.3, 0.035, 1.4]} position={[-1.78, 1.16, 0]} rotation={[0, 0, -0.2]} mat={m.peinture} />
      {[-1, 1].map((s) => <Boite key={s} taille={[0.75, 0.55, 0.03]} position={[-1.72, 0.9, s * 0.72]} mat={m.carbone} />)}
      <Boite taille={[0.08, 0.5, 0.12]} position={[-1.55, 0.7, 0]} mat={m.carbone} />
      <Boite taille={[0.5, 0.18, 1.1]} position={[-1.75, 0.2, 0]} rotation={[0, 0, 0.35]} mat={m.carbone} />
      {/* feu pluie */}
      <mesh position={[-1.9, 0.5, 0]} material={m.rouge}><boxGeometry args={[0.03, 0.12, 0.14]} /></mesh>
      {/* suspensions */}
      {[[1.7, 0.9], [1.7, -0.9], [-1.2, 0.92], [-1.2, -0.92]].map(([x, z], i) => (
        <group key={i}>
          <Boite taille={[0.04, 0.04, Math.abs(z) - 0.3]} position={[x, 0.35, Math.sign(z) * (Math.abs(z) / 2 + 0.08)]} rotation={[0, 0, 0.1]} mat={m.carbone} />
          <Boite taille={[0.04, 0.04, Math.abs(z) - 0.3]} position={[x + 0.2, 0.22, Math.sign(z) * (Math.abs(z) / 2 + 0.08)]} rotation={[0, 0, -0.1]} mat={m.carbone} />
        </group>
      ))}
      <Roue r={0.33} l={0.34} position={[1.7, 0.33, 0.93]} jante={m.jante} pneu={m.pneu} />
      <Roue r={0.33} l={0.34} position={[1.7, 0.33, -0.93]} jante={m.jante} pneu={m.pneu} />
      <Roue r={0.36} l={0.46} position={[-1.2, 0.36, 0.95]} jante={m.jante} pneu={m.pneu} />
      <Roue r={0.36} l={0.46} position={[-1.2, 0.36, -0.95]} jante={m.jante} pneu={m.pneu} />
    </group>
  );
}

/* ---------- WRC ---------- */
function WRC() {
  const m = useMateriaux("#1e6bff", "#f2efe9");
  const bas = useMemo(() => [[-2.0, 0.34], [-2.02, 0.92], [-1.2, 0.98], [0.5, 0.98], [1.4, 0.9], [2.0, 0.78], [2.1, 0.55], [2.05, 0.34]], []);
  const vitres = useMemo(() => [[-1.6, 0.98], [-1.0, 1.42], [0.0, 1.46], [0.75, 1.3], [1.0, 0.98]], []);
  return (
    <group position={[0, 0.02, 0]}>
      <Corps points={bas} largeur={1.78} rayon={0.12} mat={m.peinture} position={[0, 0.06, 0]} />
      <Corps points={vitres} largeur={1.5} rayon={0.1} mat={m.verre} position={[0, 0.06, 0]} />
      <Boite taille={[1.7, 0.06, 1.46]} position={[-0.05, 1.5, 0]} mat={m.peinture} />
      <Boite taille={[0.3, 0.1, 0.34]} position={[-0.1, 1.58, 0]} mat={m.carbone} />
      {/* bande blanche */}
      <Boite taille={[4.0, 0.12, 1.8]} position={[0, 0.7, 0]} mat={m.blanc} />
      <Boite taille={[0.9, 0.02, 0.6]} position={[1.55, 0.97, 0]} mat={m.carbone} />
      {/* ailes élargies */}
      {[[1.45], [-1.2]].map(([x], i) => [-1, 1].map((s) => (
        <mesh key={`${i}${s}`} position={[x, 0.55, s * 0.92]} material={m.peinture} castShadow>
          <cylinderGeometry args={[0.52, 0.52, 0.16, 28, 1, false, 0, Math.PI]} />
        </mesh>
      )))}
      {/* aileron arrière */}
      <Boite taille={[0.5, 0.04, 1.7]} position={[-2.15, 1.3, 0]} rotation={[0, 0, -0.12]} mat={m.carbone} />
      <Boite taille={[0.35, 0.04, 1.7]} position={[-2.2, 1.46, 0]} rotation={[0, 0, -0.22]} mat={m.accent} />
      {[-1, 1].map((s) => <Boite key={s} taille={[0.7, 0.5, 0.03]} position={[-2.15, 1.25, s * 0.86]} mat={m.carbone} />)}
      {[-1, 1].map((s) => <Boite key={s} taille={[0.06, 0.45, 0.08]} position={[-2.0, 1.05, s * 0.5]} mat={m.carbone} />)}
      {/* splitter + phares additionnels */}
      <Boite taille={[0.3, 0.05, 1.8]} position={[2.18, 0.34, 0]} mat={m.carbone} />
      {[-0.55, -0.2, 0.2, 0.55].map((z) => (
        <mesh key={z} position={[2.1, 0.62, z]} rotation={[0, 0, Math.PI / 2]} material={m.lumiere}><cylinderGeometry args={[0.09, 0.09, 0.06, 20]} /></mesh>
      ))}
      <mesh position={[-2.05, 0.82, 0.55]} material={m.rouge}><boxGeometry args={[0.03, 0.1, 0.4]} /></mesh>
      <mesh position={[-2.05, 0.82, -0.55]} material={m.rouge}><boxGeometry args={[0.03, 0.1, 0.4]} /></mesh>
      {[[1.45], [-1.2]].map(([x], i) => [-1, 1].map((s) => (
        <Roue key={`${i}${s}`} r={0.4} l={0.34} position={[x, 0.4, s * 0.92]} jante={m.jante} pneu={m.pneu} rayons={6} />
      )))}
    </group>
  );
}

/* ---------- GT3 ---------- */
function GT3() {
  const m = useMateriaux("#ffd400", "#121214");
  const bas = useMemo(() => [[-2.3, 0.3], [-2.32, 0.72], [-1.5, 0.86], [-0.5, 0.9], [0.9, 0.82], [2.0, 0.62], [2.3, 0.46], [2.3, 0.3]], []);
  const vitres = useMemo(() => [[-0.9, 0.88], [-0.35, 1.2], [0.5, 1.22], [1.15, 0.86]], []);
  return (
    <group position={[0, 0.02, 0]}>
      <Corps points={bas} largeur={1.95} rayon={0.14} mat={m.peinture} position={[0, 0.08, 0]} />
      <Corps points={vitres} largeur={1.5} rayon={0.12} mat={m.verre} position={[0, 0.08, 0]} />
      <Boite taille={[1.3, 0.05, 1.3]} position={[-0.05, 1.31, 0]} rotation={[0, 0, 0]} mat={m.peinture} />
      {/* capot */}
      <Boite taille={[0.9, 0.02, 0.9]} position={[1.3, 0.93, 0]} rotation={[0, 0, -0.18]} mat={m.carbone} />
      {/* bandes */}
      <Boite taille={[4.6, 0.05, 0.22]} position={[0, 0.99, 0.0]} mat={m.carbone} />
      <Boite taille={[4.6, 0.12, 2.0]} position={[0, 0.34, 0]} mat={m.carbone} />
      {/* splitter */}
      <Boite taille={[0.4, 0.04, 2.05]} position={[2.35, 0.26, 0]} mat={m.carbone} />
      {/* aileron arrière sur mâts */}
      <Boite taille={[0.5, 0.045, 1.9]} position={[-2.3, 1.2, 0]} rotation={[0, 0, -0.1]} mat={m.carbone} />
      <Boite taille={[0.3, 0.04, 1.9]} position={[-2.35, 1.32, 0]} rotation={[0, 0, -0.2]} mat={m.accent} />
      {[-1, 1].map((s) => <Boite key={s} taille={[0.62, 0.4, 0.03]} position={[-2.3, 1.15, s * 0.95]} mat={m.carbone} />)}
      {[-0.5, 0.5].map((z) => <Boite key={z} taille={[0.06, 0.45, 0.06]} position={[-2.15, 0.98, z]} rotation={[0, 0, 0.2]} mat={m.carbone} />)}
      {/* phares + feux */}
      {[-0.6, 0.6].map((z) => <mesh key={z} position={[2.2, 0.62, z]} rotation={[0, 0, 0.3]} material={m.lumiere}><boxGeometry args={[0.04, 0.1, 0.45]} /></mesh>)}
      <mesh position={[-2.34, 0.7, 0]} material={m.rouge}><boxGeometry args={[0.03, 0.06, 1.2]} /></mesh>
      {/* ailes larges */}
      {[1.35, -1.3].map((x) => [-1, 1].map((s) => (
        <mesh key={`${x}${s}`} position={[x, 0.5, s * 0.98]} material={m.peinture} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.14, 28, 1, false, 0, Math.PI]} />
        </mesh>
      )))}
      {[1.35, -1.3].map((x) => [-1, 1].map((s) => (
        <Roue key={`${x}${s}`} r={0.36} l={0.36} position={[x, 0.37, s * 0.98]} jante={m.jante} pneu={m.pneu} rayons={7} />
      )))}
    </group>
  );
}

/* ---------- Hypercar WEC ---------- */
function Hypercar() {
  const m = useMateriaux("#0b3d91", "#7ac61c");
  const bas = useMemo(() => [[-2.5, 0.3], [-2.48, 0.78], [-1.6, 0.98], [-0.6, 1.04], [0.2, 0.98], [1.4, 0.7], [2.45, 0.42], [2.5, 0.3]], []);
  const bulle = useMemo(() => [[-0.9, 0.98], [-0.35, 1.28], [0.35, 1.24], [0.95, 0.9]], []);
  return (
    <group position={[0, 0.02, 0]}>
      <Corps points={bas} largeur={1.9} rayon={0.16} mat={m.peinture} position={[0, 0.08, 0]} />
      <Corps points={bulle} largeur={1.0} rayon={0.12} mat={m.verre} position={[0, 0.08, 0]} />
      {/* aileron vertical */}
      <Corps points={[[-2.7, 0.9], [-2.6, 1.55], [-1.7, 1.1], [-1.2, 1.02]]} largeur={0.06} rayon={0.05} bevel={0.015} mat={m.accent} position={[0, 0.08, 0]} />
      <Boite taille={[0.5, 0.04, 1.9]} position={[-2.55, 1.0, 0]} rotation={[0, 0, -0.08]} mat={m.carbone} />
      {[-1, 1].map((s) => <Boite key={s} taille={[0.9, 0.4, 0.03]} position={[-2.35, 0.95, s * 0.96]} mat={m.carbone} />)}
      {/* bande */}
      <Boite taille={[2.1, 0.03, 0.16]} position={[-1.35, 1.12, 0.3]} rotation={[0, 0, 0.1]} mat={m.accent} />
      <Boite taille={[2.1, 0.03, 0.16]} position={[-1.35, 1.12, -0.3]} rotation={[0, 0, 0.1]} mat={m.accent} />
      <Boite taille={[5.0, 0.1, 2.0]} position={[0, 0.36, 0]} mat={m.carbone} />
      {/* carénages de roues */}
      {[1.5, -1.5].map((x) => [-1, 1].map((s) => (
        <group key={`${x}${s}`}>
          <Boite taille={[1.1, 0.5, 0.18]} position={[x, 0.55, s * 1.0]} mat={m.peinture} />
        </group>
      )))}
      {/* splitter et phares fins */}
      <Boite taille={[0.4, 0.04, 2.0]} position={[2.5, 0.26, 0]} mat={m.carbone} />
      {[-0.65, 0.65].map((z) => <mesh key={z} position={[2.2, 0.56, z]} rotation={[0, 0, 0.5]} material={m.lumiere}><boxGeometry args={[0.04, 0.06, 0.5]} /></mesh>)}
      <mesh position={[-2.52, 0.75, 0]} material={m.rouge}><boxGeometry args={[0.03, 0.05, 1.5]} /></mesh>
      {[1.5, -1.5].map((x) => [-1, 1].map((s) => (
        <Roue key={`${x}${s}`} r={0.36} l={0.38} position={[x, 0.37, s * 0.96]} jante={m.jante} pneu={m.pneu} rayons={5} />
      )))}
    </group>
  );
}

export const VOITURES = [
  { id: "f1", nom: "Formule 1", Comp: F1, echelle: 0.82 },
  { id: "wrc", nom: "WRC", Comp: WRC, echelle: 0.95 },
  { id: "gt3", nom: "GT3", Comp: GT3, echelle: 0.9 },
  { id: "wec", nom: "Hypercar WEC", Comp: Hypercar, echelle: 0.85 },
];

/* ---------- scène ---------- */
function Rig({ progress, glisse }) {
  const groupes = useRef([]);
  const lacet = useRef(0);
  const n = VOITURES.length;

  useFrame((state, dt) => {
    const p = progress.get() * n; // 0..n
    const g = glisse.current;
    // inertie du glissement
    if (!g.actif) { g.vitesse *= 0.94; g.angle += g.vitesse; g.angle *= 0.995; }
    lacet.current += dt * 0.25;
    state.camera.position.x += ((state.pointer.x * 0.8 + 2.2) - state.camera.position.x) * 0.04;
    state.camera.position.y += ((2.0 + state.pointer.y * 0.4) - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, 0.55, 0);

    VOITURES.forEach((_, i) => {
      const grp = groupes.current[i];
      if (!grp) return;
      let t = p - (i + 0.5); // -0.5..+0.5 : de l'entrée à la sortie de son chapitre
      if (i === 0) t = Math.max(t, -0.3);
      if (i === n - 1) t = Math.min(t, 0.3);
      const k = THREE.MathUtils.clamp((0.62 - Math.abs(t)) / 0.24, 0, 1); // 1 au centre, 0 hors chapitre
      const sortie = Math.sign(t) * (1 - k); // -1 arrive par la droite, +1 part par la gauche
      grp.visible = k > 0.001;
      grp.position.set(-sortie * 6, Math.sin(state.clock.elapsedTime * 1.2 + i) * 0.03, -Math.abs(sortie) * 3);
      grp.scale.setScalar(VOITURES[i].echelle * (0.6 + 0.4 * k));
      grp.rotation.y = -0.5 + t * 1.1 - sortie * 0.9 + g.angle + Math.sin(state.clock.elapsedTime * 0.5) * 0.06;
    });
  });

  return (
    <>
      {VOITURES.map(({ id, Comp }, i) => (
        <group key={id} ref={(el) => (groupes.current[i] = el)}>
          <Comp />
        </group>
      ))}
    </>
  );
}

export default function Voitures3D({ progress }) {
  const glisse = useRef({ actif: false, x: 0, angle: 0, vitesse: 0 });

  const bas = (e) => { const g = glisse.current; g.actif = true; g.x = e.clientX; g.vitesse = 0; e.currentTarget.setPointerCapture?.(e.pointerId); };
  const bouge = (e) => {
    const g = glisse.current;
    if (!g.actif) return;
    const dx = e.clientX - g.x;
    g.x = e.clientX; g.angle += dx * 0.012; g.vitesse = dx * 0.012;
  };
  const haut = () => { glisse.current.actif = false; };

  return (
    <div className="voiture3d" onPointerDown={bas} onPointerMove={bouge} onPointerUp={haut} onPointerCancel={haut} onPointerLeave={haut}>
      <Canvas shadows dpr={[1, 1.75]} camera={{ position: [2.2, 2.0, 10.5], fov: 30 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 7, 4]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
        <pointLight position={[-6, 2, -3]} intensity={30} color="#ff5a1f" />
        <Environment resolution={256} environmentIntensity={0.9}>
          <Lightformer form="rect" intensity={4} position={[0, 6, 0]} scale={[14, 6, 1]} rotation-x={Math.PI / 2} />
          <Lightformer form="rect" intensity={3} position={[-7, 2, 3]} scale={[8, 3, 1]} rotation-y={Math.PI / 2} />
          <Lightformer form="rect" intensity={2} position={[7, 1.5, -3]} scale={[8, 3, 1]} rotation-y={-Math.PI / 2} color="#ff9a6a" />
          <Lightformer form="ring" intensity={2} position={[0, 3, -8]} scale={6} color="#ffffff" />
        </Environment>
        <Rig progress={progress} glisse={glisse} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]}>
          <ringGeometry args={[2.9, 2.94, 96]} />
          <meshBasicMaterial color="#ff5a1f" transparent opacity={0.55} />
        </mesh>
        <ContactShadows position={[0, 0, 0]} opacity={0.65} scale={14} blur={2.6} far={3} resolution={512} />
      </Canvas>
    </div>
  );
}
