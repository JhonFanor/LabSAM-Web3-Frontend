import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetDocumentation } from "../../components";
import { getAllDocumentationsByUserID, getDocumentationById } from "../../api/DocumentationApi";
import { DocumentationGetResponse } from "../../dtos/responses/Documentation";

const DocumentationByUserIDDetails: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const page = parseInt(searchParams.get("documentationsPage") || "1");

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

    const handleBack = async () => {
        try {
            const currentPageData = await getAllDocumentationsByUserID(page, 10);

            if (currentPageData.data.length > 0) {
                navigate(`/user/publications?documentationsPage=${page}`);
            } else if (page > 1) {
                const prevPageData = await getAllDocumentationsByUserID(page - 1, 10);
                if (prevPageData.data.length > 0) {
                    navigate(`/user/publications?documentatiosPage=${page - 1}`);
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

    if (loading) return <p>Cargando documentación...</p>;
    if (error) return <p>{error}</p>;
    if (!doc) return <p>🔍 Documentación no encontrada...</p>;

    return (
        <div>
            <button onClick={handleBack}>← Volver</button>
            <GetDocumentation documentation={doc} />
        </div>
    );
};

export default DocumentationByUserIDDetails;
