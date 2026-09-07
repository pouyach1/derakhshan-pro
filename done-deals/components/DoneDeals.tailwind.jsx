const EASE = "cubic-bezier(.625,.05,0,1)";

export const DONE_DEALS = [
  {
    id: "loop-street",
    title: "Loop Street",
    suburb: "CBD",
    size: "900",
    unit: "m²",
    category: "Retail",
    status: "Leased",
    image:
      "https://cdn.prod.website-files.com/69d1317890ba2641cb65abf8/69f8ec33c4e2cf4f996a0771_153%20Loop%20Street.webp",
  },
  {
    id: "kent-street",
    title: "Kent Street",
    suburb: "Woodstock",
    size: "1977",
    unit: "m²",
    category: "Student Housing",
    status: "Sold",
    image:
      "https://cdn.prod.website-files.com/69d1317890ba2641cb65abf8/69f8eb2b8aefcf18345f445e_Kent%20Street.webp",
  },
  {
    id: "the-silo",
    title: "The Silo",
    suburb: "V&A Waterfront",
    size: "1120",
    unit: "m²",
    category: "Office",
    status: "Leased",
    image:
      "https://cdn.prod.website-files.com/69d1317890ba2641cb65abf8/6a28073d25190ab4df8e6b9c_The%20Silo.webp",
  },
];

function DealCard({ deal }) {
  return (
    <div role="listitem" className="work_main_collection_item col-span-4 min-w-0 max-[767px]:col-span-2">
      <article className="done-deals_component group flex h-auto w-full flex-col aspect-square">
        <div
          className="done-deals_component_inner relative min-h-0 flex-grow cursor-pointer overflow-clip rounded-[var(--radius--main,1rem)] bg-[#ccc] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#4725b8]"
          data-project-tracking-id={deal.id}
          tabIndex={0}
        >
          <div className="done-deals_component_image_wrap absolute inset-0 origin-center transition-transform duration-1000 ease-[cubic-bezier(.625,.05,0,1)] group-hover:scale-105 group-focus-within:scale-105">
            <img
              className="done-deals_component_image is-done-deals block h-[105%] w-full object-cover transition-[filter] duration-[750ms] ease-[cubic-bezier(.625,.05,0,1)] group-hover:grayscale group-focus-within:grayscale"
              src={deal.image}
              alt={deal.alt || deal.title}
              loading="lazy"
            />
          </div>

          <div className="done-deals_component_overlay pointer-events-none absolute inset-0 z-[2] flex flex-col justify-end p-6">
            <div
              className="done-deals_component_overlay_bg absolute inset-0 opacity-0 transition-opacity duration-1000 ease-[cubic-bezier(.625,.05,0,1)] group-hover:opacity-100 group-focus-within:opacity-100"
              style={{ backgroundImage: "linear-gradient(#0000 50%, #000000bf)" }}
            />
            <div className="relative z-[1] flex flex-col gap-4 overflow-clip text-[#fffefc]">
              <div className="grid grid-cols-2 gap-4 overflow-clip">
                <p className="overflow-clip uppercase translate-y-full transition-transform duration-[750ms] ease-[cubic-bezier(.625,.05,0,1)] group-hover:translate-y-0 group-focus-within:translate-y-0">
                  {deal.suburb}
                </p>
                {deal.size ? (
                  <p className="overflow-clip uppercase translate-y-full transition-transform duration-[750ms] ease-[cubic-bezier(.625,.05,0,1)] group-hover:translate-y-0 group-focus-within:translate-y-0">
                    {deal.size} {deal.unit}
                  </p>
                ) : null}
              </div>
              <p className="overflow-clip font-semibold uppercase leading-[1.17] text-[clamp(1.5rem,2vw,2.25rem)] translate-y-full transition-transform duration-[750ms] ease-[cubic-bezier(.625,.05,0,1)] group-hover:translate-y-0 group-focus-within:translate-y-0">
                {deal.title}
              </p>
            </div>
          </div>
        </div>

        <div className="done-deals_component_bottom relative flex flex-nowrap items-center justify-between overflow-clip px-2 pb-1 pt-1.5 text-shadow-[0_1.5em_0_#ffea00]">
          <div className="done-deals_component_bottom_bg absolute inset-0 origin-bottom scale-y-0 bg-[#4725b8] transition-transform duration-1000 ease-[cubic-bezier(.625,.05,0,1)] group-hover:scale-y-110" />
          <p className="relative z-[1] uppercase text-[#333] transition-transform duration-1000 ease-[cubic-bezier(.625,.05,0,1)] group-hover:-translate-y-full">
            {deal.category}
          </p>
          <p className="relative z-[1] uppercase text-[#333] transition-transform duration-1000 ease-[cubic-bezier(.625,.05,0,1)] group-hover:-translate-y-full">
            {deal.status}
          </p>
        </div>
      </article>
    </div>
  );
}

export default function DoneDeals({ deals = DONE_DEALS }) {
  return (
    <section className="work_main_section font-['Rubik',sans-serif]">
      <div className="work_main_container u-container relative mx-auto flex w-[calc(100%-clamp(2rem,5vw,7.5rem))] max-w-[120rem] flex-col [@container]">
        <div className="work_main_layout">
          <div className="work_main_collection_list_wrapper">
            <div
              role="list"
              className="work_main_collection_list u-grid-custom u-gap-4 grid grid-cols-12 gap-16 max-[991px]:grid-cols-8 max-[767px]:grid-cols-2"
            >
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { DealCard, EASE };
