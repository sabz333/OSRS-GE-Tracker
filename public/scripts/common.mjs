// Initialize variables
const headerItemSelection = document.getElementById(
  "headerItemCategorySelection"
);
const searchBar = document.getElementById("searchBarInput");
const searchBarStyleDiv = searchBar.parentElement.parentElement;
const searchBox = document.getElementById("searchBox");
const searchResults = document.getElementById("searchResults");
var searchTimer;

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
  }
});

// reopen searchbox results if search bar has text
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
});

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
