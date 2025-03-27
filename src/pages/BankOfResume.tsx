import React, { useState } from 'react';
import ButtonCreate from '../components/Button/ButtonCreate';

const BankOfResume: React.FC = () => {

  const [showCreateBankOfResume, setShowCreateBankOfResume] = useState(false);
  
  const closeModals = () => setShowCreateBankOfResume(false);
  const handleCreateClick = () => setShowCreateBankOfResume(true);

  return (
    <>
      <header>
        <h1>Banco de hojas de vida</h1>
        <ButtonCreate onClick={handleCreateClick} label="Crear Hoja de vida" />
      </header>
    </>
  );
};

export default BankOfResume;
