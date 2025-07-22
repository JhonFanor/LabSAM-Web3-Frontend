import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetDocumentation } from "../../components";
import { getAllDocumentationsNotApproved, getDocumentationById } from "../../api/DocumentationApi";
import { DocumentationGetResponse } from "../../dtos/responses/Documentation";
import { ButtonReturn } from "../../components/Button/ButtonReturn";

const DocumentationNotApprovedDetail: React.FC = () => {
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
            const currentPageData = await getAllDocumentationsNotApproved(page, 10);

            if (currentPageData.data.length > 0) {
                navigate(`/admin/pending-approvals?documentationsPage=${page}`);
            } else if (page > 1) {
                const prevPageData = await getAllDocumentationsNotApproved(page - 1, 10);
                if (prevPageData.data.length > 0) {
                    navigate(`/admin/pending-approvals?documentatiosPage=${page - 1}`);
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

export default DocumentationNotApprovedDetail;
