import dataChangeCalculation from "./dataChangeCalculation.js";
import formatShort from "./formatShort.js";

// creates searchBox results
export default function createSearchResult(itemObject) {
  const values = dataChangeCalculation(itemObject);

  return `<div class="searchResult">
  <a class="searchResultLink" href="/item/${values.id}">
  <div class="searchResultInfo">
    <div>
      <div class="foundItem">
        ${itemObject.name}
      </div>
      <img src="https://services.runescape.com/m=itemdb_oldschool/obj_sprite.gif?id=${
        values.id
      }"></img>
    </div>
    <div class="foundItemPricing">
      <div class="foundItemPrice">
          ${formatShort(values.currentPrice)}
      </div>
      <span class="roundedPercentContainer d-flex ${values.change}">
        <div>
          <span class="material-symbols-rounded d-flex arrow">${
            values.arrow
          }</span>
        </div>
        ${values.percentChange}%
      </span>
    </div>
  </div>
  </a>
</div>`;
}