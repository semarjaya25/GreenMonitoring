// CardGrid.jsx
export default function CardGrid({ data, isVehicle, activeItem }) {
    return (
      <section
        className={`grid ${
          isVehicle ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-8"
        } gap-6 mb-12`}
      >
        {data.map((card, index) => (
          <article
            key={index}
            className="bg-white p-4 rounded-xl shadow flex flex-col items-center justify-center"
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
                activeItem === "ELECTRICITY" && index === 0
                  ? "text-xs text-green-700"  // Apply smaller text size to first card in ELECTRICITY tab
                  : isVehicle
                  ? "text-xl text-blue-700"
                  : "text-xl text-green-700"
              }`}
            >
              {card.value}
            </p>
          </article>
        ))}
      </section>
    );
  }
  