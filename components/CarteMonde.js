import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function CarteMonde({ courses, gpSelect, saison, onSelect, drapeaux }) {
  return (
    <div style={{
      borderRadius: "14px",
      overflow: "hidden",
      border: "1px solid #2a2a2e",
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
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap &copy; CARTO'
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
                color: "#0c0c0d",
                weight: 2,
                fillColor: actif ? "#f2efe9" : "#ff5a1f",
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
