import React, { useState, useEffect } from "react";
import { NewsGetResponse, TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { NewsUpdateRequest } from "../../dtos/requests";
import { getAllTopics, getNewsById, updateNews, uploadImageFile } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, ImageInputSelector} from "../../components";
import "./UpdateNews.css";
import { SubtopicIDsRequest } from "../../dtos/requests/Subtopic";
import { CreateNewsSubtopic, DeleteNewsSubtopic } from "../../api/NewsSubtopicApi";
import { formatDateYYYYMMDD } from "../../utils/Date";

interface UpdateNewsProps {
    onClose: () => void;
    newsGetResponse: NewsGetResponse;
    onUpdated?: (updated: NewsGetResponse) => void;
}

export const UpdateNews: React.FC<UpdateNewsProps> = ({ onClose, newsGetResponse, onUpdated }) => {
    const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [imageUploaderKey, setImageUploaderKey] = useState<number>(Date.now());
    const [resetKey, setResetKey] = useState<number>(Date.now());

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const [news, setNews] = useState<NewsUpdateRequest>({
        title: newsGetResponse.title,
        image: newsGetResponse.image,
        description: newsGetResponse.description,
        link: newsGetResponse.link,
        date: newsGetResponse.date,
    });

    const [subtopicIds, setSubtopicIds] = useState<SubtopicIDsRequest>({
        subtopic_ids: newsGetResponse.subtopics.map((s) => s.id),
    });

    const originalSubtopicIds = newsGetResponse.subtopics.map((s) => s.id);
    const allSubtopics = topics.flatMap((topic) => topic.subtopics);

    useEffect(() => {
        getAllTopics(setTopics);
    }, []);

    const handleReset = () => {
        setNews(newsGetResponse);
        setSubtopicIds({ subtopic_ids: originalSubtopicIds });
        setSelectedImageFile(null);
        setSelectedTopic(null);
        setImageUploaderKey(Date.now());
        setResetKey(Date.now());
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imagePath = news.image;

            if (selectedImageFile) {
                imagePath = await uploadImageFile(selectedImageFile, "news");
            }

            const update: NewsUpdateRequest = {
                ...news,
                image: imagePath,
                date: news.date ? new Date(news.date).toISOString() : "",
            };

            const hasChanged =
                update.title !== newsGetResponse.title ||
                update.image !== newsGetResponse.image ||
                update.description !== newsGetResponse.description ||
                update.link !== newsGetResponse.link ||
                update.date !== newsGetResponse.date;

            const currentSet = new Set(subtopicIds.subtopic_ids);
            const originalSet = new Set(originalSubtopicIds);

            const added = subtopicIds.subtopic_ids.filter(id => !originalSet.has(id));
            const removed = originalSubtopicIds.filter(id => !currentSet.has(id));

            if (added.length > 0) {
                await CreateNewsSubtopic(newsGetResponse.id, { subtopic_ids: added });
            }

            if (removed.length > 0) {
                await DeleteNewsSubtopic(newsGetResponse.id, { subtopic_ids: removed });
            }

            const subtopicsChanged = added.length > 0 || removed.length > 0;

            if (hasChanged || subtopicsChanged) {
                await updateNews(newsGetResponse.id, update);
                const refreshedNews = await getNewsById(newsGetResponse.id);
                if (onUpdated) {
                    onUpdated(refreshedNews);
                    newsGetResponse = refreshedNews;
                }
            }
            setSuccessMessage("Noticia actualizada exitosamente.");
        } catch (error) {
            setSuccessMessage("Error al actualizar noticia:" + error);
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        if (successMessage) {
            const timeout = setTimeout(() => setSuccessMessage(null), 10000); 
            return () => clearTimeout(timeout);
        }
    }, [successMessage]);

    return (
        <div className="update-news">
            <ButtonClose onClick={onClose}/>
            <h2 className="update-news__title">Actualizar Noticia</h2>
			{successMessage && (
                <div className="success-message">
                	{successMessage}
                </div>
            )}
			<form className="update-news__form" onSubmit={handleUpdate}>
                <div className="form-group">
					<label>Título</label>
				    <input type="text" name="title" placeholder="Título" value={news.title} onChange={(e) => setNews({ ...news, title: e.target.value })} required />
                </div>
                <div className="form-group">	
					<label>Imagen</label>	
				    <ImageInputSelector value={news.image || ""} onChange={(img) => setNews({ ...news, image: img })} onFileSelected={setSelectedImageFile} urlLabel="📎 URL de la imagen" fileLabel="🖼️ Subir la imagen" imageUploaderKey={imageUploaderKey} resetKey={resetKey}/>
                </div>
                <div className="form-group">
					<label>Descripción</label>
				    <JoditEditor value={news.description} onChange={(content) => setNews({ ...news, description: content })} className="jodit-container" />
                </div>
                <div className="form-group">
					<label>Fuente</label>
				    <input type="text" name="link" placeholder="Fuente" value={news.link} onChange={(e) => setNews({ ...news, link: e.target.value })} />
                </div>
                <div className="form-group">
					<label>Fecha</label>
				    <input type="date" name="date" value={formatDateYYYYMMDD(news.date || "")} onChange={(e) => setNews({ ...news, date: e.target.value })} />
                </div>
				<TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
				<SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" />
                <SelectedSubtopics data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics} />

                <div className="update-news__buttons">
                    <button type="submit">
                        {uploading ? "Actualizando..." : "Actualizar Noticia"}                     
                    </button>
                    <button type="button" onClick={handleReset} disabled={uploading}>
                        Deshacer cambios
                    </button>
                </div>
            </form>
        </div>
    );
};
