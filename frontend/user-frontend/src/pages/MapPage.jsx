import React from "react";
import Map from "./Map";   // the leaflet component you created

export default function MapPage() {
  return (
    <div style={{ height: "calc(100vh - 70px)" }}>
      <Map />
    </div>
  );
}