import { useEffect, useRef } from "react";

/* Voiture dessinée en particules : contour échantillonné sur deux plans pour donner du volume.
   La rotation, la dispersion et la couleur suivent la progression du scroll. */
function contourVoiture() {
  const c = document.createElement("canvas");
  c.width = 1040; c.height = 420;
  const g = c.getContext("2d");
  g.strokeStyle = "#fff";
  g.lineWidth = 3;
  g.lineJoin = "round";
  g.beginPath();
  g.moveTo(60, 310);
  g.bezierCurveTo(60, 260, 90, 240, 160, 232);
  g.bezierCurveTo(250, 222, 330, 170, 430, 140);
  g.bezierCurveTo(500, 118, 580, 120, 640, 140);
  g.bezierCurveTo(720, 165, 800, 215, 900, 235);
  g.bezierCurveTo(960, 247, 985, 270, 985, 310);
  g.lineTo(836, 310);
  g.arc(770, 310, 66, 0, Math.PI, true);
  g.lineTo(330, 310);
  g.arc(264, 310, 66, 0, Math.PI, true);
  g.lineTo(60, 310);
  g.stroke();
  // vitres et détails
  g.beginPath();
  g.moveTo(410, 160); g.lineTo(520, 136); g.lineTo(640, 150); g.lineTo(730, 205); g.lineTo(380, 205); g.closePath();
  g.moveTo(560, 140); g.lineTo(560, 205);
  g.moveTo(200, 250); g.lineTo(930, 262);
  g.stroke();
  for (const x of [264, 770]) {
    g.beginPath(); g.arc(x, 316, 54, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.arc(x, 316, 28, 0, Math.PI * 2); g.stroke();
    g.beginPath();
    for (let a = 0; a < 5; a++) { g.moveTo(x, 316); g.lineTo(x + Math.cos(a * 1.2566) * 28, 316 + Math.sin(a * 1.2566) * 28); }
    g.stroke();
  }
  const { data, width, height } = g.getImageData(0, 0, c.width, c.height);
  return { data, width, height };
}

export default function ParticleCar({ progress, chapitres = 4 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const mobile = window.innerWidth < 760;
    const pas = mobile ? 7 : 5;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const { data, width, height } = contourVoiture();

    const pts = [];
    for (let y = 0; y < height; y += pas) {
      for (let x = 0; x < width; x += pas) {
        if (data[(y * width + x) * 4 + 3] > 120) {
          for (const z of [-70, 70]) {
            pts.push({
              x: x - width / 2 + (Math.random() - 0.5) * 2,
              y: y - height / 2 - 20,
              z: z + (Math.random() - 0.5) * 20,
              // direction de dispersion
              ox: (Math.random() - 0.5) * 1400,
              oy: (Math.random() - 0.5) * 900,
              oz: (Math.random() - 0.5) * 900,
              t: Math.random(),
            });
          }
        }
      }
    }
    // poussière autour
    const poussiere = mobile ? 120 : 320;
    for (let i = 0; i < poussiere; i++) {
      pts.push({
        x: (Math.random() - 0.5) * 1800, y: (Math.random() - 0.5) * 900, z: (Math.random() - 0.5) * 900,
        ox: 0, oy: 0, oz: 0, t: Math.random(), fond: true,
      });
    }

    let W = 0, H = 0, dpr = 1;
    const taille = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
    };
    taille();
    window.addEventListener("resize", taille);

    const souris = { x: -9999, y: -9999, vx: 0, vy: 0 };
    const bouger = (e) => {
      const b = canvas.getBoundingClientRect();
      souris.x = e.clientX - b.left; souris.y = e.clientY - b.top;
      souris.vx = (souris.x / b.width - 0.5); souris.vy = (souris.y / b.height - 0.5);
    };
    window.addEventListener("pointermove", bouger);

    let dispersion = 1; // démarre dispersé puis s'assemble
    let rotY = 0, rotX = 0, derive = 0;
    let raf, dernier = performance.now();

    const boucle = (now) => {
      const dt = Math.min(0.05, (now - dernier) / 1000);
      dernier = now;
      const p = progress.get();
      const pc = p * chapitres; // position dans les chapitres
      // dispersion forte autour des changements de chapitre
      let cible = 0;
      for (let k = 1; k < chapitres; k++) {
        const d = Math.abs(pc - k);
        cible = Math.max(cible, 1 - Math.min(d / 0.32, 1));
      }
      if (reduit) cible = 0;
      dispersion += (cible - dispersion) * Math.min(1, dt * 5);

      const cibleY = (reduit ? 0 : (p - 0.5) * 1.6) + souris.vx * 0.5;
      const cibleX = souris.vy * 0.25 - 0.05;
      rotY += (cibleY - rotY) * Math.min(1, dt * 4);
      rotX += (cibleX - rotX) * Math.min(1, dt * 4);
      derive += dt * 0.25;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      const echelle = Math.min(W / 1100, H / 560) * (W < 760 ? 1.25 : 1);
      const cx = W / 2, cy = H * (W < 760 ? 0.34 : 0.52);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY), cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const teinte = 14 + (pc % chapitres) * 9;
      const f = 900;

      for (const q of pts) {
        let x = q.x + q.ox * dispersion;
        let y = q.y + q.oy * dispersion;
        let z = q.z + q.oz * dispersion;
        if (q.fond) { y += Math.sin(derive + q.t * 6) * 14; x += Math.cos(derive + q.t * 5) * 10; }
        // rotation Y puis X
        let x1 = x * cosY + z * sinY;
        let z1 = -x * sinY + z * cosY;
        let y1 = y * cosX - z1 * sinX;
        let z2 = y * sinX + z1 * cosX;
        const s = f / (f + z2) ;
        let sx = cx + x1 * s * echelle;
        let sy = cy + y1 * s * echelle;

        // répulsion de la souris
        const dx = sx - souris.x, dy = sy - souris.y;
        const d2 = dx * dx + dy * dy;
        if (!reduit && d2 < 9000) {
          const d = Math.sqrt(d2) || 1;
          const force = (1 - d / 95) * 38;
          sx += (dx / d) * force; sy += (dy / d) * force;
        }

        const profondeur = Math.max(0.15, Math.min(1, s * 0.95));
        const alpha = (q.fond ? 0.28 : 0.55 + 0.45 * Math.sin(derive * 3 + q.t * 20) * 0.5 + 0.2) * profondeur;
        ctx.fillStyle = `hsla(${teinte + q.t * 14}, 100%, ${q.fond ? 60 : 58}%, ${alpha})`;
        const r = (q.fond ? 1 : 1.5) * Math.max(0.6, s) * (W < 760 ? 0.9 : 1.1);
        ctx.fillRect(sx - r, sy - r, r * 2, r * 2);
      }
      raf = requestAnimationFrame(boucle);
    };
    raf = requestAnimationFrame(boucle);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", taille);
      window.removeEventListener("pointermove", bouger);
    };
  }, [progress, chapitres]);

  return <canvas ref={ref} className="particules" aria-hidden="true" />;
}
