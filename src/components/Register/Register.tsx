import React, { useState } from 'react';
import './Register.css';
import { FaTimes } from 'react-icons/fa';
import registerImage from '../../assets/img/img-login.svg';
import { PersonForm } from './Forms/PersonForm';
import { BusinessForm } from './Forms/BusinessForm';
import { UniversityForm } from './Forms/UniversityForm';

interface RegisterProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onClose, onSwitchToLogin }) => {
  const [userType, setUserType] = useState<'person' | 'university' | 'company'>('person');

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

            <div className="register__type-selector">
              <button
                className={`register__type-button ${userType === 'person' ? 'active' : ''}`}
                onClick={() => setUserType('person')}
              >
                Persona
              </button>
              <button
                className={`register__type-button ${userType === 'university' ? 'active' : ''}`}
                onClick={() => setUserType('university')}
              >
                Universidad
              </button>
              <button
                className={`register__type-button ${userType === 'company' ? 'active' : ''}`}
                onClick={() => setUserType('company')}
              >
                Empresa
              </button>
            </div>

            {userType === 'person' && <PersonForm />}
            {userType === 'university' && <UniversityForm />}
            {userType === 'company' && <BusinessForm />}

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