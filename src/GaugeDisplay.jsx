import React, { useEffect, useState } from "react";
import GaugeComponent from "react-gauge-component";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faDroplet, faCloud, faCarSide } from '@fortawesome/free-solid-svg-icons';

const ANALOG_METER_CONFIG = {
  min: 0,
  max: 2000,
  unit: "ppm",
  thresholds: [
    { limit: 500, color: "#5BE12C", label: "Excellent" },
    { limit: 1000, color: "#F5CD19", label: "Fair" },
    { limit: 1500, color: "#F58B19", label: "Mediocre" },
    { limit: 2000, color: "#EA4228", label: "Bad" },
  ],
};

const leftGaugeConfigs = [
  {
    title: "Hourly Average Power (kW)",
    min: 0,
    max: 200,
    subArcs: [
      { limit: 80, color: "#5BE12C", showTick: true },
      { limit: 150, color: "#F5CD19", showTick: true },
      { limit: 180, color: "#F58B19", showTick: true },
      { limit: 200, color: "#EA4228", showTick: true },
    ],
    labelColor: "#333",
    formatValue: (val) => `${val}`,
  },
  {
    title: "Daily Energy Cost (M Rp)",
    min: 0,
    max: 2,
    subArcs: [
      { limit: 0.5, color: "#5BE12C", showTick: true },
      { limit: 1, color: "#F5CD19", showTick: true },
      { limit: 1.5, color: "#F58B19", showTick: true },
      { limit: 2, color: "#EA4228", showTick: true },
    ],
    labelColor: "#333",
    formatValue: (val) => `${val}`,
  },
];

const bottomLeftGaugeConfigs = [
  {
    title: "Bottom Left Gauge 1",
    min: 0,
    max: 150,
    subArcs: [
      { limit: 30, color: "#EA4228", showTick: true },
      { limit: 75, color: "#F58B19", showTick: true },
      { limit: 110, color: "#F5CD19", showTick: true },
      { limit: 150, color: "#5BE12C", showTick: true },
    ],
    labelColor: "#333",
    formatValue: (val) => `${val}`,
  },
  {
    title: "Bottom Left Gauge 2",
    min: 0,
    max: 250,
    subArcs: [
      { limit: 60, color: "#EA4228", showTick: true },
      { limit: 120, color: "#F58B19", showTick: true },
      { limit: 180, color: "#F5CD19", showTick: true },
      { limit: 250, color: "#5BE12C", showTick: true },
    ],
    labelColor: "#333",
    formatValue: (val) => `${val}`,
  },
];

const GaugeDisplay = ({ leftValues, rightValues, bottomLeftValues, secondBarValue, lcdValues }) => {
const [globalCO2, setGlobalCO2] = useState(null);
const [lastUpdateDate, setLastUpdateDate] = useState(null);

useEffect(() => {
  const STORAGE_KEY_VALUE = "noaaDataValue";
  const STORAGE_KEY_DATE = "noaaDataLastFetch";

  const isSameDay = (dateStr) => {
    if (!dateStr) return false;
    const storedDate = new Date(dateStr);
    const now = new Date();
    return (
      storedDate.getFullYear() === now.getFullYear() &&
      storedDate.getMonth() === now.getMonth() &&
      storedDate.getDate() === now.getDate()
    );
  };

  const fetchCO2 = async () => {
    try {
      const response = await fetch(
        "https://gml.noaa.gov/webdata/ccgg/trends/co2/co2_trend_gl.txt"
      );
      const text = await response.text();
      const lines = text.split("\n");

      // Filter lines that start with year and have enough columns
      const dataLines = lines.filter(
        (line) => /^\d{4}/.test(line.trim()) && line.trim().split(/\s+/).length >= 5
      );

      if (dataLines.length === 0) throw new Error("No valid CO₂ data lines found.");

      const latestValidLine = dataLines[dataLines.length - 1];
      const parts = latestValidLine.trim().split(/\s+/);

      const year = parts[0];
      const month = parts[1].padStart(2, "0");
      const day = parts[2].padStart(2, "0");
      const value = parseFloat(parts[4]);

      if (isNaN(value)) throw new Error("CO₂ value could not be parsed.");

      setGlobalCO2(value);
      setLastUpdateDate(`${year}-${month}-${day}`);

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY_VALUE, JSON.stringify(value));
      localStorage.setItem(STORAGE_KEY_DATE, new Date().toISOString());
    } catch (err) {
      console.error("Failed to fetch CO₂ data", err);
    }
  };

  // Check localStorage first
  const cachedValue = localStorage.getItem(STORAGE_KEY_VALUE);
  const cachedDate = localStorage.getItem(STORAGE_KEY_DATE);

  if (cachedValue && cachedDate && isSameDay(cachedDate)) {
    // Use cached data if from today
    setGlobalCO2(JSON.parse(cachedValue));
    setLastUpdateDate(new Date(cachedDate).toISOString().split("T")[0]);
  } else {
    fetchCO2();
  }
}, []);


  const renderAnalogBar = (value, title) => {
  const { thresholds, max, unit } = ANALOG_METER_CONFIG;

  const { color, label } =
    thresholds.find((t, i) => value <= t.limit || i === thresholds.length - 1) ||
    thresholds[thresholds.length - 1];

  return (
    <div key={title} className="mb-6">
      <p className="mb-1 text-sm font-medium text-gray-600">{title}</p>
      <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
        {/* Filled bar */}
        <div
          className="h-full rounded-full flex items-center justify-between px-3"
          style={{
            width: `${(value / max) * 100}%`,
            background: color,
            transition: "width 0.3s ease-in-out",
          }}
        >
          <span className="text-black text-sm font-bold drop-shadow-sm">
            {value} {unit}
          </span>
          <span className="text-black text-xs italic drop-shadow-sm">{label}</span>
        </div>

        {/* Max limit label superimposed on right */}
        <span
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs font-semibold pointer-events-none select-none"
          style={{ textShadow: "0 0 2px white" }}
        >
          {max} {unit}
        </span>
      </div>
    </div>
  );
};


  return (
    <div className="flex flex-col gap-6">
      {/* Top Row */}
      <div className="flex flex-wrap gap-6">
        {/* ELECTRICITY Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-[540px]">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faBolt} className="text-yellow-500" />
            ELECTRICITY
          </h2>
          <div className="flex flex-wrap gap-0 justify-start">
            {leftGaugeConfigs.map((config, idx) => (
              <div
                key={idx}
                className="text-center"
                style={{ width: "240px", height: "220px" }}
              >
                <h3 className="text-md font-semibold mb-2 text-gray-700">
                  {config.title}
                </h3>
                <GaugeComponent
                  value={leftValues[idx] ?? 0}
                  minValue={config.min}
                  maxValue={config.max}
                  arc={{ subArcs: config.subArcs }}
                  labels={{
                    valueLabel: {
                      formatTextValue: config.formatValue,
                      style: {
                        fill: config.labelColor,
                        fontSize: "22px",
                        fontWeight: "bold",
                        textShadow: "none",
                      },
                    },
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Card with Analog Meters */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex-1">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faCloud} className="text-violet-500" />
            OUTDOOR AVERAGE CO2 LEVEL
          </h2>

          <div className="mb-6">
            <p className="mb-1 text-sm font-medium text-gray-600 flex items-center">
              Global Daily Average (NOAA)
              {lastUpdateDate && (
                <span className="text-xs text-gray-400 font-normal ml-2">
                  (Last update: {lastUpdateDate})
                </span>
              )}
            </p>
            {renderAnalogBar(globalCO2 ?? 0, "")}
          </div>

          {renderAnalogBar(secondBarValue ?? 0, "UNDIP Daily Average")}
        </div>

      </div>

      {/* Bottom Row */}
      <div className="flex flex-wrap gap-6">
        {/* WATER Gauges */}
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-[540px]">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faDroplet} className="text-blue-500" />
            WATER
          </h2>
          <div className="flex flex-wrap gap-0 justify-start">
            {bottomLeftGaugeConfigs.map((config, idx) => (
              <div
                key={idx}
                className="text-center"
                style={{ width: "240px", height: "220px" }}
              >
                <h3 className="text-md font-semibold mb-2 text-gray-700">
                  {config.title}
                </h3>
                <GaugeComponent
                  value={bottomLeftValues[idx] ?? 0}
                  minValue={config.min}
                  maxValue={config.max}
                  arc={{ subArcs: config.subArcs }}
                  labels={{
                    valueLabel: {
                      formatTextValue: config.formatValue,
                      style: {
                        fill: config.labelColor,
                        fontSize: "22px",
                        fontWeight: "bold",
                        textShadow: "none",
                      },
                    },
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Right Placeholder */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex-1 min-h-[240px]">
          <h2 className="text-xl font-bold mb-4 text-gray-800 text-center flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faCarSide} className="text-green-500" />
            VEHICLE COUNTER
          </h2>
          <p className="text-lg font-semibold text-gray-700 mb-10 text-left">
            Current Vehicle Count (Daily Reset)
          </p>
          <h2 className="font-lcd lcd-background text-7xl text-green-dark">
            {lcdValues}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default GaugeDisplay;
