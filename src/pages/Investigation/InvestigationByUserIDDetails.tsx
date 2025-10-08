import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetInvestigation } from "../../components";
import { getAllInvestigationsByUserID, getInvestigationById } from "../../api/InvestigationApi";
import { InvestigationGetResponse } from "../../dtos/responses/Investigation";
import { ButtonReturn } from "../../components/Button/ButtonReturn";

const InvestigationByUserIDDetails: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const page = (location.state as { page?: number })?.page || 1;

    const [investigation, setInvestigation] = useState<InvestigationGetResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchInvestigation = async () => {
            setLoading(true);
            try {
                const data = await getInvestigationById(Number(id));
                setInvestigation(data);
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar la investigación");
            } finally {
                setLoading(false);
            }
        };

        fetchInvestigation();
    }, [id]);

    const handleBack = async () => {
        try {
            const currentPageData = await getAllInvestigationsByUserID(page, 10);

            if (currentPageData.data.length > 0) {
                navigate(`/user/publications?investigationsPage=${page}`);
            } else if (page > 1) {
                const prevPageData = await getAllInvestigationsByUserID(page - 1, 10);
                if (prevPageData.data.length > 0) {
                    navigate(`/user/publications?investigationsPage=${page - 1}`);
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

    if (loading) return <p>Cargando investigación...</p>;
    if (error) return <p>{error}</p>;
    if (!investigation) return <p>🔍 Investigación no encontrada...</p>;

    return (
        <div>
            <ButtonReturn onClick={handleBack}/>
            <GetInvestigation investigation={investigation} />
        </div>
    );
};

export default InvestigationByUserIDDetails;
