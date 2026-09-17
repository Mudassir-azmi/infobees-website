import ServiceCard from "./ServiceCard";

function ServiceGrid({ items, columns = 3 }) {
  const colsClass =
    columns === 2
      ? "sm:grid-cols-2"
      : columns === 4
      ? "sm:grid-cols-2 lg:grid-cols-4"
      : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 gap-6 ${colsClass}`}>
      {items.map((item, index) => (
        <div
          key={item.id ?? item.title}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <ServiceCard {...item} />
        </div>
      ))}
    </div>
  );
}

export default ServiceGrid;
