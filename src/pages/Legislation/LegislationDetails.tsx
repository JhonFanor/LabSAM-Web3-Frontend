import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetLegislation } from "../../components";
import { getLegislationById } from "../../api/LegislationApi";
import { LegislationGetResponse } from "../../dtos/responses/Legislation";
import { ButtonReturn } from "../../components/Button/ButtonReturn";

const LegislationDetail: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const page = (location.state as { page?: number })?.page || 1;

    const [legislation, setLegislation] = useState<LegislationGetResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchLegislation = async () => {
            setLoading(true);
            try {
                const data = await getLegislationById(Number(id));
                setLegislation(data);
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar la legislación");
            } finally {
                setLoading(false);
            }
        };

        fetchLegislation();
    }, [id]);

    const handleBack = () => {
        navigate(`/legislations?page=${page}`);
    };

    if (loading) return <p>Cargando legislación...</p>;
    if (error) return <p>{error}</p>;
    if (!legislation) return <p>🔍 Legislación no encontrada...</p>;

    return (
        <div>
            <ButtonReturn onClick={handleBack}/>
            <GetLegislation legislation={legislation} />
        </div>
    );
};

export default LegislationDetail;
