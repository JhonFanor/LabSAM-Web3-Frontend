import React, { useState } from 'react';
import ButtonCreate from '../components/Button/ButtonCreate';
import { CreateCompany } from '../components/Company/CreateCompany';

const Conpanies: React.FC = () => {
  const [showCreateCompany, setShowCreateCompany] = useState(false);
    
  const closeModals = () => setShowCreateCompany(false);
  const handleCreateClick = () => setShowCreateCompany(true);

  return (
    <>
      <header>
        <h1>Compañias</h1>
        <ButtonCreate onClick={handleCreateClick} label="Crear Compañia" />
      </header>

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
