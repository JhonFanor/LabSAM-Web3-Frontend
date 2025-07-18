import React, { useState } from 'react';
import { ButtonCreate, CreateLegislation, GetAllLegislation } from '../../components';
import { useAuth } from '../../providers/Auth';

const Legislation: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth(); 
    const [showCreateLegislation, setShowCreateLegislation] = useState(false);
        
    const closeModals = () => setShowCreateLegislation(false);
    const handleCreateClick = () => setShowCreateLegislation(true);

    return (
        <>
            <header>
                <h1>Legislaciones</h1>
                {isAuthenticated && !isLoading &&(
                    <ButtonCreate onClick={handleCreateClick} label="Crear Legislación" />
                )}
            </header>

            <GetAllLegislation />

            {showCreateLegislation && (
                <div className="modal-overlay" onClick={(e) => {
                if (e.target === e.currentTarget) {
                    closeModals();
                }
                }}>
                <CreateLegislation onClose={closeModals} />
                </div>
            )}
        </>
    );
};

export default Legislation;
