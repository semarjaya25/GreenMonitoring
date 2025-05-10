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
        <h3 className="text-xl font-semibold mb-4">2025 Daily Energy Cost</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              label={{
                value: "Time (Day)",
                position: "insideTop",
                offset: 22,
              }}
            />
            <YAxis
              label={{
                value: "Million Rp",
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
            />
            <Tooltip />
            <Legend 
              verticalAlign="top" 
              align="center" 
              layout="horizontal" 
            />
            <Bar dataKey="y1" fill="#00d5be" name="Maret" />
            <Bar dataKey="y2" fill="#51a2ff" name="April" />
            <Bar dataKey="y3" fill="#fb64b6" name="Mei" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Second Chart: Combined AreaChart for y1 and y2 */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Hourly Active Power Usage</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={dailyChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="x"
              label={{
                value: "Time (Hour)",
                position: "insideTop",
                offset: 22,
              }}
            />
            <YAxis
              domain={[0, 150]}
              label={{
                value: "kiloWatt",
                angle: -90,
                position: "insideLeft",
                offset: 10,
              }}
            />
            <Tooltip />
            <Legend 
              verticalAlign="top" 
              align="center" 
              layout="horizontal" 
            />
            <Area
              type="basis"
              dataKey="y1"
              stroke="#4F46E5"
              fill="#4F46E520"
              strokeWidth={2}
              name="Today"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Area
              type="basis"
              dataKey="y2"
              stroke="#EF4444"
              fill="#EF444420"
              strokeWidth={2}
              name="Yesterday"
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
