import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetEvent } from "../../components";
import { getAllEventsNotApproved, getEventById } from "../../api/EventApi";
import { EventGetResponse } from "../../dtos/responses/Event";

const EventNotApprovedDetail: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("eventsPage") || "1");

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
            const currentPageData = await getAllEventsNotApproved(page, 10);

            if (currentPageData.data.length > 0) {
                navigate(`/admin/pending-approvals?eventsPage=${page}`);
            } else if (page > 1) {
                const prevPageData = await getAllEventsNotApproved(page - 1, 10);
                if (prevPageData.data.length > 0) {
                    navigate(`/admin/pending-approvals?eventsPage=${page - 1}`);
                } else {
                    navigate("/admin/pending-approvals");
                }
            } else {
                navigate("/admin/pending-approvals");
            }
        } catch (err) {
            console.error("Error al verificar páginas disponibles", err);
            navigate("/admin/pending-approvals");
        }
    };

    if (loading) return <p>Cargando evento...</p>;
    if (error) return <p>{error}</p>;
    if (!event) return <p>🔍 Evento no encontrado...</p>;

    return (
        <div>
            <button onClick={handleBack}>← Volver</button>
            <GetEvent event={event} />
        </div>
    );
};

export default EventNotApprovedDetail;
