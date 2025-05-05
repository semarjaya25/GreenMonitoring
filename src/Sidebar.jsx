import { Zap, Cloud, Droplet, Car } from "lucide-react";

export default function Sidebar({ items, activeItem, onItemClick }) {
  const icons = {
    ELECTRICITY: <Zap className="w-4 h-4 mr-2" />,
    CO2: <Cloud className="w-4 h-4 mr-2" />,
    "WATER": <Droplet className="w-4 h-4 mr-2" />,
    "VEHICLE COUNTER": <Car className="w-4 h-4 mr-2" />,
  };

  return (
    <nav className="fixed top-14 left-0 w-56 h-[calc(100vh-3.5rem)] bg-green-dark text-white space-y-2 pt-4 z-10">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onItemClick(item)}
          className={`flex items-center w-full text-left px-4 py-2 font-medium transition-all duration-200
            ${
              activeItem === item
                ? "bg-gray-100 text-green-dark rounded-r-none rounded-l-xl -mr-px"
                : "hover:bg-green-light rounded-l-xl"
            }`}
        >
          {icons[item]}
          <span>{item}</span>
        </button>
      ))}
    </nav>
  );
}
