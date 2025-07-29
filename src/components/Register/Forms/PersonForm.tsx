import React, { useState } from 'react';
import Select from 'react-select';
import { Country, City } from 'country-state-city';
import { FaEnvelope, FaLock, FaIdCard, FaPhone, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

interface LocationRequest {
  country: string;
  city: string;
}

interface ContactRequest {
  phone: string;
  address: string;
}

interface RegularUserUpdateRequest {
  name: string;
  password: string;
  birthDate?: string;
  location: LocationRequest;
  contact: ContactRequest;
}

interface OptionType {
  value: string;
  label: string;
}

interface PersonFormProps {
  onSubmit: (data: RegularUserUpdateRequest) => void;
}

export const PersonForm: React.FC<PersonFormProps> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<OptionType | null>(null);
  const [selectedCity, setSelectedCity] = useState<OptionType | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data: RegularUserUpdateRequest = {
      name,
      password,
      birthDate: birthDate ? new Date(birthDate).toISOString() : undefined,
      location: {
        country,
        city,
      },
      contact: {
        phone,
        address,
      },
    };

    onSubmit(data);
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
        <FaIdCard className="register__icon" />
        <input
          type="text"
          placeholder="Nombre"
          className="register__input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="register__box">
        <FaEnvelope className="register__icon" />
        <input
          type="email"
          placeholder="Correo"
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
        <FaCalendarAlt className="register__icon" />
        <input
          type="date"
          placeholder="Fecha de nacimiento"
          className="register__input"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>

      <div className="register__box">
        <FaMapMarkerAlt className="register__icon" />
        <Select
          placeholder="Selecciona un país"
          value={selectedCountry}
          onChange={handleCountryChange}
          options={countryOptions}
          className="register__select"
        />
      </div>

      <div className="register__box">
        <FaMapMarkerAlt className="register__icon" />
        <Select
          placeholder="Selecciona una ciudad"
          value={selectedCity}
          onChange={handleCityChange}
          options={cityOptions}
          className="register__select"
          isDisabled={!selectedCountry}
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
        <FaMapMarkerAlt className="register__icon" />
        <input
          type="text"
          placeholder="Dirección"
          className="register__input"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <button type="submit" className="register__button">
        Registrarse
      </button>
    </form>
  );
};
