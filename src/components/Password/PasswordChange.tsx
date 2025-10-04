import React, { useState } from "react";
import "./PasswordChange.css";
import { passwordChange } from "../../api/AuthApi";

const isValidPassword = (password: string) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return regex.test(password);
};

const PasswordChange = () => {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas nuevas no coinciden");
            return;
        }

        if (!isValidPassword(newPassword)) {
            setError(
                "⚠️ La nueva contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un carácter especial."
            );
            return;
        }

        try {
            setLoading(true);
            const data = await passwordChange({ password, new_password: newPassword });

            setMessage(data.message || "Contraseña actualizada exitosamente ✅");
            setPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setError((err instanceof Error) ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="password-container">
        <h2 className="password-title">Cambiar contraseña</h2>

        {error && <div className="password-error">{error}</div>}
        {message && <div className="password-success">{message}</div>}

        <form onSubmit={handleSubmit} className="password-form">
            <div className="form-group">
                <label>Contraseña actual</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="form-group">
                <label>Nueva contraseña</label>
                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            </div>

            <div className="form-group">
                <label>Confirmar nueva contraseña</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>

            <button type="submit" disabled={loading} className="btn-submit">
                {loading ? "Guardando..." : "Cambiar contraseña"}
            </button>
        </form>
        </div>
    );
};

export default PasswordChange;
