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
    return `<a class="listItemLink" href="/item/${values.id}">
  <div class="row listItem">
    <div class="col-2 col-sm-6 col-xl-3 listImage">
      <img src="https://services.runescape.com/m=itemdb_oldschool/obj_sprite.gif?id=${
        values.id
      }" alt="item image">
      <div class="listName">
        <div class="listNameText">
          ${itemObject.name}
        </div>
      </div>
    </div>
    <div class="col listItemContent d-none d-xl-flex">
      <span>
        <div class="d-flex align-items-center listItemContent">${formatShort(
          values.currentPrice
        )}</div>
      </span>
    </div>
    <div class="col listItemContent">
      <span>
        <div class="d-flex pe-4 align-items-center listItemContent">${initialQty}</div>
      </span>
    </div>
    <div class="col col-xl-2 listItemContent amountChanged d-flex justify-content-center">
      <div class="d-none d-xl-flex w-100 justify-content-end" style="height: 24px;">
        <span class="${values.change}">
        ${formatShort(values.priceChange)}
        </span>
      </div>
      <div class="d-flex w-100 justify-content-end pe-1">
        <span class="listPercentChange ${values.change}">
          <div class="listPercentChangeText">
            <span class="material-symbols-rounded d-flex">${values.arrow}</span>
            ${values.percentChange}%
          </div>
        </span>
      </div>
    </div>
    <div class="col listItemContent">
      <span>
        <div class="d-flex align-items-center listItemContent">${formatShort(
          values.totalCurrentValue
        )}</div>
      </span>
    </div>
    <div class="col-3 listItemContent amountChanged justify-content-center d-none d-xl-flex">
      <div class="d-flex w-100 justify-content-end" style="height: 24px;">
        <span class="${values.changeValue}">
          ${formatShort(values.totalValueChange)}
        </span>
      </div>
      <div class="d-flex w-100 justify-content-end pe-5" style="width: 95px;">
        <span class="listPercentChange ${values.changeValue}">
          <div class="listPercentChangeText">
            <span class="material-symbols-rounded d-flex">${values.arrowValue}</span>
            ${values.percentTotalChange}%
          </div>
        </span>
      </div>
    </div>
  </div>
  </a>`;
  }

  return `<a class="listItemLink" href="/item/${values.id}">
  <div class="row listItem">
    <div class="col col-sm-6 listImage">
      <img src="https://services.runescape.com/m=itemdb_oldschool/obj_sprite.gif?id=${
        values.id
      }" alt="item image">
      <div class="listName">
        <div class="listNameText">
          ${itemObject.name}
        </div>
      </div>
    </div>
    <div class="col listItemContent">
      <span>
        <div class="d-flex align-items-center listItemContent">${formatShort(
          values.currentPrice
        )}</div>
      </span>
    </div>
    <div class="col listItemContent amountChanged justify-content-end">
      <div style="height: 24px;">
        <span class="${values.change}">
        ${formatShort(values.priceChange)}
        </span>
      </div>
    </div>
    <div class="col listItemContent justify-content-start">
      <span class="listPercentChange ${values.change}" style="width: 95px;">
        <div class="listPercentChangeText">
          <span class="material-symbols-rounded d-flex">${values.arrow}</span>
          ${values.percentChange}%
        </div>
      </span>
    </div>
    <div class="d-none d-lg-block col-1 col-xxl-2">
    </div>
  </div>
  </a>`;
}
