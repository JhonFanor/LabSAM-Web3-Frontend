import React from 'react';
import { FaUser, FaEnvelope, FaLock, FaIdCard} from 'react-icons/fa';

export const PersonForm: React.FC = () => {
  return (
    <>
      <div className="register__box">
        <FaIdCard className="register__icon" />
        <input type="text" placeholder="Nombre" className="register__input" />
      </div>
      <div className="register__box">
        <FaUser className="register__icon" />
        <input type="text" placeholder="Nombre de Usuario" className="register__input" />
      </div>
      <div className="register__box">
        <FaEnvelope className="register__icon" />
        <input type="text" placeholder="Correo" className="register__input" />
      </div>
      <div className="register__box">
        <FaLock className="register__icon" />
        <input type="password" placeholder="Contraseña" className="register__input" />
      </div>
    </>
  );
};
