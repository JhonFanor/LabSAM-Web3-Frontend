import React from 'react';
import { FaEnvelope, FaLock, FaBuilding, FaUser } from 'react-icons/fa';

export const BusinessForm: React.FC = () => {
  return (
    <>
      <div className="register__box">
        <FaBuilding className="register__icon" />
        <input type="text" placeholder="Nombre de la Empresa" className="register__input" />
      </div>
      <div className="register__box">
        <FaUser className="register__icon" />
        <input type="text" placeholder="Nombre de Usuario" className="register__input" />
      </div>
      <div className="register__box">
        <FaEnvelope className="register__icon" />
        <input type="text" placeholder="Correo Corporativo" className="register__input" />
      </div>
      <div className="register__box">
        <FaLock className="register__icon" />
        <input type="password" placeholder="Contraseña" className="register__input" />
      </div>
    </>
  );
};