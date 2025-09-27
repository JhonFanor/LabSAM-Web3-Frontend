import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { Country, City } from 'country-state-city';
import {
  FaEnvelope,
  FaLock,
  FaBuilding,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaLink
} from 'react-icons/fa';

interface BusinessUserFormData {
  email: string;
  password: string;
  name: string;
  industry?: string;
  location?: {
    country: string;
    city: string;
  };
  contact?: {
    phone: string;
    website: string;
  };
}

interface OptionType {
  value: string;
  label: string;
}

const handleBusinessSubmit = async (data: any) => {
    try {
        const response = await fetch('http://localhost:8080/api/auth/register/business', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        console.log('Business registration successful:', result);
    } catch (error) {
        console.error('Error registering business:', error);
    }
};

const isValidPassword = (password: string) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return regex.test(password);
};

export const BusinessForm: React.FC = () => {
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [industry, setIndustry] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [website, setWebsite] = useState('');

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

        const formData: BusinessUserFormData = {
            name: companyName,
            email,
            password,
            industry,
            location: {
                country,
                city,
            },
            contact: {
                phone,
                website,
            },
        };
        try {
            await handleBusinessSubmit(formData);
            setSuccessMessage(`🎉 Usuario "${name}" registrado con éxito, revisa tu correo para confirmar el tú registro`);

            setCompanyName('');
            setEmail('');
            setPassword('');
            setIndustry('');
            setPhone('');
            setCountry('');
            setSelectedCountry(null);
            setSelectedCity(null);
        } catch (error){
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
                    <FaBuilding className="register__icon" />
                    <input
                    type="text"
                    placeholder="Nombre de la Empresa* "
                    className="register__input"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required />
                </div>
                <div className="register__box">
                    <FaEnvelope className="register__icon" />
                    <input
                    type="email"
                    placeholder="Correo Corporativo *"
                    className="register__input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />
                </div>
                <div className="register__box">
                    <FaLock className="register__icon" />
                    <input
                    type="password"
                    placeholder="Contraseña *"
                    className="register__input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    />
                </div>
                <div className="register__box">
                    <FaGlobe className="register__icon" />
                    <input
                    type="text"
                    placeholder="Industria"
                    className="register__input"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    />
                </div>

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
                    placeholder="Teléfono"
                    className="register__input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="register__box">
                    <FaLink className="register__icon" />
                    <input
                    type="text"
                    placeholder="Sitio Web"
                    className="register__input"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    />
                </div>
                <button type="submit" className="register__button">
                    {isSubmitting ? "Registrando..." : "Registrarse"}
                </button>
            </form>
        </>
    );
};
