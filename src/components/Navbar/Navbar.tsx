import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { Link, useLocation } from 'react-router-dom';
import { menuItems } from '../../constants/MenuItems';
import { FaSignOutAlt, FaChevronDown } from 'react-icons/fa'; 
import { useAuth } from '../../providers/Auth';
import { adminMenuItems } from '../../constants/AdminMenuItems';

interface NavbarProps {
    menuVisible: boolean;
    setMenuVisible: (visible: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ menuVisible, setMenuVisible }) => {
    const { isAuthenticated, isLoading, user, logout } = useAuth(); 
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    const navbarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuVisible &&
                navbarRef.current &&
                !navbarRef.current.contains(event.target as Node)
            ) {
                setMenuVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuVisible]);

    const handleDropdownToggle = (label: string) => {
        setActiveDropdown(activeDropdown === label ? null : label);
    };

    return (
        <div ref={navbarRef} className={`nav ${menuVisible ? 'show-menu' : ''}`} id="navbar">
            <nav className="nav__container">
                <div>
                    <Link to="/" className="nav__link nav__logo">
                        <img src="/src/assets/img/Logo.jpeg" alt="icono" className="nav__logo-img" />
                        <span className="nav__logo-name">LamSamWeb3</span>
                    </Link>

                    <div className="nav__list">
                        <div className="nav__items">
                            {(isAdminRoute && user?.role === 'admin' ? adminMenuItems : menuItems)
                                .filter((item) => {
                                    if (!isAuthenticated && item.label === 'Perfil') return false;
                                    if (item.label === 'Panel de Administración' && user?.role !== 'admin') return false;
                                    return true;
                                }).map((item) => (
                                <div key={item.route}>
                                    {item.children ? (
                                        <div className={`nav__link ${activeDropdown === item.label ? 'active' : ''}`} onClick={() => handleDropdownToggle(item.label)}>
                                            {item.icon && <item.icon className="nav__icon" />}
                                            <span className="nav__name">{item.label}</span>
                                            <FaChevronDown className="nav__icon nav__dropdown-icon" />
                                        </div>
                                    ) 
                                    : (
                                        item.route && (
                                            <Link
                                            to={item.route}
                                            className={`nav__link ${activeDropdown === item.label ? 'active' : ''}`}
                                            >
                                            {item.icon && <item.icon className="nav__icon" />}
                                            <span className="nav__name">{item.label}</span>
                                            </Link>
                                        )
                                    
                                    )}

                                    {item.children && activeDropdown === item.label && (
                                        <div className="nav__dropdown-collapse">
                                            <div className="nav__dropdown-content">
                                            {item.children
                                                .filter(child => child.label !== 'Publicaciones') 
                                                .map((child) => (
                                                    <Link key={child.route} to={child.route} className="nav__dropdown-item">
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {isAuthenticated && !isLoading && (
                    <Link to="/" className="nav__link nav__logout" onClick={(e) => { e.preventDefault(); logout(); }} >
                        <FaSignOutAlt className="nav__icon" />
                        <span className="nav__name">Cerrar sesión</span>
                    </Link>
                )}
            </nav>
        </div>
    );
};
