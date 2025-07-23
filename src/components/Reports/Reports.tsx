import { useEffect, useState } from "react";
import { reportItems } from "../../constants/ReportItems";
import { SubtopicCountResponse } from "../../dtos/responses/SubtopicCount";
import "./Reports.css";
import { Graphics } from "../Graphics/Graphics";

export const Reports: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [data, setData] = useState<SubtopicCountResponse[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const selectedItem = reportItems.find((item) => item.name === activeSection);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedItem) return;

            setLoading(true);
            setError(null);
            try {
                const response = await selectedItem.api();
                setData(response);
            } catch (err) {
                setError("Error al cargar los datos.");
                setData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [selectedItem]);

    const handleClick = (itemName: string) => {
        setActiveSection(itemName);
    };

    return (
        <div className="reports">
            <div className="reports__container">
                {reportItems.map((item) => (
                    <div
                        key={item.name}
                        className={`reports-tab ${activeSection === item.name ? "active" : ""}`}
                        onClick={() => handleClick(item.name)}
                    >
                        <div className="reports-tab__title">{item.label}</div>
                    </div>
                ))}
            </div>

            {activeSection && selectedItem && (
                <div className="reports__content">
                    {loading && <p className="text-center text-gray-500">Cargando...</p>}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {!loading && !error && data && <Graphics data={data} />}
                </div>
            )}
        </div>
    );
};
