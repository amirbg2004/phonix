const emailInput = document.querySelector(".form-group input");
const fullNameInput = document.querySelectorAll(".form-group.half-width input");
const orderDetails = document.querySelector(".order-details");
const subtotal = document.getElementById("subtotal-price");
const total = document.querySelector(".total-amount");
const shipping = document.querySelector(".info");
const discountForm = document.getElementById("discount-form");
const discountCodeInput = document.querySelector(".discount-form input");

const accToFill = JSON.parse(localStorage.getItem("account-in-use"));
const cartCheckoutItems = accToFill.cart;

let subtotalValue = 0;

function autoFill() {
  if (accToFill) {
    emailInput.value = accToFill.email;
    fullNameInput[0].value = accToFill.firstName;
    fullNameInput[1].value = accToFill.lastName;
  }
}

function toggleOrderDetails() {
  const details = document.querySelector(".order-details");
  const showHideLink = document.querySelector(".show-hide");
  if (details.style.display === "none") {
    details.style.display = "block";
    showHideLink.textContent = "Hide";
  } else {
    details.style.display = "none";
    showHideLink.textContent = "Show";
  }
}

function createProductItem() {
  let productItem = document.createElement("div");
  productItem.classList.add("product-item");
  return productItem;
}

function createProductImage(imageURL, productQuantity) {
  let productImageDiv = document.createElement("div");
  productImageDiv.classList.add("product-image");

  let productImage = document.createElement("img");
  productImage.setAttribute("src", imageURL);

  let quantityCircle = document.createElement("span");
  quantityCircle.classList.add("quantity-circle");
  quantityCircle.innerHTML = `${productQuantity}`;

  productImageDiv.appendChild(productImage);
  productImageDiv.appendChild(quantityCircle);

  return productImageDiv;
}

function createProductInfo(productName, productID) {
  let productInfoDiv = document.createElement("div");

  let productInfoParagraph1 = document.createElement("p");
  productInfoParagraph1.textContent = productName;

  let productInfoParagraph2 = document.createElement("p");
  productInfoParagraph2.classList.add("product-id");
  productInfoParagraph2.textContent = productID;

  productInfoDiv.appendChild(productInfoParagraph1);
  productInfoDiv.appendChild(productInfoParagraph2);

  return productInfoDiv;
}

function createProductPrice(productPrice) {
  let productPriceDiv = document.createElement("div");
  productPriceDiv.classList.add("product-price");

  let priceParagraph = document.createElement("p");
  priceParagraph.innerHTML = `$ <span>${productPrice.toFixed(2)}</span>`;

  productPriceDiv.appendChild(priceParagraph);

  return productPriceDiv;
}

function displayOrderDetails() {
  cartCheckoutItems.cartItems.forEach((item) => {
    let productItem = createProductItem();
    let productImage = createProductImage(
      item.product.imageURL[1],
      item.quantity
    );
    let productInfo = createProductInfo(
      item.product.itemName,
      item.product.color[0]
    );
    var price =
      (item.product.itemPrice -
        (item.product.itemPrice * item.product.discount) / 100) *
      item.quantity;
    let productPrice = createProductPrice(price);

    productItem.appendChild(productImage);
    productItem.appendChild(productInfo);
    productItem.appendChild(productPrice);

    orderDetails.appendChild(productItem);
  });

  calculateAndDisplaySubtotal(0);
  calculateAndDisplayTotal();
}

function applyDiscount() {
  discountForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (event.target.parentElement.querySelector("input").value == "AMIR10") {
      calculateAndDisplaySubtotal(10);
      calculateAndDisplayTotal();
    } else {
      calculateAndDisplaySubtotal(0);
      calculateAndDisplayTotal();
    }
  });
}

function calculateAndDisplaySubtotal(discount) {
  subtotalPrice =
    cartCheckoutItems.totalPrice -
    (cartCheckoutItems.totalPrice * discount) / 100;
  subtotalValue = subtotalPrice;
  subtotal.innerHTML = `$${subtotalPrice.toFixed(2)}`;
}

function calculateAndDisplayTotal() {
  total.innerHTML = `$${(subtotalValue + 2.99).toFixed(2)}`;
}

autoFill();
applyDiscount();
displayOrderDetails();
