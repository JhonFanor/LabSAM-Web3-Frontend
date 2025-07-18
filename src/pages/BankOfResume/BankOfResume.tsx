import React, { useState } from 'react';
import { ButtonCreate, CreateBankOfResume, GetAllBankOfResume } from '../../components';

const BankOfResume: React.FC = () => {

	const [showCreateBankOfResume, setShowCreateBankOfResume] = useState(false);
	
	const closeModals = () => setShowCreateBankOfResume(false);
	const handleCreateClick = () => setShowCreateBankOfResume(true);

	return (
		<>
			<header>
				<h1>Banco de hojas de vida</h1>
				<ButtonCreate onClick={handleCreateClick} label="Crear Hoja de vida" />
			</header>

			<GetAllBankOfResume />

			{showCreateBankOfResume && (
				<div className="modal-overlay" onClick={(e) => {
					if (e.target === e.currentTarget) {
						closeModals();
					}
				}}>
					<CreateBankOfResume onClose={closeModals} />
				</div>
			)}
		</>
	);
};

export default BankOfResume;
