import React, { useState } from 'react';
import Select from 'react-select';
import { Country, City } from 'country-state-city';
import {
  FaEnvelope,
  FaLock,
  FaUniversity,
  FaUser,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaLink
} from 'react-icons/fa';

interface OptionType {
  value: string;
  label: string;
}

interface UniversityFormProps {
  onSubmit: (data: any) => void;
}

export const UniversityForm: React.FC<UniversityFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [universityTypeId, setUniversityTypeId] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');

  const [selectedCountry, setSelectedCountry] = useState<OptionType | null>(null);
  const [selectedCity, setSelectedCity] = useState<OptionType | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      email,
      password,
      name,
      university_type: universityTypeId ? { id: parseInt(universityTypeId, 10) } : null,
      location: {
        country,
        city
      },
      contact: phone || website ? { phone, website } : null,
    };

    onSubmit(formData);
  };

  const countryOptions: OptionType[] = Country.getAllCountries().map((c) => ({
    value: c.isoCode,
    label: c.name,
  }));

  const cityOptions: OptionType[] =
    City.getCitiesOfCountry(selectedCountry?.value || '')?.map((c) => ({
      value: c.name,
      label: c.name,
    })) ?? [];

  const handleCountryChange = (option: OptionType | null) => {
    setSelectedCountry(option);
    setCountry(option?.label || '');
    setSelectedCity(null);
    setCity('');
  };

  const handleCityChange = (option: OptionType | null) => {
    setSelectedCity(option);
    setCity(option?.label || '');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="register__box">
        <FaUniversity className="register__icon" />
        <input
          type="text"
          placeholder="Nombre de la Universidad"
          className="register__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="register__box">
        <FaEnvelope className="register__icon" />
        <input
          type="email"
          placeholder="Correo Institucional"
          className="register__input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="register__box">
        <FaLock className="register__icon" />
        <input
          type="password"
          placeholder="Contraseña"
          className="register__input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="register__box">
        <FaUser className="register__icon" />
        <input
          type="number"
          placeholder="ID del Tipo de Universidad"
          className="register__input"
          value={universityTypeId}
          onChange={(e) => setUniversityTypeId(e.target.value)}
        />
      </div>

      <div className="register__box">
        <FaGlobe className="register__icon" />
        <Select
          placeholder="Selecciona un país *"
          value={selectedCountry}
          onChange={handleCountryChange}
          options={countryOptions}
          className="register__select"
        />
      </div>

      <div className="register__box">
        <FaMapMarkerAlt className="register__icon" />
        <Select
          placeholder="Selecciona una ciudad *"
          value={selectedCity}
          onChange={handleCityChange}
          options={cityOptions}
          isDisabled={!selectedCountry}
          className="register__select"
        />
      </div>

      <div className="register__box">
        <FaPhone className="register__icon" />
        <input
          type="text"
          placeholder="Teléfono"
          className="register__input"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div className="register__box">
        <FaLink className="register__icon" />
        <input
          type="text"
          placeholder="Sitio Web"
          className="register__input"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <button type="submit" className="register__button">
        Registrarse
      </button>
    </form>
  );
};
