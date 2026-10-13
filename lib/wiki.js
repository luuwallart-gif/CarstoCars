const cache = {};

const url = (langue, type, titre) =>
  `https://${langue}.wikipedia.org/api/rest_v1/page/${type}/${encodeURIComponent(titre.replace(/ /g, "_"))}`;

/* Résumé + image d'une page Wikipédia (français, puis anglais) */
export async function resume(titre) {
  if (!titre) return null;
  const cle = "r:" + titre;
  if (cache[cle] !== undefined) return cache[cle];
  for (const langue of ["fr", "en"]) {
    try {
      const r = await fetch(url(langue, "summary", titre));
      if (!r.ok) continue;
      const d = await r.json();
      if (d.type === "disambiguation") continue;
      const mini = d.thumbnail?.source || null;
      const largeur = d.originalimage?.width || d.thumbnail?.width || 0;
      // On agrandit la miniature sans dépasser la taille de l'original
      let grande = mini;
      if (mini && /\/\d+px-/.test(mini)) {
        const px = Math.min(1100, largeur || 1100);
        grande = mini.replace(/\/\d+px-/, `/${px}px-`);
      }
      return (cache[cle] = {
        texte: d.extract || "",
        mini,
        img: grande,
        original: d.originalimage?.source || null,
        lien: d.content_urls?.desktop?.page,
        langue,
      });
    } catch (e) {}
  }
  return (cache[cle] = null);
}

/* Autres photos d'une page */
export async function galerie(titre, langue = "fr") {
  if (!titre) return [];
  const cle = "g:" + titre;
  if (cache[cle] !== undefined) return cache[cle];
  try {
    const r = await fetch(url(langue, "media-list", titre));
    if (!r.ok) return (cache[cle] = []);
    const d = await r.json();
    const imgs = (d.items || [])
      .filter((i) => i.type === "image" && i.srcset?.length && !/\.svg/i.test(i.title || ""))
      .map((i) => {
        const s = i.srcset[i.srcset.length - 1].src;
        return s.startsWith("//") ? "https:" + s : s;
      });
    return (cache[cle] = [...new Set(imgs)].slice(0, 9));
  } catch (e) {
    return (cache[cle] = []);
  }
}
