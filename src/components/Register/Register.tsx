import React from 'react';
import './Register.css';
import { FaUser, FaEnvelope, FaLock, FaTimes } from 'react-icons/fa';
import registerImage from '../../assets/img/img-login.svg';

interface RegisterProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onClose, onSwitchToLogin }) => {
  return (
    <div className="register">
      <div className="register__content">
        <div className="register__img">
          <img src={registerImage} alt="Register" /> 
        </div>

        <div className="register__forms">
          <div className="register__create block" id="register-up">
            <button className="register__close-button" onClick={onClose}>
              <FaTimes />
            </button>
            <h1 className="register__title">Crear cuenta</h1>

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

            <a href="#" className="register__button">Registrarse</a>

            <div>
              <span className="register__account">¿Ya tienes una cuenta? </span>
              <span className="register__signup" onClick={onSwitchToLogin}>
                Inicio de sesión
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};