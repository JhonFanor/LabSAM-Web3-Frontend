import React from 'react';
import './Header.css'; 

const Header: React.FC = () => {
    return (
        <div className="header-home">
            <h1 className="header-home__title">LabSamWeb3</h1>
            <img src="/src/assets/img/Logo.jpeg" alt="icono" className="header-home__logo" />
        </div>
    );
};

export default Header;
