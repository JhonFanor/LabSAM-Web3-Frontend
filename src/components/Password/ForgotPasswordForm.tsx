import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import image from "../../assets/img/Logo.jpeg";
import { ButtonClose } from "../Button";
import { sendResetPasswordEmail } from "../../api/AuthApi";
import "./ForgotPasswordForm.css";

interface ForgotPasswordProps {
	onClose: () => void;
	onSwitchToLogin: () => void;
	onSwitchToRegister: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onClose, onSwitchToLogin, onSwitchToRegister }) => {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage(null);
		setError(null);

		try {
			await sendResetPasswordEmail(email);
			setMessage("Se ha enviado un enlace para restablecer la contraseña.");
		} catch {
			setError("No se pudo enviar el correo. Intenta de nuevo.");
		}
	};

	return (
		<div className="forgot__content">
			<div className="forgot__image">
				<img src={image} alt="Forgot Password" />
			</div>

			<div className="forgot__form-wrapper">
				<div className="forgot__form">
					<ButtonClose onClick={onClose} />
					<h1 className="forgot__title">Recuperar contraseña</h1>

					{error && <p className="forgot__error">{error}</p>}
					{message && <p className="forgot__message">{message}</p>}

					<form onSubmit={handleSubmit}>
						<div className="forgot__input-group">
							<FaEnvelope className="forgot__icon" />
							<input
								type="email"
								placeholder="Correo"
								className="forgot__input"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<button type="submit" className="forgot__button">
							Enviar enlace
						</button>
					</form>

					<div className="forgot__switch-links">
						<p>
							¿Ya lo recordaste?{" "}
							<span className="forgot__link" onClick={onSwitchToLogin}>
								Inicia sesión
							</span>
						</p>
						<p>
							¿No tienes una cuenta?{" "}
							<span className="forgot__link" onClick={onSwitchToRegister}>
								Registrarse
							</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
