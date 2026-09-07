import DealCard from "./DealCard.jsx";

export default function DealGrid({ deals }) {
  return (
    <section className="work_main_section">
      <div className="work_main_container u-container">
        <div
          role="list"
          className="work_main_collection_list u-grid-custom u-gap-4"
        >
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      </div>
    </section>
  );
}
