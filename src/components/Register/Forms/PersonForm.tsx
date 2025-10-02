import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Country, City } from 'country-state-city';
import { FaEnvelope, FaLock, FaIdCard, FaPhone, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL;

interface LocationRequest {
    country: string;
    city: string;
}

interface ContactRequest {
    phone: string;
}

interface RegularUserUpdateRequest {
    name: string;
    email: string;
    password: string;
    birthDate?: string;
    location?: LocationRequest;
    contact?: ContactRequest;
}

interface OptionType {
    value: string;
    label: string;
}

const handlePersonSubmit = async (data: any) => {
    try {
        const response = await fetch(`${API_BASE}/auth/register/regular`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log('Person registration successful:', result);
    } catch (error) {
        console.error('Error registering person:', error);
    }
};

const isValidPassword = (password: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    return regex.test(password);
};

export const PersonForm: React.FC = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [selectedCountry, setSelectedCountry] = useState<OptionType | null>(null);
    const [selectedCity, setSelectedCity] = useState<OptionType | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (country && !city) {
            setSuccessMessage("Por favor selecciona una ciudad para el país seleccionado.");
            setIsSubmitting(false);
            return;
        }

        if (!isValidPassword(password)) {
            setSuccessMessage("⚠️ La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un carácter especial.");
            setIsSubmitting(false);
            return;
        }

        const data: RegularUserUpdateRequest = {
            name,
            email,
            password,
            birthDate: birthDate ? new Date(birthDate).toISOString() : undefined,
            location: {
                country,
                city,
            },
            contact: {
                phone,
            },
        };

        try {
            await handlePersonSubmit(data);
            setSuccessMessage(`🎉 Usuario "${name}" registrado con éxito, revisa tu correo para confirmar el tú registro`);

            setName('');
            setEmail('');
            setPassword('');
            setBirthDate('');
            setPhone('');
            setCountry('');
            setCity('');
            setSelectedCountry(null);
            setSelectedCity(null);
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
        } finally {
            setIsSubmitting(false); 
        }
    };

    useEffect(() => {
        if (successMessage) {
            const timeout = setTimeout(() => setSuccessMessage(null), 10000); 
            return () => clearTimeout(timeout);
        }
    }, [successMessage]);

    const countryOptions: OptionType[] = Country.getAllCountries().map((c) => ({
        value: c.isoCode,
        label: c.name,
    }));

    const cityOptions: OptionType[] =
        City.getCitiesOfCountry(selectedCountry?.value || '')?.map((c) => ({
        value: c.name,
        label: c.name,
        })) ?? [];

    const handleCountryChange = (option: OptionType | null) => {
        setSelectedCountry(option);
        setCountry(option?.label || '');
        setSelectedCity(null);
        setCity('');
    };

    const handleCityChange = (option: OptionType | null) => {
        setSelectedCity(option);
        setCity(option?.label || '');
    };

    return (
        <>
            {successMessage && (
                <div className="success-message">
                {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="register__box">
                    <FaIdCard className="register__icon" />
                    <label>Nombre:</label>
                    <input type="text" placeholder="Nombre*" className="register__input" value={name} onChange={(e) => setName(e.target.value)} required/>
                </div>

                <div className="register__box">
                    <FaEnvelope className="register__icon" />
                    <label>Correo:</label>
                    <input type="email" placeholder="Correo*" className="register__input" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>

                <div className="register__box">
                    <FaLock className="register__icon" />
                    <label>Contraseña:</label>
                    <input type="password" placeholder="Contraseña*" className="register__input" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>

                <div className="register__box">
                    <FaCalendarAlt className="register__icon" />
                    <label>Fecha de nacimiento:</label>
                    <input type="date" placeholder="Fecha de nacimiento" className="register__input" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} />
                </div>

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
                    <input type="text" placeholder="Teléfono" className="register__input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <button type="submit" className="register__button" disabled={isSubmitting}>
                    {isSubmitting ? "Registrando..." : "Registrarse"}
                </button>
            </form>
        </>
  );
};
