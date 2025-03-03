import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaUniversity, FaUser } from 'react-icons/fa';

export const UniversityForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [universityName, setUniversityName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ universityName, username, email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="register__box">
        <FaUniversity className="register__icon" />
        <input type="text" placeholder="Nombre de la Universidad" className="register__input" value={universityName} onChange={(e) => setUniversityName(e.target.value)} />
      </div>
      <div className="register__box">
        <FaUser className="register__icon" />
        <input type="text" placeholder="Nombre de Usuario" className="register__input" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="register__box">
        <FaEnvelope className="register__icon" />
        <input type="text" placeholder="Correo Institucional" className="register__input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="register__box">
        <FaLock className="register__icon" />
        <input type="password" placeholder="Contraseña" className="register__input" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" className="register__button">Registrarse</button>
    </form>
  );
};