import React from 'react';
import { FaEnvelope, FaLock, FaUniversity, FaUser } from 'react-icons/fa';

export const UniversityForm: React.FC = () => {
  return (
    <>
      <div className="register__box">
        <FaUniversity className="register__icon" />
        <input type="text" placeholder="Nombre de la Universidad" className="register__input" />
      </div>
      <div className="register__box">
        <FaUser className="register__icon" />
        <input type="text" placeholder="Nombre de Usuario" className="register__input" />
      </div>
      <div className="register__box">
        <FaEnvelope className="register__icon" />
        <input type="text" placeholder="Correo Institucional" className="register__input" />
      </div>
      <div className="register__box">
        <FaLock className="register__icon" />
        <input type="password" placeholder="Contraseña" className="register__input" />
      </div>
    </>
  );
};
