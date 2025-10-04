import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Country, City } from 'country-state-city';
import {
  FaEnvelope,
  FaLock,
  FaUniversity,
  FaUser,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaLink
} from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = `${API_BASE}/auth/register/university`;

const handleUniversitySubmit = async (data: any) => {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log('University registration successful:', result);
    } catch (error) {
        console.error('Error registering university:', error);
    }
};

interface OptionType {
  value: string;
  label: string;
}

interface UniversityType {
    id: number;
    name: string;
}

const isValidPassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return regex.test(password);
};

export const UniversityForm: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [universityTypeOptions, setUniversityTypeOptions] = useState<OptionType[]>([]);
    const [selectedUniversityType, setSelectedUniversityType] = useState<OptionType | null>(null);
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedCountry, setSelectedCountry] = useState<OptionType | null>(null);
    const [selectedCity, setSelectedCity] = useState<OptionType | null>(null);

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

        const formData = {
            email,
            password,
            name,
            university_type: selectedUniversityType
                ? { id: parseInt(selectedUniversityType.value, 10) }
                : null,
            location: {
                country,
                city
            },
            contact: phone || website ? { phone, website } : null,
        };
        try{
            await handleUniversitySubmit(formData);
            setSuccessMessage(`🎉 Usuario "${name}" registrado con éxito, revisa tu correo para confirmar el tú registro`);

            setName('');
            setEmail('');
            setPassword('');
            setPhone('');
            setWebsite('');
            setCountry('');
            setCity('');
            setUniversityTypeOptions([]);
            setSelectedUniversityType(null);
            setSelectedCountry(null);
            setSelectedCity(null);
        }catch (error) {
            console.error('Error al enviar el formulario:', error);
        }finally {
            setIsSubmitting(true);
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
                    <FaUniversity className="register__icon" />
                    <label>Nombre:</label>
                    <input type="text" placeholder="Nombre de la Universidad*" className="register__input" value={name} onChange={(e) => setName(e.target.value)} required/>
                </div>
                <div className="register__box">
                    <FaEnvelope className="register__icon" />
                    <label>Correo:</label>
                    <input type="email" placeholder="Correo Institucional*" className="register__input" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="register__box">
                    <FaLock className="register__icon" />
                    <label>Contraseña:</label>
                    <input type="password" placeholder="Contraseña*" className="register__input" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <div className="register__box">
                    <FaUser className="register__icon" />
                    <label>Tipo de universidad:</label>
                    <Select placeholder="Tipo de Universidad *" value={selectedUniversityType} onChange={setSelectedUniversityType} options={universityTypeOptions} className="register__select" required/>
                </div>

                <div className="register__box">
                    <FaGlobe className="register__icon" />
                    <label>País:</label>
                    <Select placeholder="Selecciona un país" value={selectedCountry} onChange={handleCountryChange} options={countryOptions} className="register__select" />
                </div>

                <div className="register__box">
                    <FaMapMarkerAlt className="register__icon" />
                    <label>Ciudad:</label>
                    <Select placeholder="Selecciona una ciudad" value={selectedCity} onChange={handleCityChange} options={cityOptions} isDisabled={!selectedCountry} className="register__select" />
                </div>

                <div className="register__box">
                    <FaPhone className="register__icon" />
                    <label>Teléfono:</label>
                    <input type="text" placeholder="Teléfono" className="register__input" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="register__box">
                    <FaLink className="register__icon" />
                    <label>Sitio web:</label>
                    <input type="text" placeholder="Sitio Web" className="register__input" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>

                <button type="submit" className="register__button">
                    {isSubmitting ? "Registrando..." : "Registrarse"}
                </button>
            </form>
        </>
    );
};
