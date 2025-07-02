import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from "recharts";

interface ChartData {
  name: string;
  value: number;
}

interface TaskStatusOverviewProps {
  chartData: ChartData[];
  chartColors: string[];
  totalTasks: number;
}

const TaskStatusOverview: React.FC<TaskStatusOverviewProps> = ({ chartData, chartColors, totalTasks }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Task Status Overview</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 9 }} />
                <Tooltip contentStyle={{ fontSize: "11px" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Cards */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-4">Status Breakdown</h3>
          <div className="grid grid-cols-2 gap-4">
            {chartData.map((item, idx) => (
              <div
                key={item.name}
                className="bg-gray-50 rounded-lg p-4 border-l-4"
                style={{ borderLeftColor: chartColors[idx] }}
              >
                <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">{item.name}</div>
                <div className="text-2xl font-bold mt-1" style={{ color: chartColors[idx] }}>
                  {item.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {totalTasks > 0 ? ((item.value / totalTasks) * 100).toFixed(1) : 0}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskStatusOverview;
