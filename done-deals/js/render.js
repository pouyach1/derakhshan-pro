function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderDealCard(deal) {
  const sizeBlock = deal.size
    ? `
              <div class="done-deals_component_overlay_text_detail_wrap u-flex-horizontal-wrap u-gap-custom u-align-items-start">
                <div class="done-deals_component_overlay_text_detail_text_wrap">
                  <p class="u-text-transform-uppercase">${escapeHtml(deal.size)}</p>
                </div>
                <div class="done-deals_component_overlay_text_detail_text_wrap">
                  <p class="u-text-transform-uppercase">${escapeHtml(deal.unit)}</p>
                </div>
              </div>`
    : `
              <div class="done-deals_component_overlay_text_detail_wrap u-flex-horizontal-wrap u-gap-custom u-align-items-start"></div>`;

  return `
    <div role="listitem" class="work_main_collection_item">
      <article class="done-deals_component u-flex-vertical-nowrap u-gap-custom is-done-deals u-ratio-1-1">
        <div class="done-deals_component_inner u-flex-grow u-position-relative u-overflow-clip" data-project-tracking-id="${escapeHtml(deal.id)}">
          <div class="done-deals_component_image_wrap">
            <img
              class="done-deals_component_image is-done-deals"
              src="${escapeHtml(deal.image)}"
              alt="${escapeHtml(deal.alt || deal.title)}"
              loading="lazy"
            />
          </div>
          <div class="done-deals_component_overlay u-cover-absolute u-flex-vertical-nowrap u-justify-content-end">
            <div class="done-deals_component_overlay_bg"></div>
            <div class="done-deals_component_overlay_text_wrap u-position-relative u-flex-vertical-nowrap u-gap-1 u-overflow-clip">
              <div class="done-deals_component_overlay_text_details_wrap u-grid-custom u-overflow-clip">
                <div class="done-deals_component_overlay_text_detail_wrap">
                  <div class="done-deals_component_overlay_text_detail_text_wrap">
                    <p class="u-text-transform-uppercase">${escapeHtml(deal.suburb)}</p>
                  </div>
                </div>
                ${sizeBlock}
              </div>
              <p class="u-text-style-h3">${escapeHtml(deal.title)}</p>
            </div>
          </div>
        </div>
        <div class="done-deals_component_bottom u-flex-horizontal-nowrap u-justify-content-between u-position-relative u-overflow-clip">
          <div class="done-deals_component_bottom_bg u-cover-absolute"></div>
          <p class="u-text-transform-uppercase u-position-relative">${escapeHtml(deal.category)}</p>
          <p class="u-text-transform-uppercase u-position-relative">${escapeHtml(deal.status)}</p>
        </div>
      </article>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector(".work_main_collection_list");
  if (!list || !window.DONE_DEALS) return;
  list.innerHTML = window.DONE_DEALS.map(renderDealCard).join("");
});
