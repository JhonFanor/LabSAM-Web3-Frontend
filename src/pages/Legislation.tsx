import React, { useState } from 'react';
import { ButtonCreate, CreateLegislation, GetAllLegislation } from '../components';

const Legislation: React.FC = () => {
  const [showCreateLegislation, setShowCreateLegislation] = useState(false);
      
  const closeModals = () => setShowCreateLegislation(false);
  const handleCreateClick = () => setShowCreateLegislation(true);

  return (
    <>
      <header>
        <h1>Legislaciones</h1>
        <ButtonCreate onClick={handleCreateClick} label="Crear Legislación" />
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
