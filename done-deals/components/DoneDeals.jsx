const EASE = "cubic-bezier(.625, .05, 0, 1)";

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
  {
    id: "harrington-street",
    title: "Harrington Street",
    suburb: "Zonnebloem",
    size: "124",
    unit: "m²",
    category: "Restaurant & Bar",
    status: "Sold",
    image:
      "https://cdn.prod.website-files.com/69d1317890ba2641cb65abf8/6a2804fa66adc7259a55ec59_104%20Harrington%20Street.webp",
  },
  {
    id: "lower-main-road",
    title: "Lower Main Road",
    suburb: "Observatory",
    size: "573",
    unit: "m²",
    category: "Restaurant & Bar",
    status: "Sold",
    image:
      "https://cdn.prod.website-files.com/69d1317890ba2641cb65abf8/69f8e9e030d18dd81555f5d6_Armchair%20Lower%20Main%20Road.webp",
  },
  {
    id: "burg-street",
    title: "Burg Street",
    suburb: "CBD",
    size: "1078",
    unit: "m²",
    category: "Residential",
    status: "Leased",
    image:
      "https://cdn.prod.website-files.com/69d1317890ba2641cb65abf8/69fb5635518803bad0ed99f4_40%20Burg%20Street.webp",
  },
];

function DealCard({ deal }) {
  return (
    <div role="listitem" className="work_main_collection_item">
      <article className="done-deals_component u-flex-vertical-nowrap u-gap-custom is-done-deals u-ratio-1-1">
        <div
          className="done-deals_component_inner u-flex-grow u-position-relative u-overflow-clip"
          data-project-tracking-id={deal.id}
          tabIndex={0}
        >
          <div className="done-deals_component_image_wrap">
            <img
              className="done-deals_component_image is-done-deals"
              src={deal.image}
              alt={deal.alt || deal.title}
              loading="lazy"
            />
          </div>

          <div className="done-deals_component_overlay u-cover-absolute u-flex-vertical-nowrap u-justify-content-end">
            <div className="done-deals_component_overlay_bg" />
            <div className="done-deals_component_overlay_text_wrap u-position-relative u-flex-vertical-nowrap u-gap-1 u-overflow-clip">
              <div className="done-deals_component_overlay_text_details_wrap u-grid-custom u-overflow-clip">
                <div className="done-deals_component_overlay_text_detail_wrap">
                  <div className="done-deals_component_overlay_text_detail_text_wrap">
                    <p className="u-text-transform-uppercase">{deal.suburb}</p>
                  </div>
                </div>
                {deal.size ? (
                  <div className="done-deals_component_overlay_text_detail_wrap u-flex-horizontal-wrap u-gap-custom u-align-items-start">
                    <div className="done-deals_component_overlay_text_detail_text_wrap">
                      <p className="u-text-transform-uppercase">{deal.size}</p>
                    </div>
                    <div className="done-deals_component_overlay_text_detail_text_wrap">
                      <p className="u-text-transform-uppercase">{deal.unit}</p>
                    </div>
                  </div>
                ) : null}
              </div>
              <p className="u-text-style-h3">{deal.title}</p>
            </div>
          </div>
        </div>

        <div className="done-deals_component_bottom u-flex-horizontal-nowrap u-justify-content-between u-position-relative u-overflow-clip">
          <div className="done-deals_component_bottom_bg u-cover-absolute" />
          <p className="u-text-transform-uppercase u-position-relative">{deal.category}</p>
          <p className="u-text-transform-uppercase u-position-relative">{deal.status}</p>
        </div>
      </article>
    </div>
  );
}

export default function DoneDeals({ deals = DONE_DEALS }) {
  return (
    <section className="work_main_section">
      <div className="work_main_container u-container">
        <div className="work_main_layout">
          <div className="work_main_collection_list_wrapper u-flex-vertical-nowrap u-gap-4">
            <div role="list" className="work_main_collection_list u-grid-custom u-gap-4">
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
