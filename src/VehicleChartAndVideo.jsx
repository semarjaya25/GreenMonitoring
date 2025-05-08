// VehicleChartAndVideo.jsx
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  
  export default function VehicleChartAndVideo({ chartData }) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="w-full h-[300px] md:h-[400px] lg:h-[480px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="y1" fill="#8884d8" name="Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>
  
        <div className="w-full h-[300px] md:h-[400px] lg:h-[480px] overflow-hidden">
          <iframe
            className="w-full h-full rounded-lg"
            src="http://www.youtube.com/embed/live_stream?channel=UCuF8iQlh1JCDIhqMW3-SBnw&autoplay=1"
            title="Vehicle Detection Stream"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    );
  }
  