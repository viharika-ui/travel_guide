import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "./map.css";
import { destinations } from "../data/destinations";

/* ---------------- ICONS ---------------- */

const iconColors = {
  heritage: "red",
  nature: "green",
  beach: "blue",
  temple: "orange",
  wildlife: "violet",
};

const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    shadowUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

/* ---------------- REGION CONTROLLER ---------------- */

function MapController({ regionTarget, placeTarget }) {
  const map = useMap();

  React.useEffect(() => {
    if (regionTarget) {
      map.flyTo(regionTarget, 6, { duration: 1.8 });
    }
  }, [regionTarget, map]);

  React.useEffect(() => {
    if (placeTarget) {
      map.flyTo([placeTarget.lat, placeTarget.lng], 8, { duration: 1.5 });
    }
  }, [placeTarget, map]);

  return null;
}

/* ---------------- REGIONS ---------------- */

const regions = {
  north: [28.6139, 77.2090],
  south: [12.9716, 77.5946],
  east: [22.5726, 88.3639],
  west: [19.076, 72.8777],
  northeast: [26.1445, 91.7362],
  central: [23.2599, 77.4126],
};

export default function Map() {
  const [selected, setSelected] = useState(null);
  const [regionTarget, setRegionTarget] = useState(null);
  const [placeTarget, setPlaceTarget] = useState(null);

  const [filters, setFilters] = useState({
    heritage: true,
    nature: true,
    beach: true,
    temple: true,
    wildlife: true,
  });

  const goRegion = (r) => {
    setRegionTarget(regions[r]);
  };

  const selectPlace = (place) => {
    setSelected(place);
    setPlaceTarget(place);
  };

  const toggleFilter = (cat) =>
    setFilters({ ...filters, [cat]: !filters[cat] });

  return (
    <div className="map-page">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="title" >🧭 Explore India</h2>
        <h2 className="title" >🧭 Explore India</h2>
        <p>click on markers to discover destinations</p>
        <br/>
        <h3>Filter by Category</h3>
        <div className="filters">
          {Object.keys(filters).map((cat) => (
            <label key={cat}>
              <input
                type="checkbox"
                checked={filters[cat]}
                onChange={() => toggleFilter(cat)}
              />
              {cat}
            </label>
          ))}
        </div>

        <h3>Quick Navigation</h3>
        <div className="regions">
          <button onClick={() => goRegion("north")}>North India</button>
          <button onClick={() => goRegion("south")}>South India</button>
          <button onClick={() => goRegion("east")}>East India</button>
          <button onClick={() => goRegion("west")}>West India</button>
          <button onClick={() => goRegion("northeast")}>North East</button>
          <button onClick={() => goRegion("central")}>Central India</button>
        </div>

        <div className="selected">
          <h3>Selected Destination</h3>
          {selected ? (
            <>
              <h4>{selected.name}</h4>
              <p>{selected.description}</p>
              <p>📍 {selected.location}</p>
              <p>⭐ {selected.rating}</p>
              <p>🕒 Best time: {selected.bestTime}</p>
            </>
          ) : (
            <p>Click a marker to see details</p>
          )}
        </div>
      </div>

      {/* MAP */}
      <MapContainer center={[22.5937, 78.9629]} zoom={5} className="map-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <MapController regionTarget={regionTarget} placeTarget={placeTarget} />

        {destinations
          .filter((d) => filters[d.category])
          .map((place) => (
            <Marker
              key={place.id}
              position={[place.lat, place.lng]}
              icon={createIcon(iconColors[place.category])}
              eventHandlers={{ click: () => selectPlace(place) }}
            >
              <Popup>
                <b>{place.name}</b>
                <br />
                {place.location}
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* LEGEND */}
      <div className="legend">
        <h4>Legend</h4>
        {Object.entries(iconColors).map(([cat, color]) => (
          <div key={cat} className="legend-item">
            <img
              src={`https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`}
              alt=""
            />
            <span>{cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}