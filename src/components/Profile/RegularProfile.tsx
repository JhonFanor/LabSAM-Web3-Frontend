import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaIdCard, FaCalendarAlt, } from "react-icons/fa";
import Select from "react-select";
import { Country, City } from "country-state-city";
import "./Profile.css";
import { useAuth } from "../../providers/Auth";
import { FetchWithAuth } from "../../utils/FetchWithAuth";
import { ImageInputSelector } from "../Selector";
import { uploadImageFile } from "../../api";
import PasswordChangeButton from "../Button/PasswordChangeButton";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/user`;

interface Location {
    id: number;
    country: string;
    city: string;
}

interface Contact {
    id: number;
    phone: string;
}

interface RegularUser {
    name: string;
    birth_date?: string;
    location?: Location;
    contact?: Contact;
}

interface UserResponse {
    id: number;
    email: string;
    avatar: string;
    role_id: number;
    regular_user?: RegularUser;
}

interface OptionType {
    value: string;
    label: string;
}

interface EditedUserData {
    email?: string;
    avatar?: string;
    name?: string;
    birth_date?: string;
    country?: string;
    city?: string;
    phone?: string;
    website?: string;
}

export const RegularProfile: React.FC = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState<UserResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<EditedUserData>({});
    const [selectedCountry, setSelectedCountry] = useState<OptionType | null>(null);
    const [selectedCity, setSelectedCity] = useState<OptionType | null>(null);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [resetKey, setResetKey] = useState<number>(Date.now());

    const countryOptions: OptionType[] = Country.getAllCountries().map((c) => ({
        value: c.isoCode,
        label: c.name,
    }));

    const cityOptions: OptionType[] =
        City.getCitiesOfCountry(selectedCountry?.value || "")?.map((c) => ({
            value: c.name,
            label: c.name,
        })) ?? [];

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
            initializeEditedData(data);
        } catch {
            setError("No se pudo cargar el perfil del usuario.");
        }
        };

        fetchUser();
    }, [user]);

    const initializeEditedData = (data: UserResponse) => {
        const baseData = {
        email: data.email,
        avatar: data.avatar,
        };

        const location = data.regular_user?.location;
        const contact = data.regular_user?.contact;

        if (location?.country) {
        const foundCountry = countryOptions.find((c) => c.label === location.country);
        if (foundCountry) {
            setSelectedCountry(foundCountry);
            const cities = City.getCitiesOfCountry(foundCountry.value);
            const foundCity = cities?.find((c) => c.name === location.city);
            if (foundCity) {
            setSelectedCity({ value: foundCity.name, label: foundCity.name });
            }
        }
        }

        if (data.regular_user) {
            setEditedData({
                ...baseData,
                avatar: data.avatar,
                name: data.regular_user.name,
                birth_date: data.regular_user.birth_date?.split("T")[0] || "",
                country: location?.country || "",
                city: location?.city || "",
                phone: contact?.phone || "",
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedData({
        ...editedData,
        [name]: value,
        });
    };

    const handleCountryChange = (option: OptionType | null) => {
        setSelectedCountry(option);
        setEditedData({
        ...editedData,
        country: option?.label || "",
        city: "",
        });
        setSelectedCity(null);
    };

    const handleCityChange = (option: OptionType | null) => {
        setSelectedCity(option);
        setEditedData({
        ...editedData,
        city: option?.label || "",
        });
    };

    const handleSave = async () => {
        try {
            if (editedData.country && !editedData.city) {
                setError("Por favor selecciona una ciudad para el país seleccionado.");
                return;
            }
            let updateData = {};

            let imagePath = editedData.avatar;

            if (selectedImageFile) {
                imagePath = await uploadImageFile(selectedImageFile, "profile");
            }

            updateData = {
                name: editedData.name,
                avatar: imagePath,
                birth_date: editedData.birth_date ? new Date(editedData.birth_date).toISOString() : null,
                location: {
                    country: editedData.country,
                    city: editedData.city,
                },
                contact: {
                    id: userData?.regular_user?.contact?.id,
                    phone: editedData.phone,
                    website: editedData.website,
                },
            };
            console.log(updateData)
            const response = await FetchWithAuth(`${BASE_URL}/regular/${user?.id}`, {
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

    const userName =
        userData.regular_user?.name ||
        "Sin nombre";

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
                            <h2>{userName}</h2>
                            <button onClick={() => setIsEditing(true)} className="edit-button">
                                <FaEdit /> Editar
                            </button>
                        </>
                    )}
                </div>

                {isEditing ? (
                    <div className="edit-section">
                        <ImageInputSelector value={editedData.avatar || ""} onChange={(img) => setEditedData({ ...editedData, avatar: img })} onFileSelected={setSelectedImageFile} urlLabel="📎 URL del imagen" fileLabel="🖼️ Subir el avatar" imageUploaderKey={resetKey} resetKey={resetKey}/>

                        <div className="register__box">
                            <FaIdCard className="register__icon" />
                            <label>Nombre:</label>
                            <input type="text" name="name" placeholder="Nombre" className="register__input" value={editedData.name} onChange={handleInputChange} />
                        </div>

                        {userData.regular_user && (
                            <>
                                <div className="register__box">
                                    <FaCalendarAlt className="register__icon" />
                                    <label>Fecha de nacimiento:</label>
                                    <input type="date" name="birth_date" className="register__input" value={editedData.birth_date} onChange={handleInputChange} />
                                </div>
                            </>
                        )}

                        <div className="register__box">
                            <FaMapMarkerAlt className="register__icon" />
                            <label>País:</label>
                            <Select placeholder="Selecciona un país" value={selectedCountry} onChange={handleCountryChange} options={countryOptions} className="register__select" />
                        </div>

                        <div className="register__box">
                            <FaMapMarkerAlt className="register__icon" />
                            <label>Ciudad:</label>
                            <Select placeholder="Selecciona una ciudad" value={selectedCity} onChange={handleCityChange} options={cityOptions} className="register__select" isDisabled={!selectedCountry} />
                        </div>

                        <div className="register__box">
                            <FaPhone className="register__icon" />
                            <label>Teléfono:</label>
                            <input type="text" name="phone" placeholder="Teléfono" className="register__input" value={editedData.phone} onChange={handleInputChange} />
                        </div>
                    </div>
                ) : (
                    <>
                        <img src={userData.avatar || "/src/assets/img/avatar.png"} alt="Avatar" className="avatar" />
                        <div className="register__box">
                            <FaEnvelope className="register__icon" />
                            <label>Correo:</label>
                            <span>{userData.email}</span>
                        </div>

                        {userData.regular_user && (
                            <div className="user-section">
                            {userData.regular_user.birth_date && (
                                <div className="register__box">
                                    <FaCalendarAlt className="register__icon" />
                                    <label>Fecha de nacimiento:</label>
                                    <span>
                                        {new Date(userData.regular_user.birth_date).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                            {userData.regular_user.location && (
                                <>
                                    <div className="register__box">
                                        <FaMapMarkerAlt className="register__icon" />
                                        <label>Ubicación:</label>
                                        <span>{userData.regular_user.location.city}, {userData.regular_user.location.country}</span>
                                    </div>
                                </>
                            )}
                            {userData.regular_user.contact && (
                                <>
                                    <div className="register__box">
                                        <FaPhone className="register__icon" />
                                        <label>Teléfono:</label>
                                        <span>{userData.regular_user.contact.phone || "No disponible"}</span>
                                    </div>
                                </>
                            )}
                            </div>
                        )}
                    </>
                )}
            </div>
            <PasswordChangeButton />
        </>    
    );
};

