const addItems = document.querySelector(".add-items");
const removeItems = document.querySelector(".remove-items");
const buttons = document.querySelectorAll(".button");
const itemsList = document.querySelector(".beers");
const removeChecked = document.querySelector(".remove-checked");
// if there is no item string, create an empty array
let items = JSON.parse(localStorage.getItem("items")) || [];

function addItem(e) {
  e.preventDefault();
  const text = this.querySelector("[name=item]").value.toUpperCase();
  const duplicateItem = items.find(item => item.text === text);
  if (!duplicateItem) {
    const item = {
      text,
      done: false,
    };
    items.push(item);
    // rerenders list without having to reload the page
    populateList(items, itemsList);
    localStorage.setItem("items", JSON.stringify(items));
    this.reset();
  } else {
    const warning = document.querySelector("#greeting");
    warning.textContent = "Already added to list.";
    setTimeout(() => {
      warning.textContent = "Add your favorite beer to the list";
    }, 2000);
  }
}

// function removes all items in the array
const removeAllItems = e => {
  e.preventDefault();
  items.splice(0);
  localStorage.setItem("items", JSON.stringify(items));
  populateList([], itemsList);
};

// remove all checked items
const removeCheckedBeer = e => {
  e.preventDefault();
  items = items.filter(item => item.done !== true);
  localStorage.setItem("items", JSON.stringify(items));
  populateList(items, itemsList);
};

// toggle a single item
const toggleDone = e => {
  if (!e.target.matches("input")) return; // skip this unless it's an input
  const el = e.target;
  const index = el.dataset.index;
  // toggle from done to !done
  items[index].done = !items[index].done;
  localStorage.setItem("items", JSON.stringify(items));
};

// toggle inventory of all items to true or false
const toggleAllItems = e => {
  items.forEach((item, index, array) => {
    e.target.name === "checkAll"
      ? (items[index].done = true)
      : (items[index].done = false);
  });
  localStorage.setItem("items", JSON.stringify(items));
  populateList(items, itemsList);
};

const populateList = (beers = [], beerList) => {
  // map through the array, and create a new array to render the beer list
  beerList.innerHTML = beers
    .map((beer, i) => {
      return `
        <li>
          <input type="checkbox" data-index=${i} id="item${i}" ${beer.done
        ? "checked"
        : ""} />
          <label for="item${i}">${beer.text}</label>
        </li>
      `;
    })
    .join("");
};

addItems.addEventListener("submit", addItem);
removeItems.addEventListener("click", removeAllItems);
itemsList.addEventListener("click", toggleDone);
removeChecked.addEventListener("submit", removeCheckedBeer);
buttons.forEach(button => button.addEventListener("click", toggleAllItems));

// call populate to render the list on page load
populateList(items, itemsList);
