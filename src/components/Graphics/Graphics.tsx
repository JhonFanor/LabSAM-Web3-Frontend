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
  const filteredData = data.filter(item => item.count > 0);

  if (filteredData.length === 0) {
    return (
      <div className="graphics-nodata__container">
        <p className="graphics__nodata">No hay datos para mostrar</p>
      </div>
    );
  }

  const total = filteredData.reduce((sum, item) => sum + item.count, 0);

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
