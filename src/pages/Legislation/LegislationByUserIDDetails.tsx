import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetLegislation } from "../../components";
import { getAllLegislationsByUserID, getLegislationById } from "../../api/LegislationApi";
import { LegislationGetResponse } from "../../dtos/responses/Legislation";
import { ButtonReturn } from "../../components/Button/ButtonReturn";

const LegislationByUserIDDetails: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("legislationsPage") || "1");

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

    const handleBack = async () => {
        try {
            const currentPageData = await getAllLegislationsByUserID(page, 10);

            if (currentPageData.data.length > 0) {
                navigate(`/user/publications?legislationsPage=${page}`);
            } else if (page > 1) {
                const prevPageData = await getAllLegislationsByUserID(page - 1, 10);
                if (prevPageData.data.length > 0) {
                    navigate(`/user/publications?legislationsPage=${page - 1}`);
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

export default LegislationByUserIDDetails;
