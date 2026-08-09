import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import { SEVERITY_COLORS, LUCKNOW_CENTER } from "../utils/constants";

export default function IssueMap({ complaints = [], height = 440, center }) {
  const mapCenter = center
    ? [center.lat, center.lng]
    : complaints.length
    ? [complaints[0].location.lat, complaints[0].location.lng]
    : [LUCKNOW_CENTER.lat, LUCKNOW_CENTER.lng];

  return (
    <div
      className="overflow-hidden rounded-2xl border border-surface-border"
      style={{ height }}
    >
      <MapContainer
        center={mapCenter}
        zoom={12}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {complaints.map((c) => (
          <CircleMarker
            key={c.complaintId}
            center={[c.location.lat, c.location.lng]}
            radius={c.ai?.severity === "Critical" ? 9 : c.ai?.severity === "High" ? 7 : 5.5}
            pathOptions={{
              color: SEVERITY_COLORS[c.ai?.severity] || "#8A93A8",
              fillColor: SEVERITY_COLORS[c.ai?.severity] || "#8A93A8",
              fillOpacity: 0.65,
              weight: 1.5,
            }}
          >
            <Popup>
              <div className="min-w-[180px]">
                <p className="font-mono text-[10px] text-accent-indigo">{c.complaintId}</p>
                <p className="mt-0.5 text-xs font-bold">{c.title}</p>
                <p className="mt-0.5 text-[11px] text-white/50">{c.category} · {c.ai?.severity}</p>
                <Link
                  to={`/track/${c.complaintId}`}
                  className="mt-2 inline-block text-[11px] font-semibold text-accent-indigo hover:underline"
                >
                  View details 
                </Link>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
