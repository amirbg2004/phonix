let footerURL = "../footer/footer.html";
let headerURL = "../header/header.html";

async function fetchFooter() {
  try {
    const response = await fetch(footerURL);
    if (!response.ok) throw new Error("Error fetching footer.");
    const html = await response.text();
    const footerCSSLink = document.createElement("link");
    footerCSSLink.rel = "stylesheet";
    footerCSSLink.href = "../footer/footer.css";
    document.head.appendChild(footerCSSLink);
    const iconCSSLink = document.createElement("link");
    iconCSSLink.rel = "stylesheet";
    iconCSSLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css";
    iconCSSLink.integrity =
      "sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg==";
    iconCSSLink.crossOrigin = "anonymous";
    iconCSSLink.referrerPolicy = "no-referrer";
    document.head.appendChild(iconCSSLink);

    document.getElementById("footer").innerHTML = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1];
  } catch (error) {
    console.log("Error loading HTML file!" + error);
  }
}

async function fetchHeader() {
  try {
    const response = await fetch(headerURL);
    if (!response.ok) throw new Error("Error fetching header.");
    const html = await response.text();
    const headerCSSLink = document.createElement("link");
    headerCSSLink.rel = "stylesheet";
    headerCSSLink.href = "../header/header.css";
    document.head.appendChild(headerCSSLink);

    document.getElementById("header").innerHTML = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1];

    const headerScript = document.createElement("script");
    headerScript.src = "../header/header.js";
    document.body.appendChild(headerScript);
  } catch (error) {
    console.log("Error loading HTML file!" + error);
  }
}

fetchFooter();
fetchHeader();

let itemContainer = document.querySelector(".item-container");
let cartContainer = document.querySelector(".cart-container");
let totalPrice = document.querySelector("#total-price");
let cartTitle = document.querySelector(".title");

let currentAccount = JSON.parse(localStorage.getItem("account-in-use"));

let cart = currentAccount.cart;

console.log(cart.totalPrice);

let updateAccountInStorage = () => {
  console.log(cart);
  cart.totalPrice = parseFloat(cart.totalPrice.toFixed(2));
  currentAccount.cart = cart;
  localStorage.setItem("account-in-use", JSON.stringify(currentAccount));
  updateShoppingBagCount();
};

let removeItem = (button, row) => {
  removeItemFromCart(button.dataset.filter);
  row.remove();
  initializeTotalPrice();
};

let removeItemFromCart = (itemID) => {
  cart.cartItems.forEach((item) => {
    if (item.product.itemID === itemID) {
      let deletedItemsPrice = parseFloat(item.product.itemPrice);
      let discount = (parseFloat(item.product.itemPrice) * item.product.discount) / 100;
      deletedItemsPrice -= discount;

      deletedItemsPrice *= item.quantity;
      cart.totalPrice -= deletedItemsPrice;

      let index = cart.cartItems.indexOf(item);
      if (index > -1) cart.cartItems.splice(index, 1);
      updateAccountInStorage();
    }
  });
};

let changeQuantity = (button, change) => {
  const quantityDisplay = button.parentElement.querySelector(".quantity-display");
  let currentQuantity = parseInt(quantityDisplay.textContent);
  let newQuantity = currentQuantity + change;
  if (newQuantity <= 0) removeItem(button, button.parentElement.parentElement);
  else if (newQuantity > 10) quantityDisplay.textContent = "10";
  else {
    quantityDisplay.textContent = newQuantity;
    cart.cartItems.forEach((item) => {
      if (item.product.itemID === button.dataset.filter) {
        var itemPrice = parseFloat(item.product.itemPrice);
        var discount = parseFloat(
          (parseFloat(item.product.itemPrice) * item.product.discount) / 100
        );
        if (newQuantity < item.quantity) {
          cart.totalPrice -= itemPrice - discount;
          item.quantity--;
          updatePrice(button, item);
          updateAccountInStorage();
        } else {
          cart.totalPrice += itemPrice - discount;
          item.quantity++;
          updatePrice(button, item);
          updateAccountInStorage();
        }
      }
    });
  }
  updateTotalPrice();
};

let updatePrice = (button, item) => {
  const priceElement = button.parentElement.nextSibling.querySelector("h4");
  priceElement.innerHTML = `$${(
    (parseFloat(item.product.itemPrice) -
      (parseFloat(item.product.itemPrice) * item.product.discount) / 100) *
    item.quantity
  ).toFixed(2)}`;
};

let updateTotalPrice = () => {
  totalPrice.innerHTML = `${parseFloat(cart.totalPrice.toFixed(2))}`;
};

function checkout() {
  window.location.href = "../checkout-page/checkout-page.html";
}

function addCartItemFunctionality() {
  itemContainer.addEventListener("click", (event) => {
    let button = event.target;
    if (button.classList.contains("remove-button")) {
      let buttonRow = button.parentElement.parentElement;
      removeItem(button, buttonRow);
      updateTotalPrice();
    }
    if (button.classList.contains("quantity-btn")) {
      let change = button.textContent === "+" ? +1 : -1;
      changeQuantity(button, change);
    }
  });
}

let initializeTotalPrice = () => {
  if (cart.cartItems.length === 0) {
    cartTitle.innerHTML = "CART IS EMPTY!";
    document.querySelector(".other").style.display = "none";
    cartContainer.style.display = "none";
    document.querySelector(".empty-container").style.display = "block";
  } else {
    totalPrice.innerHTML = `${parseFloat(cart.totalPrice.toFixed(2))}`;
  }
};

function createTableRowItem() {
  let item = document.createElement("tr");
  return item;
}

function appendTableRowChildren(item, image, details, quantity, price) {
  item.appendChild(image);
  item.appendChild(details);
  item.appendChild(quantity);
  item.appendChild(price);
}

function createTableData(className) {
  let tableData = document.createElement("td");
  tableData.classList.add(className);
  return tableData;
}

function createItemImage() {
  let itemImage = document.createElement("img");
  return itemImage;
}

function createButton(className, textContent) {
  let removeButton = document.createElement("button");
  removeButton.classList.add(className);
  removeButton.textContent = textContent;
  return removeButton;
}

function createItemColorDiv(itemColor) {
  let itemColorDiv = document.createElement("div");
  itemColorDiv.classList.add("product-color");
  itemColorDiv.textContent = itemColor;
  return itemColorDiv;
}

let displayCartItems = () => {
  cart.cartItems.forEach((cartItem) => {
    let item = createTableRowItem();
    let itemImage = createTableData("product-image");
    let image = createItemImage();
    image.setAttribute("src", cartItem.product.imageURL[1]);
    image.setAttribute("alt", "product image");
    image.setAttribute("width", "90");
    image.setAttribute("height", "90");
    itemImage.appendChild(image);

    let itemDetails = createTableData("product-details");
    itemDetails.classList.add("product-details");
    let itemTitle = document.createElement("h3");
    itemTitle.textContent = cartItem.product.itemName;
    let itemColorDiv = createItemColorDiv(cartItem.product.color[0]);
    let removeButton = createButton("remove-button", "Remove");
    removeButton.setAttribute("data-filter", `${cartItem.product.itemID}`);

    itemDetails.appendChild(itemTitle);
    itemDetails.appendChild(itemColorDiv);
    itemDetails.appendChild(removeButton);

    let itemQuantity = createTableData("item-quantity");
    let decrementQuantityButton = createButton("quantity-btn", "-");
    decrementQuantityButton.setAttribute("data-filter", `${cartItem.product.itemID}`);

    let quantityDisplayDiv = document.createElement("div");
    quantityDisplayDiv.classList.add("quantity-display");
    quantityDisplayDiv.innerHTML = `${cartItem.quantity}`;
    let incrementQuantityButton = createButton("quantity-btn", "+");
    incrementQuantityButton.setAttribute("data-filter", `${cartItem.product.itemID}`);

    itemQuantity.appendChild(decrementQuantityButton);
    itemQuantity.appendChild(quantityDisplayDiv);
    itemQuantity.appendChild(incrementQuantityButton);

    let itemPrice = createTableData("price");
    let price = document.createElement("h4");
    price.setAttribute("item-price", cartItem.product.itemPrice * cartItem.quantity);
    price.innerHTML = `$${(
      (cartItem.product.itemPrice -
        (cartItem.product.itemPrice * cartItem.product.discount) / 100) *
      cartItem.quantity
    ).toFixed(2)}`;
    itemPrice.appendChild(price);

    appendTableRowChildren(item, itemImage, itemDetails, itemQuantity, itemPrice);
    itemContainer.appendChild(item);
  });
};

displayCartItems();
initializeTotalPrice();
addCartItemFunctionality();
