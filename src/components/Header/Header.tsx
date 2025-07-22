import React from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import "./Header.css";
import { useAuth } from "../../providers/Auth"; 

interface HeaderProps {
    toggleMenu: () => void;
    menuVisible: boolean;
    onLoginClick: () => void;
    onRegisterClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({toggleMenu, menuVisible, onLoginClick, onRegisterClick,}) => {
    const { isAuthenticated, isLoading  } = useAuth();
    const { user } = useAuth();
    return (
        <header className="header">
            <div className="header__container">
                {user && (
                    <img src={user.avatar ? user.avatar : "/src/assets/img/avatar.png"} alt="Profile" className="header__img" />
                )}

                
                <a href="#" className="header__logo">LambamWeb3</a>

                <div className="right-aligned">
                {!isAuthenticated && !isLoading &&( 
                    <>
                        <button onClick={onLoginClick} className="header__login__button">
                            Iniciar sesión
                        </button>
                        <button onClick={onRegisterClick} className="header__login__button">
                            Registrarse
                        </button>
                    </>
                )}
                </div>

                <div className="header__toggle" onClick={toggleMenu}>
                    {menuVisible ? <FaTimes className="header__icon" /> : <FaBars className="header__icon" />}
                </div>
            </div>
        </header>
    );
};
