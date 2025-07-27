import React, { useState } from 'react';
import { ButtonCreate, CreateEvent, GetAllEvent } from '../../components';
import { useAuth } from '../../providers/Auth';

const Event: React.FC = () => {
    const { isAuthenticated, isLoading, user } = useAuth(); 
    const [showCreateEvent, setShowCreateEvent] = useState(false);
        
    const closeModals = () => setShowCreateEvent(false);
    const handleCreateClick = () => setShowCreateEvent(true);

    return (
        <>
        <header>
            <h1>Eventos</h1>
            {isAuthenticated && !isLoading && user.permissions?.includes("event:create") &&(
                <ButtonCreate onClick={handleCreateClick} label="Crear Evento" />
            )}
        </header>
        
        <GetAllEvent />

        {showCreateEvent && (
            <div className="modal-overlay" onClick={(e) => {
            if (e.target === e.currentTarget) {
                closeModals();
            }
            }}>
            <CreateEvent onClose={closeModals} />
            </div>
        )}
        </>
    );
};

export default Event;
