import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetEvent } from "../../components";
import { getEventById } from "../../api/EventApi";
import { EventGetResponse } from "../../dtos/responses/Event";
import { ButtonReturn } from "../../components/Button/ButtonReturn";

const EventDetail: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || "1";

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

    const handleBack = () => {
        navigate(`/events?page=${page}`);
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

export default EventDetail;
