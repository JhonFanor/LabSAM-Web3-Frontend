import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetDocumentation } from "../../components";
import { getDocumentationById } from "../../api/DocumentationApi";
import { DocumentationGetResponse } from "../../dtos/responses/Documentation";
import { ButtonReturn } from "../../components/Button/ButtonReturn";

const DocumentationDetail: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const page = searchParams.get("page") || "1";

    const [doc, setDoc] = useState<DocumentationGetResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const fetchDoc = async () => {
            setLoading(true);
            try {
                const data = await getDocumentationById(Number(id));
                setDoc(data);
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar la documentación");
            } finally {
                setLoading(false);
            }
        };

        fetchDoc();
    }, [id]);

    const handleBack = () => {
        navigate(`/documentations?page=${page}`);
    };

    if (loading) return <p>Cargando documentación...</p>;
    if (error) return <p>{error}</p>;
    if (!doc) return <p>🔍 Documentación no encontrada...</p>;

    return (
        <div>
            <ButtonReturn onClick={handleBack}/>
            <GetDocumentation documentation={doc} />
        </div>
    );
};

export default DocumentationDetail;
