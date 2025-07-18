import React, { useState, useEffect } from "react";
import { EventGetResponse, TopicGetAllResponse } from "../../dtos/responses";
import JoditEditor from "jodit-react";
import { EventUpdateRequest } from "../../dtos/requests";
import { getAllTopics, updateEvent, uploadImageFile } from "../../api";
import { ButtonClose, TopicSelector, SubtopicSelector, SelectedSubtopics, ImageInputSelector, Localitation} from "../../components";
import "./UpdateEvent.css";
import { SubtopicIDsRequest } from "../../dtos/requests/Subtopic";
import { CreateEventSubtopic, DeleteEventSubtopic } from "../../api/EventSubtopicApi";
import { formatDateYYYYMMDD } from "../../utils/Date";

interface UpdateEventProps {
    onClose: () => void;
    eventGetResponse: EventGetResponse; 
}

export const UpdateEvent: React.FC<UpdateEventProps> = ({ onClose, eventGetResponse }) => {
    const [topics, setTopics] = useState<TopicGetAllResponse[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [imageUploaderKey, setImageUploaderKey] = useState<number>(Date.now());
    const [resetKey, setResetKey] = useState<number>(Date.now());

    const [event, setEvent] = useState<EventUpdateRequest>({
        title: eventGetResponse.title,
        image: eventGetResponse.image,
        description: eventGetResponse.description,
        link: eventGetResponse.link,
        date: eventGetResponse.date,
        localitation: eventGetResponse.localitation,
    });

    const [subtopicIds, setSubtopicIds] = useState<SubtopicIDsRequest>({
        subtopic_ids: eventGetResponse.subtopics.map((s) => s.id),
    });

    const [localitation, setLocalitation] = useState<{ 
        address: string; 
        latitude: number; 
        longitude: number 
    } | undefined>(eventGetResponse.localitation ? {
        address: eventGetResponse.localitation.address,
        latitude: eventGetResponse.localitation.latitude,
        longitude: eventGetResponse.localitation.longitude
    } : undefined);

    const originalSubtopicIds = eventGetResponse.subtopics.map((s) => s.id);
    const allSubtopics = topics.flatMap((topic) => topic.subtopics);

    useEffect(() => {
        getAllTopics(setTopics);
    }, []);

    const getTodayDate = (): string => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    const handleReset = () => {
        setEvent({
            title: eventGetResponse.title,
            image: eventGetResponse.image,
            description: eventGetResponse.description,
            link: eventGetResponse.link,
            date: eventGetResponse.date,
            localitation: eventGetResponse.localitation,
        });
        setSubtopicIds({ subtopic_ids: originalSubtopicIds });
        setSelectedImageFile(null);
        setSelectedTopic(null);
        setImageUploaderKey(Date.now());
        setResetKey(Date.now());
        setLocalitation(eventGetResponse.localitation ? {
            address: eventGetResponse.localitation.address,
            latitude: eventGetResponse.localitation.latitude,
            longitude: eventGetResponse.localitation.longitude
        } : undefined);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            const date = new Date(event.date || "");

            let imagePath = event.image;
        
            if (selectedImageFile) {
                imagePath = await uploadImageFile(selectedImageFile, "event");
            }

            const update: EventUpdateRequest = {
                ...event,
                image: imagePath,
                ...(localitation && { localitation }),
                date: date.toISOString(),
            };

            const hasChanged =
                update.title !== eventGetResponse.title ||
                update.image !== eventGetResponse.image ||
                update.description !== eventGetResponse.description ||
                update.link !== eventGetResponse.link ||
                update.date !== eventGetResponse.date ||
                JSON.stringify(update.localitation) !== JSON.stringify(eventGetResponse.localitation);
            
            const currentSet = new Set(subtopicIds.subtopic_ids);
            const originalSet = new Set(originalSubtopicIds);

            const added = subtopicIds.subtopic_ids.filter(id => !originalSet.has(id));
            const removed = originalSubtopicIds.filter(id => !currentSet.has(id));

            if (added.length > 0) {
                await CreateEventSubtopic(eventGetResponse.id, { subtopic_ids: added });
            }

            if (removed.length > 0) {
                await DeleteEventSubtopic(eventGetResponse.id, { subtopic_ids: removed });
            }

            const subtopicsChanged = added.length > 0 || removed.length > 0;

            if (hasChanged ||subtopicsChanged ) {
                await updateEvent(eventGetResponse.id, update);
            }

            onClose();
        } catch (error) {
            console.error("Error al actualizar el evento:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="update-event">
            <ButtonClose onClick={onClose}/>
            <h2 className="update-event__title">Crear Evento</h2>
            <form className="update-event__form" onSubmit={handleUpdate}>
                <input type="text" name="title" placeholder="Título" value={event.title} onChange={(e) => setEvent({ ...event, title: e.target.value })} required/>

                <ImageInputSelector value={event.image || ""} onChange={(img) => setEvent({ ...event, image: img })} onFileSelected={setSelectedImageFile} urlLabel="📎 URL de la imagen" fileLabel="🖼️ Subir la imagen" imageUploaderKey={imageUploaderKey} resetKey={resetKey}/>

                <JoditEditor value={event.description} onChange={(content) => setEvent({ ...event, description: content })} className="jodit-container" />

                <input type="text" name="link" placeholder="Enlace" value={event.link} onChange={(e) => setEvent({ ...event, link: e.target.value })} required />

                <input type="date" name="date" min={getTodayDate()} value={formatDateYYYYMMDD(event.date || "")} onChange={(e) => setEvent({ ...event, date: e.target.value })} required />

                <TopicSelector topics={topics} selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} />
                <SubtopicSelector topics={topics} selectedTopic={selectedTopic} data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids"/>
                <SelectedSubtopics data={subtopicIds} setData={setSubtopicIds} subtopicsKey="subtopic_ids" subtopicsList={allSubtopics}/>

                {!localitation ? (
                    <button type="button" onClick={() => setLocalitation({ address: "", latitude: 4.5709, longitude: -74.2973,})} >
                        Añadir localización
                    </button>
                ) : (
                    <div style={{ marginBottom: "1rem" }}>
                        <Localitation value={localitation} onChange={setLocalitation} />
                        <button type="button" className="remove-localitation-button" onClick={() => setLocalitation(undefined)} style={{ marginTop: "0.5rem", backgroundColor: "#f44336", color: "#fff", border: "none", padding: "0.5rem", borderRadius: "4px", }} >
                            Quitar localización
                        </button>
                    </div>
                )}

                <div className="update-event__buttons">
                    <button type="submit">
                        {uploading ? "Actualizando..." : "Actualizar Evento"}
                    </button>
                    <button type="button" onClick={handleReset} disabled={uploading}>
                        Deshacer cambios
                    </button>
                </div>
            </form>
        </div>
    );
};
