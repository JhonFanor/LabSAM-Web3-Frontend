import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetEducationalOffer } from "../../components";
import { getAllEducationalOffersNotApproved, getEducationalOfferById } from "../../api/EducationalOfferApi";
import { EducationalOfferGetResponse } from "../../dtos/responses/EducationalOffer";
import { ButtonReturn } from "../../components/Button/ButtonReturn";

const EducationalOfferNotApprovedDetail: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("educationalOffersPage") || "1");

    const [offer, setOffer] = useState<EducationalOfferGetResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchOffer = async () => {
        setLoading(true);
        try {
            const data = await getEducationalOfferById(Number(id));
            setOffer(data);
        } catch (err) {
            console.error(err);
            setError("No se pudo cargar la oferta educativa");
        } finally {
            setLoading(false);
        }
        };

        fetchOffer();
    }, [id]);

    const handleBack = async () => {
    try {
        const currentPageData = await getAllEducationalOffersNotApproved(page, 10);

        if (currentPageData.data.length > 0) {
            navigate(`/admin/pending-approvals?educationalOffersPage=${page}`);
        } else if (page > 1) {
            const prevPageData = await getAllEducationalOffersNotApproved(page - 1, 10);
            if (prevPageData.data.length > 0) {
                navigate(`/admin/pending-approvals?educationalOffersPage=${page - 1}`);
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

    if (loading) return <p>Cargando oferta educativa...</p>;
    if (error) return <p>{error}</p>;
    if (!offer) return <p>🔍 Oferta educativa no encontrada...</p>;

    return (
        <div>
            <ButtonReturn onClick={handleBack}/>
            <GetEducationalOffer offer={offer} />
        </div>
    );
};

export default EducationalOfferNotApprovedDetail;
