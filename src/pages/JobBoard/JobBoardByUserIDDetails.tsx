import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetJobBoard } from "../../components";
import { getAllJobsBoardByUserID, getJobBoardById } from "../../api/JobBoardApi";
import { JobBoardGetResponse } from "../../dtos/responses/JobBoard";

const JobBoardByUserIDDetails: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("jobsBoardPage") || "1");

    const [job, setJob] = useState<JobBoardGetResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchJob = async () => {
            setLoading(true);
            try {
                const data = await getJobBoardById(Number(id));
                setJob(data);
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar la oferta");
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const handleBack = async () => {
        try {
            const currentPageData = await getAllJobsBoardByUserID(page, 10);

            if (currentPageData.data.length > 0) {
                navigate(`/user/publications?jobsBoardPage=${page}`);
            } else if (page > 1) {
                const prevPageData = await getAllJobsBoardByUserID(page - 1, 10);
                if (prevPageData.data.length > 0) {
                    navigate(`/user/publications?jobsBoardPage=${page - 1}`);
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

    if (loading) return <p>Cargando oferta...</p>;
    if (error) return <p>{error}</p>;
    if (!job) return <p>🔍 Oferta no encontrada...</p>;

    return (
        <div>
            <button onClick={handleBack}>← Volver</button>
            <GetJobBoard job={job} />
        </div>
    );
};

export default JobBoardByUserIDDetails;
