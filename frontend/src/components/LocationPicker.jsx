import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { LUCKNOW_CENTER } from "../utils/constants";
import L from "leaflet";

const markerIcon = new L.DivIcon({
  className: "",
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#6366F1;border:3px solid white;box-shadow:0 0 0 4px rgba(99,102,241,0.35)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function ClickHandler({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPicker({ value, onChange, height = 260 }) {
  const position = value?.lat ? [value.lat, value.lng] : [LUCKNOW_CENTER.lat, LUCKNOW_CENTER.lng];

  return (
    <div className="overflow-hidden rounded-xl border border-white/10" style={{ height }}>
      <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {value?.lat && <Marker position={[value.lat, value.lng]} icon={markerIcon} />}
        <ClickHandler onPick={onChange} />
      </MapContainer>
    </div>
  );
}
