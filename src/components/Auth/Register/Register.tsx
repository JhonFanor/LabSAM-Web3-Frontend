import React from 'react';
import './Register.css';

interface RegisterProps {
  onSwitch: () => void; // Función para cambiar a inicio
}

export const Register: React.FC<RegisterProps> = ({ onSwitch }) => {
  return (
    <form className="auth-form">
      <h1 className="auth-form__title">Create Account</h1>

      <div className="auth-form__field">
        <i className="bx bx-user auth-form__icon"></i>
        <input type="text" placeholder="Username" className="auth-form__input" />
      </div>

      <div className="auth-form__field">
        <i className="bx bx-at auth-form__icon"></i>
        <input type="text" placeholder="Email" className="auth-form__input" />
      </div>

      <div className="auth-form__field">
        <i className="bx bx-lock-alt auth-form__icon"></i>
        <input type="password" placeholder="Password" className="auth-form__input" />
      </div>

      <button type="submit" className="auth-form__button">Sign Up</button>

      <p className="auth-form__switch">
        Already have an account?{' '}
        <span className="auth-form__link" onClick={onSwitch}>
          Sign In
        </span>
      </p>
    </form>
  );
};
