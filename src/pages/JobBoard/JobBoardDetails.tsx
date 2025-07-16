import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetJobBoard } from "../../components";
import { getJobBoardById } from "../../api/JobBoardApi";
import { JobBoardGetResponse } from "../../dtos/responses/JobBoard";

const JobBoardDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

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

  const handleBack = () => {
    navigate(`/job-board?page=${page}`);
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

export default JobBoardDetail;
