import React, { useState } from 'react';
import { CreateDocumentation } from '../components/Documentation/CreateDocumentation';
import ButtonCreate from '../components/Button/ButtonCreate';

const Documentation: React.FC = () => {
  const [showCreateDocumentation, setShowCreateDocumentation] = useState(false);
      
  const closeModals = () => setShowCreateDocumentation(false);
  const handleCreateClick = () => setShowCreateDocumentation(true);

  return (
    <>
      <header>
        <h1>Documentación</h1>
        <ButtonCreate onClick={handleCreateClick} label="Crear Documentación" />
      </header>

      {showCreateDocumentation && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeModals();
          }
        }}>
          <CreateDocumentation onClose={closeModals} />
        </div>
      )}
    </>
  );
};

export default Documentation;
