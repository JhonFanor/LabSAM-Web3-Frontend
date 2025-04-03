// src/pages/Events.tsx
import React, { useState } from 'react';
import ButtonCreate from '../components/Button/ButtonCreate';
import { CreateEvent } from '../components/Event/CreateEvent';

const Event: React.FC = () => {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
      
  const closeModals = () => setShowCreateEvent(false);
  const handleCreateClick = () => setShowCreateEvent(true);

  return (
    <>
      <header>
        <h1>Eventos</h1>
        <ButtonCreate onClick={handleCreateClick} label="Crear Compañia" />
      </header>

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
