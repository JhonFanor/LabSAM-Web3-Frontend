import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetEvent } from "../../components";
import { getAllEventsByUserID, getEventById } from "../../api/EventApi";
import { EventGetResponse } from "../../dtos/responses/Event";
import { ButtonReturn } from "../../components/Button/ButtonReturn";

const EventByUserIDDetails: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const page = (location.state as { page?: number })?.page || 1;

    const [event, setEvent] = useState<EventGetResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchEvent = async () => {
            setLoading(true);
            try {
                const data = await getEventById(Number(id));
                setEvent(data);
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar el evento");
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    const handleBack = async () => {
        try {
            const currentPageData = await getAllEventsByUserID(page, 10);

            if (currentPageData.data.length > 0) {
                navigate(`/user/publications?eventsPage=${page}`);
            } else if (page > 1) {
                const prevPageData = await getAllEventsByUserID(page - 1, 10);
                if (prevPageData.data.length > 0) {
                    navigate(`/user/publications?eventsPage=${page - 1}`);
                } else {
                    navigate("/user/publications");
                }
            } else {
                navigate("/user/publications");
            }
        } catch (err) {
            console.error("Error al verificar páginas disponibles", err);
            navigate("/user/publications");
        }
    };

    if (loading) return <p>Cargando evento...</p>;
    if (error) return <p>{error}</p>;
    if (!event) return <p>🔍 Evento no encontrado...</p>;

    return (
        <div>
            <ButtonReturn onClick={handleBack}/>
            <GetEvent event={event} />
        </div>
    );
};

export default EventByUserIDDetails;
