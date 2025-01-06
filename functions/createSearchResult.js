import dataChangeCalculation from "./dataChangeCalculation.js";
import formatShort from "./formatShort.js";

// creates searchBox results
export default function createSearchResult(itemObject, authenticated = false) {
  const values = dataChangeCalculation(itemObject);

  if (authenticated) {
    return `<div class="container searchResult d-flex align-items-center">
    <a class="w-100" href="/item/${values.id}">
    <div class="row mainSearchResult d-flex align-items-center pt-2">
      <div class="col-8 col-sm-6 d-flex">
        <img src="https://services.runescape.com/m=itemdb_oldschool/obj_sprite.gif?id=${
          values.id
        }" alt="item image">
        <div class="m-font py-2 ps-2">
          ${itemObject.name}
        </div>
      </div>
      <div class="col d-flex align-items-center justify-content-end p-0">
        <div class="m-font fw-bold">${formatShort(values.currentPrice)}</div>
      </div>
      <div class="col-auto d-flex justify-content-end align-items-center p-0 ps-2">
        <div class="percentChangePill ${values.change} d-flex justify-content-end align-items-center m-font">
          <span class="material-symbols-rounded percentChangeArrow">${values.arrow}</span>
          <span class="fw-bold">${values.percentChange}%</span>
        </div>
      </div>
    </div>
    </a>
        <div class="saveItem">
          <button class="material-symbols-rounded"  data-id="${values.id}"
            data-value="${values.currentPrice}" data-arrow="${values.arrow}"
            data-name="${itemObject.name}" data-class="${values.change}" 
            data-percent="${values.percentChange}%" 
            data-price="${formatShort(values.currentPrice)}" 
            data-priceChange="${formatShort(values.priceChange)}">
            add_circle
          </button>
        </div>
  </div>`;
    
  }

  return `<div class="container searchResult d-flex align-items-center">
    <a class="w-100" href="/item/${values.id}">
    <div class="row mainSearchResult d-flex align-items-center pt-2">
      <div class="col-6 col-sm-6 d-flex">
        <img src="https://services.runescape.com/m=itemdb_oldschool/obj_sprite.gif?id=${
          values.id
        }" alt="item image">
        <div class="m-font py-2 ps-2">
          ${itemObject.name}
        </div>
      </div>
      <div class="col d-flex align-items-center justify-content-end p-0">
        <div class="m-font fw-bold">${formatShort(values.currentPrice)}</div>
      </div>
      <div class="col-auto d-flex justify-content-end align-items-center p-0 ps-2">
        <div class="percentChangePill ${values.change} d-flex justify-content-end align-items-center m-font">
          <span class="material-symbols-rounded percentChangeArrow">${values.arrow}</span>
          <span class="fw-bold">${values.percentChange}%</span>
        </div>
      </div>
    </div>
    </a>
  </div>`;

}