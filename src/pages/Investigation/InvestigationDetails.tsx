import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetInvestigation } from "../../components";
import { getInvestigationById } from "../../api/InvestigationApi";
import { InvestigationGetResponse } from "../../dtos/responses/Investigation";

const InvestigationDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

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

  const handleBack = () => {
    navigate(`/investigations?page=${page}`);
  };

  if (loading) return <p>Cargando investigación...</p>;
  if (error) return <p>{error}</p>;
  if (!investigation) return <p>🔍 Investigación no encontrada...</p>;

  return (
    <div>
      <button onClick={handleBack}>← Volver</button>
      <GetInvestigation investigation={investigation} />
    </div>
  );
};

export default InvestigationDetail;
