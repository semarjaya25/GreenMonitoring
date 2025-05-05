import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";
import Sidebar from "./Sidebar";
import CardGrid from "./CardGrid";
import ElectricityCharts from "./ElectricityCharts";
import VehicleChartAndVideo from "./VehicleChartAndVideo";
import StaticMap from "./StaticMap";
import 'leaflet/dist/leaflet.css'; // ✅ Ensure this is here if not already


const sidebarItems = ["ELECTRICITY", "CO2", "WATER", "VEHICLE COUNTER"];
const itemLabels = {
  ELECTRICITY: "Realtime Parameters:",
  CO2: "CO₂ Emissions",
  "WATER": "Water",
  "VEHICLE COUNTER": "Vehicle Counter",
};

const electricityLocation = [-7.04877900415822, 110.43801488010942]; // Coordinates for Gedung Widya Puraya
const vehicleCounterLocation = [-7.055920045981158, 110.43925653986874]; // Coordinates for Vehicle Counter (replace with your desired location)

function formatDateToGMT7(isoString) {
  const date = new Date(isoString);
  const gmt7 = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  return gmt7.toISOString().replace("T", " ").substring(0, 19);
}

export default function App() {
  const [activeItem, setActiveItem] = useState("ELECTRICITY");
  const [cardData, setCardData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [dailyChartData, setDailyChartData] = useState([]);
  const [currentDateTime, setCurrentDateTime] = useState("");

  // Live Date & Time
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Jakarta",
    });

    const updateClock = () => {
      const now = new Date();
      const dateStr = formatter.format(now);
      const timeStr = now.toLocaleTimeString("id-ID", {
        hour12: false,
        timeZone: "Asia/Jakarta",
      }).replace(/\./g, ':');  // Replace dots with colons
      setCurrentDateTime(`${dateStr}\n${timeStr}`);
    };

    updateClock();
    const intervalId = setInterval(updateClock, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Fetch card data
  useEffect(() => {
    const path = `cards/${activeItem.replace(" ", "_")}`;
    const dataRef = ref(database, path);

    const unsubscribe = onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setCardData([]);
        return;
      }

      const formatted = Object.entries(data).map(([key, value]) => {
        let displayValue = value.value || 0;
        if (typeof displayValue === "string" && displayValue.includes("T")) {
          try {
            displayValue = formatDateToGMT7(displayValue);
          } catch {}
        }

        return {
          title: value.title || key,
          value: displayValue,
          value2: value.value2 !== undefined ? value.value2 : null,
        };
      });

      setCardData(formatted);
    });

    return () => unsubscribe();
  }, [activeItem]);

  // Fetch chart data
  useEffect(() => {
    const chartPath = `charts/${activeItem.replace(" ", "_")}`;
    const chartRef = ref(database, chartPath);

    const unsubscribeMain = onValue(chartRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const roundedData = data.map((item) => ({
          x: item.x,
          y1: parseFloat(item.y1).toFixed(3),
          y2: parseFloat(item.y2).toFixed(3),
          y3: parseFloat(item.y3).toFixed(3),
        }));
        setChartData(roundedData);
      } else {
        setChartData([]);
      }
    });

    // For ELECTRICITY: also fetch daily power data
    let unsubscribeDaily = () => {};
    if (activeItem === "ELECTRICITY") {
      const dailyRef = ref(database, "charts/ELECTRICITY_DAILY_POWER");
      unsubscribeDaily = onValue(dailyRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formatted = data.map((item) => ({
            x: item.x,
            y1: parseFloat(item.y1).toFixed(3),
          }));
          setDailyChartData(formatted);
        } else {
          setDailyChartData([]);
        }
      });
    } else {
      setDailyChartData([]);
    }

    return () => {
      unsubscribeMain();
      unsubscribeDaily();
    };
  }, [activeItem]);

  return (
    <div className="min-h-screen">
      {/* Top Panel */}
    <header className="fixed top-0 left-0 right-0 bg-green-primary text-white h-14 flex items-center px-4 shadow-lg z-20 justify-between">
      <div className="flex items-center">
        <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" className="h-10 w-auto mr-3" />
        <h1 className="text-2xl font-semibold">UNDIP GREEN MONITORING</h1>
      </div>

      {/* Right side: small logo and time */}
      <div className="flex items-center space-x-2 text-right text-sm leading-tight whitespace-pre">
        <img src={`${process.env.PUBLIC_URL}/logo2.png`} alt="Logo2" className="h-10 w-auto mr-0" />
        <img src={`${process.env.PUBLIC_URL}/global.png`} alt="globalLogo" className="h-10 w-22" />
        <img src={`${process.env.PUBLIC_URL}/sdg.png`} alt="sdgLogo" className="h-9 w-19" />
        <img src={`${process.env.PUBLIC_URL}/ui.png`} alt="greenmetricLogo" className="h-9 w-19" />
        <div className="font-semibold">{currentDateTime}</div>
      </div>
    </header>


      {/* Sidebar */}
      <Sidebar
        items={sidebarItems}
        activeItem={activeItem}
        onItemClick={setActiveItem}
      />

      {/* Main Content */}
      <main className="ml-56 pt-14 bg-gray-100 min-h-screen overflow-y-auto p-6">
        <h2 className="text-2xl font-semibold mb-4 mt-4">
          {itemLabels[activeItem]}
        </h2>

        {/* Card Grid */}
        <CardGrid data={cardData} isVehicle={activeItem === "VEHICLE COUNTER"} activeItem={activeItem} />


        {/* Electricity Charts */}
        {activeItem === "ELECTRICITY" && (
          <>
            <ElectricityCharts
              chartData={chartData}
              dailyChartData={dailyChartData}
            />
           <StaticMap position={electricityLocation} label="Sensor Location" />
          </>
        )}


        {/* Vehicle Counter Chart/Video */}
        {activeItem === "VEHICLE COUNTER" && (
          <section className="mt-8">
            <VehicleChartAndVideo chartData={chartData} />
            <StaticMap position={vehicleCounterLocation} label="Sensor Location" />
          </section>
        )}
      </main>
    </div>
  );
}
