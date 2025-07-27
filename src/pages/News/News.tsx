import React, { useState } from 'react';
import { ButtonCreate, CreateNews, GetAllNews } from '../../components';
import { useAuth } from '../../providers/Auth';

const News: React.FC = () => {
	const { isAuthenticated, isLoading, user } = useAuth(); 
	const [showCreateNews, setShowCreateNews] = useState(false);

	const closeModals = () => setShowCreateNews(false);
	const handleCreateClick = () => setShowCreateNews(true);

	return (
		<>
			<header>
				<h1>Noticias</h1>
				{isAuthenticated && !isLoading && user.permissions?.includes("news:create")&&(
					<ButtonCreate onClick={handleCreateClick} label="Crear Noticia" />
				)}
			</header>

			<GetAllNews />

			{showCreateNews && (
				<div className="modal-overlay" onClick={(e) => {
				if (e.target === e.currentTarget) {
					closeModals();
				}
				}}>
				<CreateNews onClose={closeModals} />
				</div>
			)}

		</>
	);
};

export default News;
