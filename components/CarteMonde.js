import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const anneauPulse = L.divIcon({
  className: "pulse-ring",
  html: "<span></span><i></i>",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function Vol({ cible }) {
  const map = useMap();
  useEffect(() => {
    if (cible) map.flyTo(cible, Math.max(map.getZoom(), 4), { duration: 1.2 });
    else map.flyTo([25, 10], 2, { duration: 1 });
  }, [cible, map]);
  return null;
}

export default function CarteMonde({ courses, gpSelect, survol, saison, onSelect, drapeaux }) {
  const pos = (c) => {
    const l = c.Circuit?.Location;
    return l?.lat && l?.long ? [parseFloat(l.lat), parseFloat(l.long)] : null;
  };
  const sel = courses.find((c) => `${saison}-${c.round}` === gpSelect);
  const maintenant = new Date();

  return (
    <div className="carte-wrap">
      <MapContainer
        center={[25, 10]}
        zoom={2}
        minZoom={2}
        maxZoom={10}
        scrollWheelZoom={true}
        worldCopyJump={true}
        style={{ height: "100%", width: "100%", background: "#111113" }}
      >
        <TileLayer
          className="tuiles-sombres"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Vol cible={sel ? pos(sel) : null} />

        {courses.map((c) => {
          const p = pos(c);
          if (!p) return null;
          const cle = `${saison}-${c.round}`;
          const actif = gpSelect === cle;
          const hover = survol === c.round;
          const passee = new Date(c.date) < maintenant;
          return (
            <CircleMarker
              key={cle}
              center={p}
              radius={actif ? 11 : hover ? 10 : 7}
              pathOptions={{
                color: "#0c0c0d",
                weight: 2,
                fillColor: actif || hover ? "#f2efe9" : passee ? "#ff5a1f" : "#9a978f",
                fillOpacity: 1,
              }}
              eventHandlers={{ click: () => onSelect(c) }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <b>{drapeaux[c.Circuit.Location.country] || ""} {c.raceName}</b>
                <br />
                {c.Circuit.Location.locality} · R{c.round}
              </Tooltip>
            </CircleMarker>
          );
        })}
        {sel && pos(sel) && <Marker position={pos(sel)} icon={anneauPulse} interactive={false} />}
      </MapContainer>
    </div>
  );
}
