import "./DealCard.css";

export default function DealCard({ deal }) {
  return (
    <div role="listitem" className="work_main_collection_item">
      <article className="done-deals_component">
        <div
          className="done-deals_component_inner"
          data-project-tracking-id={deal.id}
          tabIndex={0}
        >
          <div className="done-deals_component_image_wrap">
            <img
              className="done-deals_component_image"
              src={deal.image}
              alt={deal.alt || deal.title}
              loading="lazy"
            />
          </div>

          <div className="done-deals_component_overlay">
            <div className="done-deals_component_overlay_bg" />
            <div className="done-deals_component_overlay_text_wrap">
              <div className="done-deals_component_overlay_text_details_wrap">
                <div className="done-deals_component_overlay_text_detail_wrap">
                  <div className="done-deals_component_overlay_text_detail_text_wrap">
                    <p>{deal.suburb}</p>
                  </div>
                </div>
                {deal.size ? (
                  <div className="done-deals_component_overlay_text_detail_wrap">
                    <div className="done-deals_component_overlay_text_detail_text_wrap">
                      <p>{deal.size}</p>
                    </div>
                    <div className="done-deals_component_overlay_text_detail_text_wrap">
                      <p>{deal.unit}</p>
                    </div>
                  </div>
                ) : null}
              </div>
              <p className="u-text-style-h3">{deal.title}</p>
            </div>
          </div>
        </div>

        <div className="done-deals_component_bottom">
          <div className="done-deals_component_bottom_bg" />
          <p>{deal.category}</p>
          <p>{deal.status}</p>
        </div>
      </article>
    </div>
  );
}
