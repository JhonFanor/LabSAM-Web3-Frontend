import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "./Localitation.css"
import 'leaflet/dist/leaflet.css';


interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

interface LocalitationProps {
  value: Location;
  onChange: (location: Location) => void;
}

export const Localitation: React.FC<LocalitationProps> = ({ value, onChange }) => {
  const [markerPosition, setMarkerPosition] = useState<[number, number]>([
    value.latitude || 4.5709, 
    value.longitude || -74.2973,
  ]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        fetchAddress(lat, lng);
      },
    });
    return null;
  };

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      const address = data.display_name || "";
      onChange({ address, latitude: lat, longitude: lng });
    } catch (err) {
      console.error("Error fetching address", err);
    }
  };

  useEffect(() => {
    setMarkerPosition([value.latitude, value.longitude]);
  }, [value]);

  return (
    <div className="localitation-container">
      <div className="map-container">
        <MapContainer center={markerPosition} zoom={9} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler />
          <Marker position={markerPosition} icon={L.icon({ iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png" })} />
        </MapContainer>
      </div>

      <div className="address-container">
        <p><strong>Dirección:</strong> {value.address || "Haz clic en el mapa para seleccionar una ubicación."}</p>
      </div>
    </div>
  );
};