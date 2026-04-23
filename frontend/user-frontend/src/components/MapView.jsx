import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function FitBounds({ destinations }) {
  const map = useMap();
  useEffect(() => {
    if (!destinations?.length) return;
    const bounds = L.latLngBounds(
      destinations
        .filter((d) => d.coordinates?.lat != null && d.coordinates?.lng != null)
        .map((d) => [d.coordinates.lat, d.coordinates.lng])
    );
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [30, 30] });
  }, [map, destinations]);
  return null;
}

export default function MapView({ destinations, selectedCategory, onCategoryChange }) {
  const categories = [...new Set(destinations?.flatMap((d) => d.categories || []) || [])];

  return (
    <div className="h-[500px] rounded-xl overflow-hidden border border-slate-200 bg-white shadow">
      {onCategoryChange && categories.length > 0 && (
        <div className="absolute top-4 left-4 z-[1000] flex gap-2 flex-wrap">
          <button
            onClick={() => onCategoryChange(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium shadow ${!selectedCategory ? "bg-saffron text-white" : "bg-white text-slate-700"}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium shadow ${selectedCategory === cat ? "bg-saffron text-white" : "bg-white text-slate-700"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        className="h-full w-full"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds destinations={destinations} />
        {destinations
          ?.filter((d) => d.coordinates?.lat != null && d.coordinates?.lng != null)
          .filter((d) => !selectedCategory || (d.categories || []).includes(selectedCategory))
          .map((d) => (
            <Marker key={d._id} position={[d.coordinates.lat, d.coordinates.lng]}>
              <Popup>{d.name}</Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
