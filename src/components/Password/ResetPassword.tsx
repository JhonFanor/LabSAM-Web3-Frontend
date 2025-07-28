import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPassword } from "../../api/AuthApi";
import "./ResetPassword.css"

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const ResetPassword: React.FC = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessage("");
        setErrorMessage("");

        if (!token) {
            setErrorMessage("Token inválido o faltante.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        }

        if (!passwordRegex.test(newPassword)) {
            setErrorMessage("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.");
            return;
        }

        try {
            await resetPassword({ token, new_password: newPassword });
            setSuccessMessage("Contraseña actualizada correctamente. Ya puedes iniciar sesión.");
        } catch (err) {
            setErrorMessage("Hubo un error al actualizar la contraseña.");
        }
    };

    return (
        <div className="reset-password-container">
            <form className="reset-password-form" onSubmit={handleSubmit}>
                <h2 className="reset-password-title">Nueva contraseña</h2>

                <div className="reset-password-input-group">
                    <label htmlFor="newPassword">Nueva contraseña</label>
                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Escribe tu nueva contraseña"
                        required
                    />
                </div>

                <div className="reset-password-input-group">
                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                    <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirma tu nueva contraseña"
                        required
                    />
                </div>

                {successMessage && <p className="reset-password-success">{successMessage}</p>}
                {errorMessage && <p className="reset-password-error">{errorMessage}</p>}

                <button type="submit" className="reset-password-button">
                    Cambiar contraseña
                </button>
            </form>
        </div>
    );
};
