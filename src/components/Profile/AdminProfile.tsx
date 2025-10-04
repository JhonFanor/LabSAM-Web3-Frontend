import React, { useEffect, useState } from "react";
import { FaEnvelope, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import "./Profile.css";
import { useAuth } from "../../providers/Auth";
import { FetchWithAuth } from "../../utils/FetchWithAuth";
import { ImageInputSelector } from "../Selector";
import { uploadImageFile } from "../../api";
import PasswordChangeButton from "../Button/PasswordChangeButton";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/user`;


interface UserResponse {
    id: number;
    email: string;
    avatar: string;
    role_id: number;
}

interface EditedUserData {
    email?: string;
    avatar?: string;
}

export const AdminProfile: React.FC = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState<UserResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<EditedUserData>({});
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [resetKey, setResetKey] = useState<number>(Date.now());

    useEffect(() => {
        if (!user || !user.id) return;

        const fetchUser = async () => {
        try {
            const response = await FetchWithAuth(`${BASE_URL}/${user.id}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Error al obtener el usuario");
            }

            const data: UserResponse = await response.json();
            setUserData(data);
        } catch {
            setError("No se pudo cargar el perfil del usuario.");
        }
        };

        fetchUser();
    }, [user]);

    const handleSave = async () => {
        try {
            let updateData = {};

            let imagePath = editedData.avatar;

            if (selectedImageFile) {
                imagePath = await uploadImageFile(selectedImageFile, "profile");
            }

            updateData = {
                avatar: imagePath,
            };

            const response = await FetchWithAuth(`${BASE_URL}/admin/${user?.id}`, {
                method: "PUT",
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el perfil");
            }

            const updatedResponse = await FetchWithAuth(`${BASE_URL}/${user?.id}`, {
                method: "GET",
            });

            if (updatedResponse.ok) {
                const updatedData: UserResponse = await updatedResponse.json();
                setUserData(updatedData);
            }
            setIsEditing(false);
        } catch {
            setError("Error al guardar los cambios");
        }
    };

    if (!user || !user.id) return <div className="user-profile loading">Cargando usuario...</div>;
    if (error) return <div className="user-profile error">{error}</div>;
    if (!userData) return <div className="user-profile loading">Cargando perfil...</div>;

    return (
        <>
            <div className="user-profile">
                <div className="profile-header">
                    {isEditing ? (
                        <div className="edit-actions">
                            <button onClick={handleSave} className="edit-button">
                                <FaSave /> Guardar
                            </button>
                            <button onClick={() => { setIsEditing(false); setResetKey(Date.now()); }} className="edit-button cancel">
                                <FaTimes /> Cancelar
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2>Administrador</h2>
                            <button onClick={() => setIsEditing(true)} className="edit-button">
                                <FaEdit /> Editar
                            </button>
                        </>
                    )}
                </div>

                {isEditing ? (
                    <div className="edit-section">
                        <ImageInputSelector value={editedData.avatar || ""} onChange={(img) => setEditedData({ ...editedData, avatar: img })} onFileSelected={setSelectedImageFile} urlLabel="📎 URL del imagen" fileLabel="🖼️ Subir el avatar" imageUploaderKey={resetKey} resetKey={resetKey}/>
                    </div>
                ) : (
                    <>
                        <img src={userData.avatar || "/src/assets/img/avatar.png"} alt="Avatar" className="avatar" />
                        <div className="register__box">
                            <FaEnvelope className="register__icon" />
                            <label>Correo:</label>
                            <span>{userData.email}</span>
                        </div>
                    </>
                )}
            </div>
            <PasswordChangeButton />
        </>
    );
};

