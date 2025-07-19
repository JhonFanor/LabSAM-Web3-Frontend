import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetBankOfResume } from "../../components";
import { getBankOfResumeById, getAllBankOfResumesNotApproved } from "../../api";
import { BankOfResumeGetResponse } from "../../dtos/responses";

const BankOfResumeNotApprovedDetail: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("bankOfResumesPage") || "1");

    const [resume, setResume] = useState<BankOfResumeGetResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchResume = async () => {
            setLoading(true);
            try {
                const data = await getBankOfResumeById(Number(id));
                setResume(data);
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar la hoja de vida");
            } finally {
                setLoading(false);
            }
        };

        fetchResume();
    }, [id]);

    const handleBack = async () => {
        try {
            const currentPageData = await getAllBankOfResumesNotApproved(page, 10);

            if (currentPageData.data.length > 0) {
                navigate(`/admin/pending-approvals?bankOfResumesPage=${page}`);
            } else if (page > 1) {
                const prevPageData = await getAllBankOfResumesNotApproved(page - 1, 10);
                if (prevPageData.data.length > 0) {
                navigate(`/admin/pending-approvals?bankOfResumesPage=${page - 1}`);
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

    if (loading) return <p>Cargando hoja de vida...</p>;
    if (error) return <p>{error}</p>;
    if (!resume) return <p>🔍 Hoja de vida no encontrada...</p>;

    return (
        <div>
        <button onClick={handleBack}>← Volver</button>
        <GetBankOfResume resume={resume} />
        </div>
    );
};

export default BankOfResumeNotApprovedDetail;
