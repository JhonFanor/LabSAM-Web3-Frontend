import React, { useState } from 'react';
import { ButtonCreate, CreateEducationalOffer, GetAllEducationalOffer } from '../../components';

const EducationalOffer: React.FC = () => {
  const [showCreateEducationalOffer, setShowCreateEducationalOffer] = useState(false);
      
  const closeModals = () => setShowCreateEducationalOffer(false);
  const handleCreateClick = () => setShowCreateEducationalOffer(true);

  return (
    <>
      <header>
        <h1>Ofertas educativas</h1>
        <ButtonCreate onClick={handleCreateClick} label="Crear oferta educativa" />
      </header>

      <GetAllEducationalOffer/>

      {showCreateEducationalOffer && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeModals();
          }
        }}>
          <CreateEducationalOffer onClose={closeModals} />
        </div>
      )}
    </>
  );
};

export default EducationalOffer;
