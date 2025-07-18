import React, { useState } from 'react';
import { ButtonCreate, CreateInvestigation, GetAllInvestigation } from '../../components';
import { useAuth } from '../../providers/Auth';

const Investigation: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth(); 
    const [showCreateInvestigation, setShowCreateInvestigation] = useState(false);
        
    const closeModals = () => setShowCreateInvestigation(false);
    const handleCreateClick = () => setShowCreateInvestigation(true);

    return (
        <>
        <header>
            <h1>Investigaciones</h1>
            {isAuthenticated && !isLoading &&(
                <ButtonCreate onClick={handleCreateClick} label="Crear Investigación" />
            )}
        </header>

        <GetAllInvestigation />

        {showCreateInvestigation && (
            <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) {
                closeModals();
            }
            }}>
            <CreateInvestigation onClose={closeModals} />
            </div>
        )}
        </>
    );
};

export default Investigation;
