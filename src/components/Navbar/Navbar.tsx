import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { menuItems } from '../../constants/MenuItems';
import { FaSignOutAlt, FaChevronDown, FaCircle } from 'react-icons/fa'; 
import { useAuth } from '../../providers/Auth';

interface NavbarProps {
  menuVisible: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ menuVisible }) => {
  const { isAuthenticated, isLoading, logout } = useAuth(); // Obtener usuario y función logout
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  return (
    <div className={`nav ${menuVisible ? 'show-menu' : ''}`} id="navbar">
      <nav className="nav__container">
        <div>
          <Link to="/" className="nav__link nav__logo">
            <FaCircle className="nav__icon" />
            <span className="nav__logo-name">Bedimcode</span>
          </Link>

          <div className="nav__list">
            <div className="nav__items">
              {menuItems.map((item) => (
                <div key={item.route}>
                  {
                    item.children ? (
                      <div className={`nav__link ${activeDropdown === item.label ? 'active' : ''}`} onClick={() => handleDropdownToggle(item.label)}>
                        {item.icon && <item.icon className="nav__icon" />}
                        <span className="nav__name">{item.label}</span>
                        <FaChevronDown className="nav__icon nav__dropdown-icon" />
                      </div>
                    ) : (
                      item.route && (
                        <Link
                          to={item.route}
                          className={`nav__link ${activeDropdown === item.label ? 'active' : ''}`}
                        >
                          {item.icon && <item.icon className="nav__icon" />}
                          <span className="nav__name">{item.label}</span>
                        </Link>
                      )
                    )
                  }

                  {item.children && activeDropdown === item.label && (
                    <div className="nav__dropdown-collapse">
                      <div className="nav__dropdown-content">
                        {item.children.map((child) => (
                          <Link
                            key={child.route}
                            to={child.route}
                            className="nav__dropdown-item"
                          >
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
        {isAuthenticated && !isLoading &&(
          <Link
            to="/"
            className="nav__link nav__logout" 
            onClick={(e) => {
              e.preventDefault();
              logout();
            }}
          >
            <FaSignOutAlt className="nav__icon" />
            <span className="nav__name">Cerrar sesión</span>
          </Link>
        )}
      </nav>
    </div>
  );
};
