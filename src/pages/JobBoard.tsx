import React, { useState } from 'react';
import ButtonCreate from '../components/Button/ButtonCreate';
import { CreateJobBoard } from '../components/JobBoard/CreateJobBoard';

const JobBoard: React.FC = () => {
  const [showCreateJobBoard, setShowCreateJobBoard] = useState(false);
      
  const closeModals = () => setShowCreateJobBoard(false);
  const handleCreateClick = () => setShowCreateJobBoard(true);

  return (
    <>
      <header>
        <h1>Bolsa de empleos</h1>
        <ButtonCreate onClick={handleCreateClick} label="Crear Oferta de empleo" />
      </header>

      {showCreateJobBoard && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeModals();
          }
        }}>
          <CreateJobBoard onClose={closeModals} />
        </div>
      )}
    </>
  );
};

export default JobBoard;
