import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetBankOfResume } from "../../components";
import { getBankOfResumeById, getAllBankOfResumesByUserID } from "../../api";
import { BankOfResumeGetResponse } from "../../dtos/responses";
import { ButtonReturn } from "../../components/Button/ButtonReturn";

const BankOfReusmeByUserIDDetails: React.FC = () => {
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
            const currentPageData = await getAllBankOfResumesByUserID(page, 10);

            if (currentPageData.data.length > 0) {
                navigate(`/user/publications?bankOfResumesPage=${page}`);
            } else if (page > 1) {
                const prevPageData = await getAllBankOfResumesByUserID(page - 1, 10);
                if (prevPageData.data.length > 0) {
                navigate(`/user/publications?bankOfResumesPage=${page - 1}`);
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

    if (loading) return <p>Cargando hoja de vida...</p>;
    if (error) return <p>{error}</p>;
    if (!resume) return <p>🔍 Hoja de vida no encontrada...</p>;

    return (
        <div>
            <ButtonReturn onClick={handleBack}/>
            <GetBankOfResume resume={resume} />
        </div>
    );
};

export default BankOfReusmeByUserIDDetails;
