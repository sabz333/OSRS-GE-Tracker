import dataChangeCalculation from "./dataChangeCalculation.js";
import formatShort from "./formatShort.js";

// create list item for rendering table of prices, if initial price is not passed
// data is calc'd using opening values
export default function createDefaultListItem(
  itemObject,
  initialPrice = "",
  initialQty = ""
) {
  const values = dataChangeCalculation(itemObject, initialPrice, initialQty);

  if (typeof initialPrice === "number" && typeof initialQty === "number") {
    return `<div class="row d-flex align-items-center">
    <div class="col-1 d-flex justify-content-end align-items-center">
      <span class="material-symbols-rounded edit"> drag_indicator </span>
    </div>
    <a class="col-10" href="/item/${values.id}">
    <div class="row tableRow d-flex align-items-center"id="item-${itemObject.watch_id}">
    <div class="col-6 col-xl-3 d-flex flex-column flex-sm-row align-items-start align-items-sm-center">
      <img src="https://services.runescape.com/m=itemdb_oldschool/obj_sprite.gif?id=${values.id}" alt="item image">
      <div class="m-font fw-medium py-sm-2 ps-sm-3">${itemObject.name}</div>
    </div>
    <div class="col d-none d-xl-flex justify-content-end align-items-center">
      <div class="fw-medium">${formatShort(values.currentPrice)}</div>
    </div>
    <div class="col d-none d-xl-flex justify-content-center align-items-center">
        <div class="fw-medium">${initialQty}</div>
    </div>
    <div class="col-3 col-sm col-xl-2 d-flex justify-content-sm-center justify-content-end align-items-center p-0 ps-2">
      <div class="d-none d-xl-block ${values.change} fw-medium pe-2">${formatShort(values.priceChange)}</div>
      <div class="percentChangePill ${values.change} d-flex justify-content-end align-items-center">
          <span class="material-symbols-rounded percentChangeArrow">${values.arrow}</span>
          <span class="fw-medium">${values.percentChange}%</span>
      </div>
    </div>
    <div class="col col-sm-2 col-xl d-flex justify-content-center justify-content-xl-end align-items-center">
      <div class="fw-medium">${formatShort(values.totalCurrentValue)}</div>
    </div>
    <div class="col-3 d-none d-xl-flex justify-content-end align-items-center p-0 pe-5">
      <div class="${values.changeValue} fw-medium pe-2">${formatShort(values.totalValueChange)}</div>
      <div class="percentChangePill ${values.changeValue} d-flex justify-content-end align-items-center">
          <span class="material-symbols-rounded percentChangeArrow">${values.arrowValue}</span>
          <span class="fw-medium">${values.percentTotalChange}%</span>
      </div>
    </div>
  </div>
  </a>
  <div class="col-1 d-flex align-items-center">
    <span class="material-symbols-rounded edit"> edit </span>
  </div>
  </div>`
  }

  return `<div class="row d-flex align-items-center">
  <a class="container w-100" href="/item/${values.id}">
  <div class="row tableRow d-flex align-items-center">
    <div class="col-6 col-sm-6 d-flex flex-column flex-sm-row align-items-start align-items-sm-center">
      <img src="https://services.runescape.com/m=itemdb_oldschool/obj_sprite.gif?id=${values.id}" alt="item image">
      <div class="m-font fw-medium py-sm-2 ps-sm-3">${itemObject.name}</div>
    </div>
    <div class="col d-flex justify-content-end align-items-center">
      <div class="fw-medium">${formatShort(values.currentPrice)}</div>
    </div>
    <div class="col d-none d-md-flex justify-content-end align-items-center">
        <div class="${values.change} fw-medium">${formatShort(values.priceChange)}</div>
    </div>
    <div class="col d-flex justify-content-end align-items-center p-0 ps-2">
      <div class="percentChangePill ${values.change} d-flex justify-content-end align-items-center">
          <span class="material-symbols-rounded percentChangeArrow">${values.arrow}</span>
          <span class="fw-medium">${values.percentChange}%</span>
      </div>
    </div>
    <div class="col-1 col-xxl-2 d-none d-lg-block">
    </div>
  </div>
  </a>
  </div>`;
}
