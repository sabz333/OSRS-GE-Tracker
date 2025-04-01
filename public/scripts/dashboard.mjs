// initialize variables
const watchTable = document.getElementById("watchTable");
const editView = document.getElementById("editView");
const itemEdit_main = document.getElementById("item-edit-main");
const itemEdit_info = document.getElementById("item-edit-info");
const itemEdit_qty = document.getElementById("item-edit-qty");
const itemEdit_price = document.getElementById("item-edit-price");
const itemEdit_unit = document.getElementById("item-edit-dropdown-unit");
const itemEdit_submit = document.getElementById("item-edit-submit");
const userManagement = document.getElementById("user");

let within_itemEdit = true;

//update user icon to logout on dashboard page only
userManagement.setAttribute("href", "/auth/logout");
userManagement.children[0].innerText = "logout";
userManagement.children[1].innerText = "Logout";

// global event listener to autohide when focus out of item add
document.body.addEventListener("click", (event) => {
  if (!within_itemEdit && editView.style.display === "block") {
    editView.style.display = 'none';
    within_itemEdit = true;
  }
})

// event listener to delete and edit items in watch table
watchTable.addEventListener("click", (event) => {
  // delete item from watch table
  if (event.target.classList.contains('delete') && event.target.nodeName === "SPAN") {
    const deleteParent = parent(event.target, 2);
    const deleteTicker = deleteParent.children[0].firstElementChild.id;
    deleteParent.classList.add("deleteTransition");
    removeWatchTableItem(deleteTicker);
  }
  // show edit item quantity and value window when edit is selected in table
  if (event.target.classList.contains('edit') && event.target.nodeName === "SPAN") {
    event.preventDefault();
    const editParent = parent(event.target, 2);
    const editTicker = editParent.id;
    const itemData = event.target.dataset;
    const imgHTML = `<img src="https://services.runescape.com/m=itemdb_oldschool/obj_sprite.gif?id=${itemData.id}"></img>`
    updateItemEdit(itemData.id, imgHTML, itemData.name, itemData.value, itemData.quantity, editTicker);
    editView.style.display = "block";
  } 
});

// update item info button handler
itemEdit_submit.addEventListener("click", (event) => {
  event.preventDefault();
  const ticker = itemEdit_info.getAttribute("data-ticker");
  let newPrice = itemEdit_price.value;

  // convert quantity based on user input value
  switch (itemEdit_unit.innerText) {
    case "gp":
      newPrice *= 1;
      break;
    case "K":
      newPrice *= 1000;
      break;
    case "M":
      newPrice *= 1000000;
      break;
    case "B":
      newPrice *= 1000000000;
      break;
  
    default:
      break;
  }
  updateWatchTableItem(ticker, itemEdit_qty.value, newPrice).then((response) => {
    const updatedItemLine = response.data.renderedLine;
    editView.style.display = "none";
    const currentItemLine = parent(document.getElementById(ticker), 2);
    currentItemLine.outerHTML = updatedItemLine;
  });
})

// track mouse location relative to item edit box
itemEdit_main.addEventListener("pointerleave", (event) => {
  within_itemEdit = false;
})

itemEdit_main.addEventListener("pointerenter", (event) => {
  within_itemEdit = true;
})

async function removeWatchTableItem(itemTickerNumber) {
  try {
    const response = await axios.delete('/watchTable/remove/' + itemTickerNumber);
    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
}

async function updateWatchTableItem(itemTickerNumber, newQuantity, newValue) {
  try {
    const response = await axios.put('/watchTable/edit/' + itemTickerNumber, {data: {quantity: newQuantity, value: newValue}});
    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
}

// function to find parent of input element n levels high
function parent (element, n = 1) {
  let {parentNode} = element;
  for (let i = 1; parentNode && i < n; i++) {
    ({parentNode} = parentNode);
  }
  return parentNode;
}

// function to pass existing item info to item edit window
function updateItemEdit(itemID, imgHTML, itemName, itemPrice, itemQuantity, itemTickerNumber="") {
  const childrenNodes = itemEdit_info.children;

  // update image
  childrenNodes[0].children[0].outerHTML = imgHTML;

  // update name
  childrenNodes[0].children[1].innerText = itemName;
  
  // update quantity
  childrenNodes[1].children[0].innerText = itemQuantity;

  // update price
  childrenNodes[2].children[0].innerText = itemPrice;


  // set default input value to current price & quantity
  itemEdit_price.value = Number.parseFloat(itemPrice.match("[0-9\.]+"));
  itemEdit_unit.innerText = itemPrice.match("[A-Za-z]+");

  itemEdit_qty.value = itemQuantity;

  // pass item ID to item add
  itemEdit_info.setAttribute("data-id", itemID);
  // pass ticker ID to item
  itemEdit_info.setAttribute("data-ticker", itemTickerNumber);
}