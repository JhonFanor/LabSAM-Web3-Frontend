import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetBankOfResume } from "../../components";
import { getBankOfResumeById } from "../../api/BankOfResumeApi";
import { BankOfResumeGetResponse } from "../../dtos/responses/BankOfResume";
import { ButtonReturn } from "../../components/Button/ButtonReturn";

const BankOfResumeDetail: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const page = (location.state as { page?: number })?.page || 1;

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

    const handleBack = () => {
        navigate(`/bank-of-resumes?page=${page}`);
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

export default BankOfResumeDetail;
