import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetEducationalOffer } from "../../components";
import { getEducationalOfferById } from "../../api/EducationalOfferApi";
import { EducationalOfferGetResponse } from "../../dtos/responses/EducationalOffer";

const EducationalOfferDetail: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

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

  const handleBack = () => {
    navigate(`/educational-offers?page=${page}`);
  };

  if (loading) return <p>Cargando oferta educativa...</p>;
  if (error) return <p>{error}</p>;
  if (!offer) return <p>🔍 Oferta educativa no encontrada...</p>;

  return (
    <div>
      <button onClick={handleBack}>← Volver</button>
      <GetEducationalOffer offer={offer} />
    </div>
  );
};

export default EducationalOfferDetail;
