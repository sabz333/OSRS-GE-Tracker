import dataChangeCalculation from "./dataChangeCalculation.js";
import formatShort from"./formatShort.js"

// function to create top mover item card
export default function createHeaderCard(itemObject) {
  const values = dataChangeCalculation(itemObject);

  return `<a class="me-2" href="/item/${values.id}">
  <div class="headerCard d-flex align-items-center p-2 me-2">
    <div class="headerCardArrow ${values.change} d-flex justify-content-center align-items-center">
      <span class="material-symbols-rounded">${values.arrow}</span>
    </div>
    <div class="headerCardInfo s-font d-flex flex-column me-2">
      <div class="headerCardName">${itemObject.name}</div>
      <div class="headerCardPrice">${formatShort(values.currentPrice)}</div>
    </div>
    <div class="headerCardChange s-font ${values.change} d-flex flex-column">
      <div class="headerCardPercent">${values.percentChange}%</div>
      <div class="headerCardValueChange">${formatShort(values.priceChange)}</div>
    </div>
    </div>
    </a>`;
}