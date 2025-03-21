import React, { useState } from "react";
import "./Login.css";
import { FaUser, FaLock, FaTimes } from "react-icons/fa"; // Importar iconos de FontAwesome
import loginImage from "../../assets/img/img-login.svg";
import { useAuth } from "../../providers/Auth"; // Importar el contexto de autenticación

interface LoginProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onClose, onSwitchToRegister }) => {
  const { login } = useAuth(); 
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(usernameOrEmail, password);
      console.log("Inicio de sesión exitoso!");
      onClose(); 
    } catch (err) {
      setError("Error en el inicio de sesión. Verifica tus credenciales.");
    }
  };

  return (
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

          {error && <p className="login__error">{error}</p>} 
          <form onSubmit={handleLoginSubmit}>
            <div className="login__box">
              <FaUser className="login__icon" />
              <input
                type="text"
                placeholder="Usuario o Correo"
                className="login__input"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
            </div>

            <div className="login__box">
              <FaLock className="login__icon" />
              <input
                type="password"
                placeholder="Contraseña"
                className="login__input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <a href="#" className="login__forgot">
              ¿Has olvidado tu contraseña?
            </a>

            <button type="submit" className="login__button">
              Inicio de sesión
            </button>
          </form>
          <div>
            <span className="login__account">¿No tienes una cuenta? </span>
            <span className="login__signin" onClick={onSwitchToRegister}>
              Registrarse
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
