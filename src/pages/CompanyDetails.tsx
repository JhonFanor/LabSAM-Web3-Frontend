import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetCompany } from "../components";
import { getCompanyById } from "../api/CompanyApi";
import { CompanyGetResponse } from "../dtos/responses/Company";

const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  const [company, setCompany] = useState<CompanyGetResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCompany = async () => {
      setLoading(true);
      try {
        const data = await getCompanyById(Number(id));
        setCompany(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la empresa");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [id]);

  const handleBack = () => {
    navigate(`/companies?page=${page}`);
  };

  if (loading) return <p>Cargando empresa...</p>;
  if (error) return <p>{error}</p>;
  if (!company) return <p>🔍 Empresa no encontrada...</p>;

  return (
    <div>
      <button onClick={handleBack}>← Volver</button>
      <GetCompany company={company} />
    </div>
  );
};

export default CompanyDetail;
