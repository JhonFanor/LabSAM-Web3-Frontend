import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaIdCard, FaUniversity, FaLink, FaGlobe, } from "react-icons/fa";
import Select from "react-select";
import { Country, City } from "country-state-city";
import "./Profile.css";
import { useAuth } from "../../providers/Auth";
import { FetchWithAuth } from "../../utils/FetchWithAuth";
import { ImageInputSelector } from "../Selector";
import { uploadImageFile } from "../../api";

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
    website: string;
}

interface UniversityType {
    id: number;
    name: string;
}

interface UniversityUser {
    name: string;
    university_type?: UniversityType;
    location?: Location;
    contact?: Contact;
}

interface UserResponse {
    id: number;
    email: string;
    avatar: string;
    role_id: number;
    university_user?: UniversityUser;
}

interface OptionType {
    value: string;
    label: string;
}

export const UniversityProfile: React.FC = () => {
    const { user } = useAuth();
    const [userData, setUserData] = useState<UserResponse | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<any>({});
    const [selectedCountry, setSelectedCountry] = useState<OptionType | null>(null);
    const [selectedCity, setSelectedCity] = useState<OptionType | null>(null);
    const [universityTypeOptions, setUniversityTypeOptions] = useState<OptionType[]>([]);
    const [selectedUniversityType, setSelectedUniversityType] = useState<OptionType | null>(null);
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
        const fetchUniversityTypes = async () => {
            try {
                const res = await fetch(`${API_BASE}/university-types`);
                const data: UniversityType[] = await res.json();
                const options = data.map((ut) => ({
                value: ut.id.toString(),
                label: ut.name,
                }));
                setUniversityTypeOptions(options);
            } catch (error) {
                console.error('Error fetching university types:', error);
            }
        };

        fetchUniversityTypes();
    }, []);
    
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
                const uniType = data.university_user?.university_type;
                setSelectedUniversityType(
                    uniType
                        ? { value: uniType.id.toString(), label: uniType.name }
                        : null
                );
            } catch (error) {
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

        const location = data.university_user?.location;
        const contact = data.university_user?.contact;

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
        if (data.university_user) {
            setEditedData({
                ...baseData,
                name: data.university_user.name,
                university_type_id: data.university_user.university_type?.id || "",
                university_type_name: data.university_user.university_type?.name || "",
                country: location?.country || "",
                city: location?.city || "",
                phone: contact?.phone || "",
                website: contact?.website || "",
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

            if (userData?.university_user) {
                updateData = {
                    name: editedData.name,
                    avatar: imagePath,
                    university_type: selectedUniversityType
                    ? { id: parseInt(selectedUniversityType.value, 10) }
                    : null,
                    location: {
                        country: editedData.country,
                        city: editedData.city,
                    },
                    contact: {
                        phone: editedData.phone,
                        website: editedData.website,
                    },
                };
            }

            const response = await FetchWithAuth(`${BASE_URL}/university/${user?.id}`, {
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
        } catch (error) {
            setError("Error al guardar los cambios");
        }
    };

    if (!user || !user.id) return <div className="user-profile loading">Cargando usuario...</div>;
    if (error) return <div className="user-profile error">{error}</div>;
    if (!userData) return <div className="user-profile loading">Cargando perfil...</div>;

    const userName =
        userData.university_user?.name ||
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

                        {userData.university_user && (
                            <div className="register__box">
                                <FaUniversity className="register__icon" />
                                <label>Tipo de Universidad:</label>
                                <Select placeholder="Tipo de Universidad *" value={selectedUniversityType} onChange={setSelectedUniversityType} options={universityTypeOptions} className="register__select" required/>
                            </div>
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

                        <div className="register__box">
                            <FaLink className="register__icon" />
                            <label>Sitio web:</label>
                            <input type="text" name="website" placeholder="Sitio web" className="register__input" value={editedData.website} onChange={handleInputChange} />
                        </div>
                    </div>
                ) : (
                    <>
                        <img src={userData.avatar || "/src/assets/img/avatar.png"} alt="Avatar" className="avatar" />
                        <div className="register__box">
                            <FaEnvelope className="register__icon" />
                            <label>:</label>
                            <span>{userData.email}</span>
                        </div>

                        {userData.university_user && (
                            <div className="user-section">
                            {userData.university_user.university_type && (
                                <div className="register__box">
                                    <FaUniversity className="register__icon" />
                                    <label>Tipo de universidad:</label>
                                    <span>{userData.university_user.university_type.name}</span>
                                </div>
                            )}
                            {userData.university_user.location && (
                                <div className="register__box">
                                    <FaMapMarkerAlt className="register__icon" />
                                    <label>Ubicación:</label>
                                    <span>{userData.university_user.location.city}, {userData.university_user.location.country}</span>
                                </div>
                            )}
                            {userData.university_user.contact && (
                                <>
                                    <div className="register__box">
                                        <FaPhone className="register__icon" />
                                        <label>Teléfono:</label>
                                        <span>{userData.university_user.contact.phone || "No disponible"}</span>
                                    </div>
                                    <div className="register__box">
                                        <FaGlobe className="register__icon" />
                                        <label>Sitio web:</label>
                                        <span>{userData.university_user.contact.website || "No disponible"}</span>
                                    </div>
                                </>
                            )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </>    
    );
};

