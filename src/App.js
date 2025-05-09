import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";
import Sidebar from "./Sidebar";
import CardGrid from "./CardGrid";
import ElectricityCharts from "./ElectricityCharts";
import VehicleChartAndVideo from "./VehicleChartAndVideo";
import StaticMap from "./StaticMap";
import 'leaflet/dist/leaflet.css';

const sidebarItems = ["ELECTRICITY", "CO2", "WATER", "VEHICLE COUNTER"];
const itemLabels = {
  ELECTRICITY: "Realtime Parameters:",
  CO2: "CO₂ Emissions",
  WATER: "Water",
  "VEHICLE COUNTER": "Vehicle Counter",
};

const electricityLocation = [-7.04877900415822, 110.43801488010942];
const vehicleCounterLocation = [-7.055920045981158, 110.43925653986874];

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      }).replace(/\./g, ':');
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

    let unsubscribeDaily = () => {};
    if (activeItem === "ELECTRICITY") {
      const dailyRef = ref(database, "charts/ELECTRICITY_DAILY_POWER");
      unsubscribeDaily = onValue(dailyRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const formatted = data.map((item) => ({
            x: item.x,
            y1: parseFloat(item.y1).toFixed(3),
            y2: item.y2 !== undefined ? parseFloat(item.y2).toFixed(3) : null,
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
    <div className="flex min-h-screen">
      <Sidebar
        items={sidebarItems}
        activeItem={activeItem}
        onItemClick={setActiveItem}
      />
      <div className="relative flex-1 transition-all duration-300 min-h-screen p-6 ml-[50px] md:ml-[200px]">
        <main className="pt-0 bg-gray-100 min-h-screen">
        <header className="fixed top-0 left-0 right-0 bg-green-primary text-white h-14 flex items-center px-4 shadow-lg z-20 justify-between">
          <div className="flex items-center">
            <a href="https://undip.ac.id" target="_blank" rel="noopener noreferrer">
              <img src={`${process.env.PUBLIC_URL}/Logo.png`} alt="Logo" className="h-10 w-auto mr-3" />
            </a>
            <h1 className="text-xs sm:text-md md:text-2xl lg:text-2xl font-semibold">
              UNDIP GREEN MONITORING
            </h1>
          </div>

          <div className="flex items-center space-x-2 text-right text-sm leading-tight whitespace-pre">
            <a href="https://undip.ac.id" target="_blank" rel="noopener noreferrer">
              <img src={`${process.env.PUBLIC_URL}/logo2.png`} alt="Logo2" className="h-10 w-auto mr-0" />
            </a>
            <a href="https://global.undip.ac.id" target="_blank" rel="noopener noreferrer">
              <img src={`${process.env.PUBLIC_URL}/global.png`} alt="globalLogo" className="h-10 w-22" />
            </a>
            <a href="https://sdgs.un.org/goals" target="_blank" rel="noopener noreferrer">
              <img src={`${process.env.PUBLIC_URL}/sdg.png`} alt="sdgLogo" className="h-9 w-19" />
            </a>
            <a href="https://greenmetric.ui.ac.id" target="_blank" rel="noopener noreferrer">
              <img src={`${process.env.PUBLIC_URL}/ui.png`} alt="greenmetricLogo" className="h-9 w-19" />
            </a>
            <div className="font-semibold">{currentDateTime}</div>
          </div>
        </header>


          <h2 className="text-2xl font-semibold mb-4 mt-10">
            {itemLabels[activeItem]}
          </h2>

          <CardGrid data={cardData} isVehicle={activeItem === "VEHICLE COUNTER"} activeItem={activeItem} />

          {activeItem === "ELECTRICITY" && (
            <>
              <ElectricityCharts
                chartData={chartData}
                dailyChartData={dailyChartData}
              />
              <StaticMap position={electricityLocation} label="Sensor Location" />
            </>
          )}

          {activeItem === "VEHICLE COUNTER" && (
            <section className="mt-8">
              <VehicleChartAndVideo chartData={chartData} />
              <StaticMap position={vehicleCounterLocation} label="Sensor Location" />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
