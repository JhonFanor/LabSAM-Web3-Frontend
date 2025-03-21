import React, { useState } from 'react';
import { CreateNews } from '../components/News/CreateNews';
import { GetAllNews } from '../components/News/GetAllNews';

const News: React.FC = () => {
  const [showCreateNews, setShowCreateNews] = useState(false);

  const closeModals = () => setShowCreateNews(false);
  const handleCreateClick = () => setShowCreateNews(true);

  return (
    <div>
      <header>
        <h1>Noticias</h1>
        <button onClick={handleCreateClick} className="header__login__button">
          Crear Noticia
        </button>
      </header>

      <GetAllNews />

      {showCreateNews && (
        <div className="modal-overlay" onClick={closeModals}>
          <div onClick={(e) => e.stopPropagation()}>
            <CreateNews onClose={closeModals} />
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
