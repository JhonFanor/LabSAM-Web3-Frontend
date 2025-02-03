import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Header.css';

interface HeaderProps {
  toggleMenu: () => void;
  menuVisible: boolean; 
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleMenu, menuVisible, onLoginClick, onRegisterClick }) => {
  return (
    <header className="header">
      <div className="header__container">
        <img src="assets/img/perfil.jpg" alt="Profile" className="header__img" />
        <a href="#" className="header__logo">Bedimcode</a>
        <div className="right-aligned">
          <button onClick={onLoginClick} className="header__login__button">
            <span >Iniciar sesión</span>
          </button>
          <button onClick={onRegisterClick} className="header__login__button">
            <span >Registrarse</span>
          </button>
        </div>

        <div className="header__toggle" onClick={toggleMenu}>
          {menuVisible ? <FaTimes className="header__icon" /> : <FaBars className="header__icon" />}
        </div>
      </div>
    </header>
  );
};
