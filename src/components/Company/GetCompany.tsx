import React from "react";
import "./GetCompany.css";
import { CompanyGetResponse } from "../../dtos/responses/Company";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface GetCompanyProps {
  company: CompanyGetResponse;
}

export const GetCompany: React.FC<GetCompanyProps> = ({ company }) => {
  return (
    <div className="company-container">
      <h1 className="company-title">{company.name}</h1>

      <div className="company-meta-container">
        <p className="company-meta">Industria: {company.industry}</p>
        {company.website && (
          <p className="company-meta">
            🌐 Sitio web:{" "}
            <a href={company.website} target="_blank" rel="noopener noreferrer">
              {company.website}
            </a>
          </p>
        )}
        {company.email && <p className="company-meta">Correo: {company.email}</p>}

        <p className="company-meta">
          Registrada por:{" "}
          {company.user.regular_user?.name ||
            company.user.university_user?.name ||
            company.user.business_user?.name ||
            "Anónimo"}
        </p>
      </div>

      <p className="company-meta">Subtemas: {company.subtopics.map((s) => s.name).join(", ")}</p>

      {company.localitation && (
        <div className="company-map-container">
          <h3>📍 Ubicación</h3>
          <p className="company-meta">{company.localitation.address}</p>
          <MapContainer
            center={[company.localitation.latitude, company.localitation.longitude]}
            zoom={15}
            scrollWheelZoom={false}
            className="company-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[company.localitation.latitude, company.localitation.longitude]}>
              <Popup>{company.localitation.address}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};
