import dataChangeCalculation from "./dataChangeCalculation.js";
import formatShort from"./formatShort.js"

// function to create top mover item card
export default function createHeaderCard(itemObject) {
  const values = dataChangeCalculation(itemObject);

  return `<div class="topHeaderCardDiv">
  <a class="headerCardLink" href="/item/${values.id}">
  <div class="headerCard container d-flex flex-row align-items-center p-2">
    <div
      class="price-arrow ${
        values.change
      } d-flex justify-content-center align-items-center"
    >
      <span class="material-symbols-rounded">${values.arrow}</span>
    </div>
    <div class="itemPriceInfo d-flex flex-column">
      <div class="itemId">${itemObject.name}</div>
      <div class="itemPrice">${formatShort(values.currentPrice)}</div>
    </div>
    <div class="itemPercentInfo ${values.change} d-flex flex-column flex-fill">
      <div class="itemPercentChange">${values.percentChange}%</div>
      <div class="itemValueChange">${formatShort(values.priceChange)}</div>
    </div>
    </div>
    </a>
  </div>`;
}