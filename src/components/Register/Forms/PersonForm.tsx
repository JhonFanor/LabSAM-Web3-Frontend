import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaLock, FaIdCard } from 'react-icons/fa';

export const PersonForm: React.FC<{ onSubmit: (data: any) => void }> = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, username, email, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="register__box">
        <FaIdCard className="register__icon" />
        <input type="text" placeholder="Nombre" className="register__input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="register__box">
        <FaUser className="register__icon" />
        <input type="text" placeholder="Nombre de Usuario" className="register__input" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div className="register__box">
        <FaEnvelope className="register__icon" />
        <input type="text" placeholder="Correo" className="register__input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="register__box">
        <FaLock className="register__icon" />
        <input type="password" placeholder="Contraseña" className="register__input" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button type="submit" className="register__button">Registrarse</button>
    </form>
  );
};