import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import "./map.css";
import { destinations } from "../data/destinations";

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
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

function MapController({ regionTarget, placeTarget }) {
  const map = useMap();
  React.useEffect(() => {
    if (regionTarget) map.flyTo(regionTarget, 6, { duration: 1.8 });
  }, [regionTarget, map]);
  React.useEffect(() => {
    if (placeTarget) map.flyTo([placeTarget.lat, placeTarget.lng], 8, { duration: 1.5 });
  }, [placeTarget, map]);
  return null;
}

const regions = {
  north:     [28.6139, 77.2090],
  south:     [12.9716, 77.5946],
  east:      [22.5726, 88.3639],
  west:      [19.076,  72.8777],
  northeast: [26.1445, 91.7362],
  central:   [23.2599, 77.4126],
};

export default function Map() {
  const { t } = useTranslation();
  const [selected,      setSelected]      = useState(null);
  const [regionTarget,  setRegionTarget]  = useState(null);
  const [placeTarget,   setPlaceTarget]   = useState(null);
  const [filters,       setFilters]       = useState({
    heritage: true, nature: true, beach: true, temple: true, wildlife: true,
  });

  const goRegion    = (r) => setRegionTarget(regions[r]);
  const selectPlace = (place) => { setSelected(place); setPlaceTarget(place); };
  const toggleFilter = (cat) => setFilters({ ...filters, [cat]: !filters[cat] });

  return (
    <div className="map-page">

      <div className="sidebar">
        <h2 className="title">{t('mapPage.title')}</h2>
        <p>{t('mapPage.clickMarkers')}</p>
        <br/>

        <h3>{t('mapPage.filterByCategory')}</h3>
        <div className="filters">
          {Object.keys(filters).map((cat) => (
            <label key={cat}>
              <input type="checkbox" checked={filters[cat]}
                onChange={() => toggleFilter(cat)} />
              {cat}
            </label>
          ))}
        </div>

        <h3>{t('mapPage.quickNav')}</h3>
        <div className="regions">
          <button onClick={() => goRegion("north")}>{t('mapPage.north')}</button>
          <button onClick={() => goRegion("south")}>{t('mapPage.south')}</button>
          <button onClick={() => goRegion("east")}>{t('mapPage.east')}</button>
          <button onClick={() => goRegion("west")}>{t('mapPage.west')}</button>
          <button onClick={() => goRegion("northeast")}>{t('mapPage.northeast')}</button>
          <button onClick={() => goRegion("central")}>{t('mapPage.central')}</button>
        </div>

        <div className="selected">
          <h3>{t('mapPage.selectedDest')}</h3>
          {selected ? (
            <>
              <h4>{selected.name}</h4>
              <p>{selected.description}</p>
              <p>📍 {selected.location}</p>
              <p>⭐ {selected.rating}</p>
              <p>🕒 {t('mapPage.bestTime')} {selected.bestTime}</p>
            </>
          ) : (
            <p>{t('mapPage.clickMarker')}</p>
          )}
        </div>
      </div>

      <MapContainer center={[22.5937, 78.9629]} zoom={5} className="map-container">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapController regionTarget={regionTarget} placeTarget={placeTarget} />
        {destinations
          .filter((d) => filters[d.category])
          .map((place) => (
            <Marker key={place.id} position={[place.lat, place.lng]}
              icon={createIcon(iconColors[place.category])}
              eventHandlers={{ click: () => selectPlace(place) }}>
              <Popup><b>{place.name}</b><br />{place.location}</Popup>
            </Marker>
          ))}
      </MapContainer>

      <div className="legend">
        <h4>{t('mapPage.legend')}</h4>
        {Object.entries(iconColors).map(([cat, color]) => (
          <div key={cat} className="legend-item">
            <img src={`https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`} alt="" />
            <span>{cat}</span>
          </div>
        ))}
      </div>

    </div>
  );
}