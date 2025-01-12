// Initialize variables
const headerItemSelection = document.getElementById(
  "headerCategorySelection"
);
const searchBar = document.getElementById("searchBarInput");
const searchBarStyleDiv = searchBar.parentElement.parentElement;
const searchBox = document.getElementById("searchBox");
const searchResults = document.getElementById("searchResults");
var searchTimer;
const watchTable = document.getElementById("watchTable");
const itemAdd = document.getElementById("item-add");
const itemAdd_main = document.getElementById("item-add-main");
const itemAdd_qty = document.getElementById("item-add-qty");
const itemAdd_unit = document.getElementById("item-add-dropdown-unit");
const itemAdd_unitOptions = document.getElementById("item-add-dropdown-unit-list");
const itemAdd_info = document.getElementById("item-add-info");
const itemAdd_price = document.getElementById("item-add-price");
const itemAdd_submit = document.getElementById("item-add-submit");

const main = document.querySelector("main");
let within_itemAdd = false;

main.addEventListener("click", (event) => {
  if (!within_itemAdd && itemAdd.style.display === "block") {
    itemAdd.style.display = 'none';
  }
})

// on first load functions
loadHeaderCards(10);

// event listener for header card updating
headerItemSelection.addEventListener("click", (event) => {
  event.preventDefault();
  if (event.target.control) {
    loadHeaderCards(event.target.control.value);
    const previousActive = document.querySelector(".active");
    previousActive.classList.remove("active");
    event.target.classList.add("active");
  }
});

// event listenser for search bar text update
searchBar.addEventListener("keyup", (event) => {
  // set search send delay here
  const searchDelayTime = 700;

  // resets timeout timer everytime a keyup event occurs
  clearTimeout(searchTimer);

  // checks to make sure text in input field else hide search results
  // timeout function to delay sending search request to server until user is done typing
  if (event.target.value !== "") {
    searchTimer = setTimeout(() => {
      searchResults.innerHTML = "";
      searchItem(event.target.value).then((data) =>
        data.forEach((result) => (searchResults.innerHTML += result))
      );
      // styles search bar to show found results
      if (!searchBarStyleDiv.classList.contains("searching")) {
        searchBarStyleDiv.classList.add("searching");
      }
      searchBox.style.display = "block";
    }, searchDelayTime);
  } else {
    if (searchBarStyleDiv.classList.contains("searching")) {
      searchBarStyleDiv.classList.remove("searching");
      searchBox.style.display = "none";
    }
  }
});

// hide searchbox results when clicking out of search bar
searchBar.addEventListener("focusout", (event) => {
  // check if clicking on search result
  if (!event.relatedTarget) {
    if (searchBarStyleDiv.classList.contains("searching")) {
      searchBarStyleDiv.classList.remove("searching");
    }
    searchBox.style.display = "none";
    itemAdd.style.display = 'none';
  }
});

// reopen searchbox results if search bar has text, also closes item add box
searchBar.addEventListener("focusin", (event) => {
  if (searchBar.value !== "") {
    searchBox.style.display = "block";
  }
  if (
    !searchBarStyleDiv.classList.contains("searching") &&
    searchBar.value !== ""
  ) {
    searchBarStyleDiv.classList.add("searching");
  }
  itemAdd.style.display = 'none';
});

// trigger add item block
searchResults.addEventListener("click", (event) => {
  const button = event.target.closest('button');

  if(button.getAttribute("data-id") && button.getAttribute("data-value")) {
    const itemData = button.dataset;
    const imgHTML = `<img src="https://services.runescape.com/m=itemdb_oldschool/obj_sprite.gif?id=${itemData.id}"></img>`;
    updateItemAdd(itemData.id, imgHTML, itemData.name, itemData.price, itemData.pricechange, itemData.percent, itemData.arrow, itemData.class)
    itemAdd.style.display = 'block';
    itemAdd_qty.focus();
    if (!event.relatedTarget) {
      if (searchBarStyleDiv.classList.contains("searching")) {
        searchBarStyleDiv.classList.remove("searching");
      }
      searchBox.style.display = "none";
    }
  }
})

// change price unit on item add box
itemAdd_unitOptions.addEventListener("click", (event) => {
  const unit = event.target.closest('a');
  const currUnit = itemAdd_unit.innerText;
  
  itemAdd_unit.innerText = unit.innerHTML;
})

// hide search results and/or item add box when clicking off
searchResults.addEventListener("focusout", (event) => {
  // check if clicking on search result
  if (!event.relatedTarget) {
    if (searchBarStyleDiv.classList.contains("searching")) {
      searchBarStyleDiv.classList.remove("searching");
    }
    searchBox.style.display = "none";
    itemAdd.style.display="none";
  }
});

// track mouse location relative to item add box
itemAdd_main.addEventListener("pointerleave", (event) => {
  within_itemAdd = false;
})

itemAdd_main.addEventListener("pointerenter", (event) => {
  within_itemAdd = true;
})

// add event listen to submit button on item add form to push user data
itemAdd_submit.addEventListener("click", (event) => {
  event.preventDefault();

  const itemID = itemAdd_info.getAttribute("data-id");
  let itemValue = Number.parseFloat(itemAdd_price.value);
  const itemQty = itemAdd_qty.value;

  // convert quantity based on user input value
  switch (itemAdd_unit.innerText) {
    case "gp":
      itemValue *= 1;
      break;
    case "K":
      itemValue *= 1000;
      break;
    case "M":
      itemValue *= 1000000;
      break;
    case "B":
      itemValue *= 1000000000;
      break;
  
    default:
      break;
  }

  updateWatchTable(itemID, itemValue, itemQty).then((response) => {
    if (response.status === 200 && watchTable) {
      console.log("refreshing watch table");
      refreshWatchTable().then((response) => {
        watchTable.innerHTML = "";
        response.forEach((item) => watchTable.innerHTML += item);
      });
    }
    itemAdd.style.display = "none";
  });
})

// function to load set of header cards when id is selected
async function loadHeaderCards(id) {
  const headerCards = await getHeaderCards(id);
  const headerCardsDOM = document.getElementById("headerCards");

  headerCardsDOM.innerHTML = "";

  headerCards.forEach((card) => {
    headerCardsDOM.innerHTML += card;
  });
}

// function to pull down top mover header card data from server
async function getHeaderCards(value) {
  try {
    const response = await axios.get("/headers", {
      params: {
        id: value,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// function to pull search results for items from server
async function searchItem(string) {
  try {
    const response = await axios.get("/search", {
      params: {
        search: string,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// function to push item data to user watch table
async function updateWatchTable(itemID, itemValue, itemQty) {
  try {
    const response = await axios.post('/watchTable/push', {item: itemID, value: itemValue, quantity: itemQty});
    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// function to pull saved user items and update table from server
async function refreshWatchTable() {
  try {
    const response = await axios.get('/watchTable/pull');
    return response.data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// function to load selected item information to item-add box
function updateItemAdd(itemID, imgHTML, itemName, itemPrice, itemChange, itemPercent, itemArrow, itemClass) {
  const childrenNodes = itemAdd_info.children;

  // update image
  childrenNodes[0].children[0].outerHTML = imgHTML;

  // update name
  childrenNodes[0].children[1].innerText = itemName;

  // update price
  childrenNodes[1].children[0].innerText = itemPrice;

  // update price change
  childrenNodes[2].children[0].innerText = itemChange;

  // update percent change
  childrenNodes[2].children[1].children[1].innerText = itemPercent;
  
  // update arrow
  childrenNodes[2].children[1].children[0].innerText = itemArrow;

  // update class colors
  let percentClass = childrenNodes[2].children[0].className.split(" ");
  percentClass.pop();
  percentClass.push(itemClass);
  childrenNodes[2].children[0].className = percentClass.join(" ");

  percentClass = childrenNodes[2].children[1].className.split(" ");
  percentClass.pop();
  percentClass.push(itemClass);
  childrenNodes[2].children[1].className = percentClass.join(" ");

  // set default input value to current price
  const currUnit = itemAdd_unit.innerText;
  const listOptions = Array.from(itemAdd_unitOptions.children);

  itemAdd_price.value = Number.parseFloat(itemPrice.match("[0-9\.]+"));
  itemAdd_unit.innerText = itemPrice.match("[A-Za-z]+");

  // pass item ID to item add
  itemAdd_info.setAttribute("data-id", itemID);
}