export default function CardGrid({ data, isVehicle, activeItem }) {
  const isElectricity = activeItem === "ELECTRICITY";
  const isCO2 = activeItem === "CO2";

  // Determine border and text color based on activeItem
  const colorClasses = (() => {
    switch (activeItem) {
      case "ELECTRICITY":
        return { border: "border-orange-500", text: "text-orange-500" };
      case "WATER":
        return { border: "border-blue-600", text: "text-blue-600" };
      case "CO2":
        return { border: "border-violet-700", text: "text-violet-700" };
      case "VEHICLE COUNTER":
        return { border: "border-green-600", text: "text-green-600" };
      default:
        return { border: "border-gray-300", text: "text-gray-300" };
    }
  })();

  return (
    <section
      className={`grid ${
        isVehicle
          ? "grid-cols-1 sm:grid-cols-2"
          : "grid-cols-1 sm:grid-cols-2 md:grid-cols-8"
      } gap-6 mb-12`}
    >
      {data.map((card, index) => (
        <article
          key={index}
          className={`p-4 rounded-xl shadow flex flex-col items-center justify-center min-h-[100px] border-t-4 ${colorClasses.border} ${
            isCO2 && (index === 3 || index === 7 || index === 10 || index === 13) ? "bg-violet-100" : "bg-white"
          }`}
        >
          <h3
            className={`font-semibold mb-2 ${
              isVehicle ? "text-lg mb-1" : "text-xs text-center"
            }`}
          >
            {card.title}
          </h3>
          <p
            className={`font-bold ${
              (isElectricity && index === 0) || (isCO2 && (index === 0 || index === 4))
                ? `text-xs ${colorClasses.text}`
                : isVehicle
                ? `text-xl text-blue-700`
                : `text-xl ${colorClasses.text}`
            }`}
          >
            {card.value}
          </p>
        </article>
      ))}
    </section>
  );
}
