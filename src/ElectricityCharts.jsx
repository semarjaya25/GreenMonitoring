import {
  BarChart,
  Bar,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
} from "recharts";

export default function ElectricityCharts({ chartData, dailyChartData }) {
  return (
    <section className="flex flex-col gap-6">
      {/* First Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">2025 Monthly Energy Cost (M Rp)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="y1" fill="oklch(59.6% 0.145 163.225)" name="Maret" />
            <Bar dataKey="y2" fill="oklch(54.6% 0.245 262.881)" name="April" />
            <Bar dataKey="y3" fill="#ff7300" name="Mei" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Second Chart: LineChart with Area and Smoothing */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Hourly Power Usage (kW)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailyChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="x" />
            <YAxis domain={[0, 150]} /> {/* Auto adjust Y-axis domain */}
            <Tooltip />
            <Legend />
            <Area
              type="basis"
              dataKey="y1"
              stroke="#4F46E5"
              fill="#4F46E520"
              strokeWidth={2}
              name="Active Power"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </section>
  );
}
