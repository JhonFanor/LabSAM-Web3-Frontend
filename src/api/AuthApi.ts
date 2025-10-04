import { FetchWithAuth, FetchWithOptionalAuth } from "../utils/FetchWithAuth";

const API_BASE = import.meta.env.VITE_API_URL;
const AUTH_URL = `${API_BASE}/auth`;

export const sendResetPasswordEmail = async (email: string): Promise<void> => {
    const response = await FetchWithOptionalAuth(`${AUTH_URL}/forgot-password`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al solicitar recuperación de contraseña");
    }
};

export const resetPassword = async (data: {token: string; new_password: string;}) => {
    const response = await fetch(`${AUTH_URL}/reset-password`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("No se pudo restablecer la contraseña");
    }
};

export const passwordChange = async (data: { password: string; new_password: string }) => {
    const response = await FetchWithAuth(`${AUTH_URL}/password-change`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "No se pudo cambiar la contraseña");
    }

    return await response.json();
};