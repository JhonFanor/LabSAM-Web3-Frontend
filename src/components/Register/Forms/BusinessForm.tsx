import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaBuilding, FaUser } from 'react-icons/fa';

export const BusinessForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [companyName, setCompanyName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ companyName, username, email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="register__box">
        <FaBuilding className="register__icon" />
        <input type="text" placeholder="Nombre de la Empresa" className="register__input" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
      </div>
      <div className="register__box">
        <FaUser className="register__icon" />
        <input type="text" placeholder="Nombre de Usuario" className="register__input" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="register__box">
        <FaEnvelope className="register__icon" />
        <input type="text" placeholder="Correo Corporativo" className="register__input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="register__box">
        <FaLock className="register__icon" />
        <input type="password" placeholder="Contraseña" className="register__input" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" className="register__button">Registrarse</button>
    </form>
  );
};