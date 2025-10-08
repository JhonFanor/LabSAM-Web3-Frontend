import React from 'react';
import './Header.css'; 

const Header: React.FC = () => {
    return (
        <div className="header-home">
            <img src="/src/assets/img/Logo.jpeg" alt="icono" className="header-home__logo" />
        </div>
    );
};

export default Header;
