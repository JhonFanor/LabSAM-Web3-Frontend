import React, { useState } from 'react';
import { CreateNews } from '../components/News/CreateNews';

const News: React.FC = () => {
  const [ShowCreateNews,setShowCreateNews] = useState(false);

  const closeModals = () => {
    setShowCreateNews(false);
  };

  const handleCreatClick = () => {
    setShowCreateNews(true);
  };
  

  return (
    <div>
      <div>
        <h1>Noticias</h1>
      </div>
      <div>
        <button onClick={handleCreatClick} className="header__login__button">
            Crear Noticia
        </button>
      </div>
      <div>
        <h1>Filtros</h1>
      </div>
      <div>
        <h1>Listar</h1>
      </div>
      {ShowCreateNews && (
        <div className="modal-overlay" onClick={closeModals}>
          <div onClick={(e) => e.stopPropagation()}> 
            <CreateNews
              onClose={closeModals}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
