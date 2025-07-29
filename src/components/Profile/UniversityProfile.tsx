import React, { useEffect, useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaIdCard, FaUniversity, FaLink, FaGlobe, } from "react-icons/fa";
import Select from "react-select";
import { Country, City } from "country-state-city";
import "./Profile.css";
import { useAuth } from "../../providers/Auth";
import { FetchWithAuth } from "../../utils/FetchWithAuth";

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
        let updateData = {};

        if (userData?.university_user) {
            updateData = {
            name: editedData.name,
            university_type_id: editedData.university_type_id,
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

        const response = await FetchWithAuth(`${BASE_URL}/${user?.id}`, {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            throw new Error("Error al actualizar el perfil");
        }

        const updatedUser = await response.json();
        setUserData(updatedUser);
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
        <div className="user-profile">
        <div className="profile-header">
            <h2>{userName}</h2>
            {isEditing ? (
            <div className="edit-actions">
                <button onClick={handleSave} className="edit-button">
                    <FaSave /> Guardar
                </button>
                <button onClick={() => setIsEditing(false)} className="edit-button cancel">
                    <FaTimes /> Cancelar
                </button>
            </div>
            ) : (
            <button onClick={() => setIsEditing(true)} className="edit-button">
                <FaEdit /> Editar
            </button>
            )}
        </div>

        <img src={userData.avatar || "/src/assets/img/avatar.png"} alt="Avatar" className="avatar" />

        {isEditing ? (
            <div className="edit-section">
            <div className="register__box">
                <FaEnvelope className="register__icon" />
                <input type="email" name="email" placeholder="Correo electrónico" className="register__input" value={editedData.email} onChange={handleInputChange} disabled />
            </div>

            <div className="register__box">
                <FaIdCard className="register__icon" />
                <input
                type="text"
                name="name"
                placeholder="Nombre"
                className="register__input"
                value={editedData.name}
                onChange={handleInputChange}
                />
            </div>

            {userData.university_user && (
                <div className="register__box">
                <FaUniversity className="register__icon" />
                <input
                    type="text"
                    name="university_type_name"
                    placeholder="Tipo de universidad"
                    className="register__input"
                    value={editedData.university_type_name}
                    onChange={handleInputChange}
                />
                </div>
            )}

            <div className="register__box">
                <FaMapMarkerAlt className="register__icon" />
                <Select
                placeholder="Selecciona un país"
                value={selectedCountry}
                onChange={handleCountryChange}
                options={countryOptions}
                className="register__select"
                />
            </div>

            <div className="register__box">
                <FaMapMarkerAlt className="register__icon" />
                <Select
                placeholder="Selecciona una ciudad"
                value={selectedCity}
                onChange={handleCityChange}
                options={cityOptions}
                className="register__select"
                isDisabled={!selectedCountry}
                />
            </div>

            <div className="register__box">
                <FaPhone className="register__icon" />
                <input
                type="text"
                name="phone"
                placeholder="Teléfono"
                className="register__input"
                value={editedData.phone}
                onChange={handleInputChange}
                />
            </div>

            <div className="register__box">
                <FaLink className="register__icon" />
                <input
                type="text"
                name="website"
                placeholder="Sitio web"
                className="register__input"
                value={editedData.website}
                onChange={handleInputChange}
                />
            </div>
            </div>
        ) : (
            <>
          <div className="register__box">
            <FaEnvelope className="register__icon" />
            <span>{userData.email}</span>
          </div>

          {userData.university_user && (
            <div className="user-section">
              {userData.university_user.university_type && (
                <div className="register__box">
                  <FaUniversity className="register__icon" />
                  <span>{userData.university_user.university_type.name}</span>
                </div>
              )}
              {userData.university_user.location && (
                <div className="register__box">
                  <FaMapMarkerAlt className="register__icon" />
                  <span>{userData.university_user.location.city}, {userData.university_user.location.country}</span>
                </div>
              )}
              {userData.university_user.contact && (
                <>
                  <div className="register__box">
                    <FaPhone className="register__icon" />
                    <span>{userData.university_user.contact.phone || "No disponible"}</span>
                  </div>
                  <div className="register__box">
                    <FaGlobe className="register__icon" />
                    <span>{userData.university_user.contact.website || "No disponible"}</span>
                  </div>
                </>
              )}
            </div>
          )}
        </>
        )}
        </div>
    );
};

