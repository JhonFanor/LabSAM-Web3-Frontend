import React, { useState } from 'react';
import { ButtonCreate, CreateCompany, GetAllCompany } from '../../components';
import { useAuth } from '../../providers/Auth';

const Conpanies: React.FC = () => {
    const { isAuthenticated, isLoading, user } = useAuth(); 
    const [showCreateCompany, setShowCreateCompany] = useState(false);
        
    const closeModals = () => setShowCreateCompany(false);
    const handleCreateClick = () => setShowCreateCompany(true);

    return (
        <>
            <header>
                <h1>Empresas</h1>
                {isAuthenticated && !isLoading && user.permissions?.includes("company:create") &&(
                    <ButtonCreate onClick={handleCreateClick} label="Crear Empresa" />
                )}
            </header>

            <GetAllCompany/>

            {showCreateCompany && (
                <div className="modal-overlay" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    closeModals();
                }
                }}>
                <CreateCompany onClose={closeModals} />
                </div>
            )}
        </>
    );
};

export default Conpanies;
