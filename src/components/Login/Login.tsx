import React from 'react';
import './Login.css'; 
import { FaUser, FaLock, FaTimes } from 'react-icons/fa'; // Importar iconos de FontAwesome
import loginImage from '../../assets/img/img-login.svg';

interface LoginProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onClose, onSwitchToRegister }) => {
  return (
    <div className="login">
      <div className="login__content">
        <div className="login__img">
          <img src={loginImage} alt="Login" /> 
        </div>

        <div className="login__forms">
          <div className="login__registre block" id="login-in">
            <button className="login__close-button" onClick={onClose}>
              <FaTimes /> 
            </button>
            <h1 className="login__title">Inicio de sesión</h1>

            <div className="login__box">
              <FaUser className="login__icon" /> 
              <input type="text" placeholder="Usuario o Correo" className="login__input" />
            </div>

            <div className="login__box">
              <FaLock className="login__icon" /> 
              <input type="password" placeholder="Contraseña" className="login__input" />
            </div>

            <a href="#" className="login__forgot">¿Has olvidado tu contraseña?</a>

            <a href="#" className="login__button">Inicio de sesión</a>

            <div>
              <span className="login__account">¿No tienes una cuenta? </span>
              <span className="login__signin" onClick={onSwitchToRegister}>
                Registrarse
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};