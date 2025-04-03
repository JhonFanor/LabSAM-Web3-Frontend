import React, { useState } from 'react';
import ButtonCreate from '../components/Button/ButtonCreate';
import { CreateLegislation } from '../components/Legislation/CreateLegislation';

const Legislation: React.FC = () => {
  const [showCreateLegislation, setShowCreateLegislation] = useState(false);
      
  const closeModals = () => setShowCreateLegislation(false);
  const handleCreateClick = () => setShowCreateLegislation(true);

  return (
    <>
      <header>
        <h1>Legislaciones</h1>
        <ButtonCreate onClick={handleCreateClick} label="Crear Compañia" />
      </header>

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
