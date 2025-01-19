import React from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Header.css';
import { Link } from 'react-router-dom';

interface HeaderProps {
  toggleMenu: () => void;
  menuVisible: boolean; // Añadir estado del menú como prop
}

export const Header: React.FC<HeaderProps> = ({ toggleMenu, menuVisible }) => {
  return (
    <header className="header">
      <div className="header__container">
        <img src="assets/img/perfil.jpg" alt="Profile" className="header__img" />
        <a href="#" className="header__logo">Bedimcode</a>
        <div className="right-aligned">
          <Link to="/sing-in" className="header__auth-link">
            <span className="login__button">Iniciar sesión</span>
          </Link>
          <Link to="/sing-in" className="header__auth-link">
            <span className="login__button">Registrarse</span>
          </Link>
        </div>

        <div className="header__toggle" onClick={toggleMenu}>
          {menuVisible ? <FaTimes className="header__icon" /> : <FaBars className="header__icon" />}
        </div>
      </div>
    </header>
  );
};
