import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetLegislation } from "../../components";
import { getAllLegislationsNotApproved, getLegislationById } from "../../api/LegislationApi";
import { LegislationGetResponse } from "../../dtos/responses/Legislation";
import { ButtonReturn } from "../../components/Button/ButtonReturn";

const LegislationNotApprovedDetail: React.FC = () => {
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
            const currentPageData = await getAllLegislationsNotApproved(page, 10);

            if (currentPageData.data.length > 0) {
                navigate(`/admin/pending-approvals?legislationsPage=${page}`);
            } else if (page > 1) {
                const prevPageData = await getAllLegislationsNotApproved(page - 1, 10);
                if (prevPageData.data.length > 0) {
                    navigate(`/admin/pending-approvals?legislationsPage=${page - 1}`);
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

export default LegislationNotApprovedDetail;
