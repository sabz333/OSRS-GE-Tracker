import dataChangeCalculation from "./dataChangeCalculation.js";
import formatShort from "./formatShort.js";

// create list item for rendering table of prices, if initial price is not passed
// data is calc'd using opening values
export default function createDefaultListItem(itemObject, initialPrice = "") {
  const values = dataChangeCalculation(itemObject, initialPrice);

  return `<li>
  <a class="listItemLink" href="/item/${values.id}">
  <div class="listItem">
    <div class="listImage">
      <img src="https://services.runescape.com/m=itemdb_oldschool/obj_sprite.gif?id=${
        values.id
      }" alt="item image">
      <div class="listName">
        <div class="listNameText">
          ${itemObject.name}
        </div>
      </div>
    </div>
    <div class="listItemContent">
      <span>
        <div class="d-flex align-items-center listItemContent">${formatShort(
          values.currentPrice
        )}</div>
      </span>
    </div>
    <div class="listItemContent amountChanged">
      <div style="height: 24px;">
        <span class="${values.change}">
        ${formatShort(values.priceChange)}
        </span>
      </div>
    </div>
    <div class="listItemContent">
      <span class="listPercentChange ${values.change}">
        <div class="listPercentChangeText">
          <span class="material-symbols-rounded d-flex">${values.arrow}</span>
          ${values.percentChange}%
        </div>
      </span>
    </div>
  </div>
  </a>
</li>`;
}