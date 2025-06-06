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
    return `<div class="row fullRow d-flex align-items-center">
    <a class="col-12 col-sm-11" href="/item/${values.id}">
    <div class="row tableRow d-flex align-items-center"id="${itemObject.watch_id}">
    <div class="col-6 col-xl-3 d-flex flex-column flex-sm-row align-items-start align-items-sm-center pt-2 pt-sm-0">
      <img src="https://services.runescape.com/m=itemdb_oldschool/obj_sprite.gif?id=${values.id}" alt="item image">
      <div class="m-font fw-medium py-1 py-sm-2 ps-sm-3 itemName">${itemObject.name}</div>
    </div>
    <div class="col d-none d-xl-flex justify-content-start align-items-center">
      <div class="fw-medium">${formatShort(values.currentPrice)}</div>
    </div>
    <div class="col d-none d-xl-flex justify-content-center align-items-center quantity">
        <div class="fw-medium">${initialQty}</div>
        <span class="material-symbols-rounded edit" data-id="${values.id}"
                    data-value="${formatShort(initialPrice)}"
                    data-name="${itemObject.name}" 
                    data-quantity="${initialQty}"> edit </span>
    </div>
    <div class="col-3 col-sm col-xl-2 d-flex justify-content-end align-items-center p-0 ps-2">
      <div class="d-none d-xl-block ${values.change} fw-medium pe-2">${formatShort(values.priceChange)}</div>
      <div class="percentChangePill ${values.change} d-flex justify-content-end align-items-center">
          <span class="material-symbols-rounded percentChangeArrow">${values.arrow}</span>
          <span class="fw-medium">${values.percentChange}%</span>
      </div>
    </div>
    <div class="col-3 col-xl d-flex justify-content-end justify-content-xl-end align-items-center">
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
  <div class="col-sm-1 d-none d-sm-flex align-items-center">
    <span class="material-symbols-rounded delete"> delete </span>
  </div>
  </div>`
  }

  return `<div class="row d-flex align-items-center">
  <a class="container w-100" href="/item/${values.id}">
  <div class="row tableRow d-flex align-items-center">
    <div class="col-6 col-sm-6 d-flex flex-column flex-sm-row align-items-start align-items-sm-center">
      <img src="https://services.runescape.com/m=itemdb_oldschool/obj_sprite.gif?id=${values.id}" alt="item image">
      <div class="m-font fw-medium py-sm-2 ps-sm-3 itemName">${itemObject.name}</div>
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
