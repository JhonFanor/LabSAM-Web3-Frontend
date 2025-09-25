import React, { useEffect, useState } from "react";
import { Graphics } from "../Graphics/Graphics";
import { reportItems } from "../../constants/ReportItems";
import { SubtopicCountResponse } from "../../dtos/responses/SubtopicCount";
import "./ReportsSection.css"

const ReportsSection: React.FC = () => {
	const [data, setData] = useState<SubtopicCountResponse[] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedItemLabel, setSelectedItemLabel] = useState<string | null>(null);

	useEffect(() => {
		const fetchRandomReport = async () => {
			try {
				const randomIndex = Math.floor(Math.random() * reportItems.length);
				const randomItem = reportItems[randomIndex];
				setSelectedItemLabel(randomItem.label); 

				const response = await randomItem.api();
				setData(response);
			} catch (err) {
				setError("Error al cargar el reporte.");
			} finally {
				setLoading(false);
			}
		};

		fetchRandomReport();
	}, []);

	return (
		<div className="reports-section">
		<h2>
			{selectedItemLabel ? `Reporte: ${selectedItemLabel}` : "Cargando reporte..."}
		</h2>

		{loading && <p className="text-center text-gray-500">Cargando...</p>}
		{error && <p className="text-center text-red-500">{error}</p>}
		{!loading && !error && data && <Graphics data={data} />}
		</div>
	);
};

export default ReportsSection;
