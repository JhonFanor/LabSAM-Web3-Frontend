import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieLabelRenderProps,
} from "recharts";
import { SubtopicCountResponse } from "../../dtos/responses/SubtopicCount";
import { useAuth } from "../../providers/Auth"; // Ajusta la ruta según tu estructura
import "./Graphics.css"

type Props = {
  data: SubtopicCountResponse[];
};

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA46BE", "#00B8D9",
  "#FF6F61", "#6B5B95", "#88B04B", "#FFA07A", "#20B2AA", "#FF6347",
  "#FFD700", "#7B68EE", "#FF1493", "#40E0D0", "#8A2BE2", "#FF4500"
];

export const Graphics: React.FC<Props> = ({ data }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  
  const isAdmin = React.useMemo(() => {
    if (!isAuthenticated || !user) return false;
    
    return user.role === "admin";
  }, [isAuthenticated, user]);

  const filteredData = data.filter(item => item.count > 0);

  if (filteredData.length === 0) {
    return (
      <div className="graphics-nodata__container">
        <p className="graphics__nodata">No hay datos para mostrar</p>
      </div>
    );
  }

  const total = filteredData.reduce((sum, item) => sum + item.count, 0);

  // Ordenar datos por cantidad (descendente)
  const sortedData = [...filteredData].sort((a, b) => b.count - a.count);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="graphics-nodata__container">
        <p className="graphics__nodata">Cargando...</p>
      </div>
    );
  }

  // Si es administrador, mostrar tabla
  if (isAdmin) {
    return (
      <div className="graphics__container">
        <div className="graphics__content">
          <div className="graphics__table-wrapper">
            <table className="graphics__table">
              <thead>
                <tr>
                  <th className="graphics__table-header">Subtema</th>
                  <th className="graphics__table-header">Cantidad</th>
                  <th className="graphics__table-header">Porcentaje</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((item, index) => {
                  const percentage = ((item.count / total) * 100).toFixed(1);
                  return (
                    <tr key={item.subtopic_name} className="graphics__table-row">
                      <td className="graphics__table-cell graphics__table-cell--name">
                        <div className="graphics__table-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        {item.subtopic_name}
                      </td>
                      <td className="graphics__table-cell graphics__table-cell--count">
                        {item.count}
                      </td>
                      <td className="graphics__table-cell graphics__table-cell--percentage">
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
                <tr className="graphics__table-total">
                  <td className="graphics__table-cell graphics__table-cell--total">Total</td>
                  <td className="graphics__table-cell graphics__table-cell--total">{total}</td>
                  <td className="graphics__table-cell graphics__table-cell--total">100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="graphics__container">
      <div className="graphics__content">
        <div className="graphics__chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart margin={{ top: 20, right: 0, left: 0, bottom: 20 }}>
              <Pie
                data={filteredData}
                dataKey="count"
                nameKey="subtopic_name"
                cx="50%"
                cy="50%"
                outerRadius="70%"
                label={({ percent, name }: PieLabelRenderProps) =>
                  percent !== undefined ? `${name}: ${(percent * 100).toFixed(1)}%` : ""
                }
                labelLine={false}
              >
                {filteredData.map((item, index) => (
                  <Cell key={`cell-${item.subtopic_name}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                wrapperStyle={{
                  paddingTop: "20px",
                  overflowY: "auto",
                  maxHeight: "150px"
                }}
                formatter={(value: string) => {
                  const current = filteredData.find(item => item.subtopic_name === value);
                  const percentage = current ? ((current.count / total) * 100).toFixed(1) : "0";
                  return `${value} (${percentage}%)`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};