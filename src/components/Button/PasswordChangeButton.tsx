import { useState } from "react";
import "./PasswordChangeButton.css";
import PasswordChange from "../Password/PasswordChange";

const PasswordChangeButton = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="password-button-container">
            <button
                className="btn-toggle"
                onClick={() => setOpen((prev) => !prev)}
            >
                {open ? "Cerrar formulario" : "Cambiar contraseña"}
            </button>

            {open && (
                <div className="form-container">
                    <PasswordChange />
                </div>
            )}
        </div>
    );
};

export default PasswordChangeButton;
