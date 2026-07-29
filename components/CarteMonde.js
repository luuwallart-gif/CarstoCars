import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function CarteMonde({ courses, gpSelect, saison, onSelect, drapeaux }) {
  return (
    <div style={{
      borderRadius: "16px",
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,0.1)",
    }}>
      <MapContainer
        center={[25, 10]}
        zoom={2}
        minZoom={2}
        maxZoom={10}
        scrollWheelZoom={true}
        worldCopyJump={true}
        style={{ height: "550px", width: "100%", background: "#0a0a0a" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {courses.map((c) => {
          const loc = c.Circuit?.Location;
          if (!loc?.lat || !loc?.long) return null;

          const cle = `${saison}-${c.round}`;
          const actif = gpSelect === cle;

          return (
            <CircleMarker
              key={cle}
              center={[parseFloat(loc.lat), parseFloat(loc.long)]}
              radius={actif ? 12 : 8}
              pathOptions={{
                color: "#ffffff",
                weight: 2,
                fillColor: actif ? "#00d4ff" : "#e10600",
                fillOpacity: 0.95,
              }}
              eventHandlers={{
                click: () => onSelect(c),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div style={{ fontWeight: "700", fontSize: "13px" }}>
                  {drapeaux[loc.country] || "🏁"} {c.raceName}
                </div>
                <div style={{ fontSize: "11px", color: "#555" }}>
                  {loc.locality} • R{c.round}
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
