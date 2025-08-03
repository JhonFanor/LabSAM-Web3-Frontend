import React, { useState } from 'react';
import './Register.css';
import registerImage from '../../assets/img/Logo.jpeg';
import { PersonForm } from './Forms/PersonForm';
import { BusinessForm } from './Forms/BusinessForm';
import { UniversityForm } from './Forms/UniversityForm';
import { ButtonClose } from '../Button';

interface RegisterProps {
	onClose: () => void;
	onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onClose, onSwitchToLogin }) => {
	const [userType, setUserType] = useState<'person' | 'university' | 'company'>('person');

	return (
		<div className="register__content">
			<div className="register__img">
				<img src={registerImage} alt="Register" />
			</div>

			<div className="register__forms">
				<div className="register__create block" id="register-up">
					<ButtonClose onClick={onClose}/>
					<h1 className="register__title">Crear cuenta</h1>

					<div className="register__type-selector">
						<button
							className={`register__type-button ${userType === 'person' ? 'active' : ''}`}
							onClick={() => setUserType('person')}
						>
							Persona
						</button>
						<button
							className={`register__type-button ${userType === 'university' ? 'active' : ''}`}
							onClick={() => setUserType('university')}
						>
							Universidad
						</button>
						<button
							className={`register__type-button ${userType === 'company' ? 'active' : ''}`}
							onClick={() => setUserType('company')}
						>
							Empresa
						</button>
					</div>

					{userType === 'person' && <PersonForm />}
					{userType === 'university' && <UniversityForm />}
					{userType === 'company' && <BusinessForm />}

					<div>
						<span className="register__account">¿Ya tienes una cuenta? </span>
						<span className="register__signup" onClick={onSwitchToLogin}>
							Inicio de sesión
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
