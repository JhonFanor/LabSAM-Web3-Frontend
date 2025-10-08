import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetCompany } from "../../components";
import { getAllCompaniesNotApproved, getCompanyById } from "../../api";
import { CompanyGetResponse } from "../../dtos/responses";
import { ButtonReturn } from "../../components/Button/ButtonReturn";

const CompanyNotApprovedDetail: React.FC = () => {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const page = (location.state as { page?: number })?.page || 1;

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

    const handleBack = async () => {
        try {
            const currentPageData = await getAllCompaniesNotApproved(page, 10);

            if (currentPageData.data.length > 0) {
                navigate(`/admin/pending-approvals?companiesPage=${page}`);
            } else if (page > 1) {
                const prevPageData = await getAllCompaniesNotApproved(page - 1, 10);
                if (prevPageData.data.length > 0) {
                    navigate(`/admin/pending-approvals?companiesPage=${page - 1}`);
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

    if (loading) return <p>Cargando empresa...</p>;
    if (error) return <p>{error}</p>;
    if (!company) return <p>🔍 Empresa no encontrada...</p>;

    return (
        <div>
            <ButtonReturn onClick={handleBack}/>
            <GetCompany company={company} />
        </div>
    );
};

export default CompanyNotApprovedDetail;
