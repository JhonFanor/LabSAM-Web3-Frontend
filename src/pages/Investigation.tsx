import React, { useState } from 'react';
import { ButtonCreate, CreateInvestigation, GetAllInvestigation } from '../components';

const Investigation: React.FC = () => {
  const [showCreateInvestigation, setShowCreateInvestigation] = useState(false);
      
  const closeModals = () => setShowCreateInvestigation(false);
  const handleCreateClick = () => setShowCreateInvestigation(true);

  return (
    <>
      <header>
        <h1>Investigaciones</h1>
        <ButtonCreate onClick={handleCreateClick} label="Crear Investigación" />
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
