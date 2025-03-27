import React, { useState } from 'react';
import { CreateNews } from '../components/News/CreateNews';
import { GetAllNews } from '../components/News/GetAllNews';
import ButtonCreate from '../components/Button/ButtonCreate';

const News: React.FC = () => {
  const [showCreateNews, setShowCreateNews] = useState(false);

  const closeModals = () => setShowCreateNews(false);
  const handleCreateClick = () => setShowCreateNews(true);

  return (
    <>
      <header>
        <h1>Noticias</h1>
        <ButtonCreate onClick={handleCreateClick} label="Crear Noticia" />
      </header>

      <GetAllNews />

      {showCreateNews && (
        <div className="modal-overlay" onClick={closeModals}>
          <div onClick={(e) => e.stopPropagation()}>
            <CreateNews onClose={closeModals} />
          </div>
        </div>
      )}
    </>
  );
};

export default News;
