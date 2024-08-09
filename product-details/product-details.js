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

let productImageContainer = document.querySelector("#product-image-container");
let productImage = document.querySelector("#product-image-container img");
let imagePaginationContainer = document.querySelector(".image-pagination-container");
let paginationButtons = document.getElementsByClassName("pagination-button");

let isZoomed = false;
let debounceTimer;
let lastMouseX = 0;
let lastMouseY = 0;
let isMouseMoving = false;

function addMagnifierEffect() {
  productImage.addEventListener("mousemove", (event) => {
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
    isMouseMoving = true;

    if (!debounceTimer) {
      debounceTimer = setTimeout(() => {
        if (isMouseMoving) {
          const rect = productImageContainer.getBoundingClientRect();
          const x = lastMouseX - rect.left;
          const y = lastMouseY - rect.top;

          productImage.style.transformOrigin = `${x}px ${y}px`;
          productImage.style.transform = "scale(2)";
          isZoomed = true;

          debounceTimer = null;
          isMouseMoving = false;
        }
      }, 1); // Adjust the debounce delay as needed
    }
  });
}

function removeMagnifierEffect() {
  productImage.addEventListener("mouseleave", () => {
    productImage.style.transformOrigin = "center";
    productImage.style.transform = "scale(1)";
    isZoomed = false;
    lastMouseX = 0;
    lastMouseY = 0;
    isMouseMoving = false;
    clearTimeout(debounceTimer);
    debounceTimer = null;
  });
}

imagePaginationContainer.addEventListener("click", (event) => {
  // console.log(event);

  if (event.target.classList.contains("pagination-button"))
    addScaleEffectToPaginationButton(event.target);
});

function addScaleEffectToPaginationButton(button) {
  let previousSelectedButton = document.querySelector(".pagination-scale-up");
  // console.log(previousSelectedButton);

  if (previousSelectedButton) previousSelectedButton.classList.remove("pagination-scale-up");
  button.classList.add("pagination-scale-up");
}

addMagnifierEffect();
removeMagnifierEffect();

// ===============================================


const prodPrice = document.querySelector(".product-price");
const prodOptionsContainer = document.querySelector(".product-options");
const prodTitle = document.querySelector(".details-right-container h1");
const prodDiscountedPrice = document.getElementById("discounted-price");
const prodOriginalPrice = document.getElementById("original-price");
const prodImage = document.getElementById("prod-img1");
const prodId = document.getElementById("item-id");
const imgPagin = document.querySelector(".image-pagination-container");
const addCartBtn = document.getElementById("add-to-cart");
const prodDesc = document.getElementById("prod-description");
const colorContainer = document.querySelector(".color-container");
const colorDisplay = document.getElementById("chosen-color");
const video = document.querySelector('div video');
const arrowImgLeft = document.getElementById('product-arrow-left');
const arrowImgRight = document.getElementById('product-arrow-right');

let imageIndex = 0;
let imgUrlArray = [];
let paginBtns = [];
let currentProd;


const colorMap = {
  bay: "#8cc0f0",
  hazel: "#888984",
  obsidian: "#232323",
  porcelain: "#e5dbd1",
  rose: "#ffdfca",
  aloe: "#b4f9c3",
  black: "#4c4d4f",
  orange: "#d7612f",
  purple: "#998da1",
  silver: "#f2f4f3",
  green: "#71cca2",
  gold: "#f3e5cb",
  blue: "#f6fafb",
  yellow: "#fffae4",
  white: "#e1e1df",
  "emerald-green": "#3d4e44",
  "rococo-pearl": "#f7f4f8",
  "mecha-blue": "#797b87",
  "titan-gold": "#face87",
  "vintage-green": "#5d6f63",
  "galaxy-white": "#f3f9ef",
  "rainbow-blue": "#e0f3fa",
  "shiny-gold": "#fffae2",
  "timber-black": "#252831",
  "deep-purple": "#463e4d",
  "space-black": "#31302e",
  "black-titanium": "#434240",
  "blue-titanium": "#555b69",
  "natural-titanium": "#a4a19a",
  "white-titanium": "#f2efe8",
  "light-green": "#b8cbc5",
  "dark-grey": "#3e4148",
  milk: "#ececec",
  "cool-blue": "#85b3d7",
  "iron-grey": "#47484d",
  "chromatic-grey": "#252d2f",
  "emerald-dusk": "#596a62",
  "voyager-black": "#141414",
  "awesome-iceblue": "#e2e7ef",
  "awesome-lemon": "#fcefb8",
  "awesome-lilac": "#eae4e9",
  "awesome-navy": "#2a2e37",
  "jade-green": "#dde9d5",
  "marble-gray": "#cac8c9",
  "onyx-black": "#404040",
  "sandstone-orange": "#db9b6d",
  "sapphire-blue": "#ccd2e0",
  "titanium-black": "#3e3e3c",
  "titanium-gray": "#968b87",
  "titanium-violet": "#433e55",
  "titanium-yellow": "#eee0b1",
  "mars-orange": "#c6521e",
  "stardust-grey": "#293138",
  "comet-green": "#47785e",
  "meteorite-grey": "#414141",
};

arrowImgLeft.addEventListener('click', () => {
  imageIndex = (imageIndex>0)?imageIndex - 1: imgUrlArray.length - 1;
  updateImageDisplay();
});
arrowImgRight.addEventListener('click', () => {
  imageIndex = (imageIndex < imgUrlArray.length - 1)?imageIndex + 1: 0;
  updateImageDisplay();
});

const getProducts = () => {
  const urlparam = new URLSearchParams(window.location.search);
  let searchResult = urlparam.get("details");

  DataBase.fetchProductById(searchResult).then((prod) => {
    prodTitle.innerHTML = `${prod.itemName}`;
    prodOriginalPrice.innerHTML = `$${(prod.itemPrice - 0).toFixed(2)}`;
    video.src = prod.imageURL[0];
    prodImage.src = prod.imageURL[1];

    updateCurrentProd(prod);
    updateAddCartBtn(prod);

    prod.imageURL.slice(1).forEach((url) => {
      let pagBtn = document.createElement("button");
      pagBtn.classList.add("pagination-button");
      pagBtn.addEventListener("click", () => {
        imageIndex = imgUrlArray.indexOf(url);
        updateImageDisplay();
      });
      paginBtns.push(pagBtn);
      imgPagin.appendChild(pagBtn);
      imgUrlArray.push(url);
    });

    if (prod.discount <= 0) {
      prodDiscountedPrice.style.display = "none";
      prodOriginalPrice.style.textDecoration = "none";
    } else {
      prodDiscountedPrice.innerHTML = `$${(
        prod.itemPrice -
        (prod.itemPrice * prod.discount) / 100
      ).toFixed(2)}`;
    }
    
    prodDesc.innerHTML = prod.itemDescription;

    // adding colors
    prod.color.forEach((color) => {
      let circle = document.createElement("div");
      circle.classList.add("color-circle");
      circle.style.backgroundColor = colorMap[color] || color.split('-').join(' ');
      circle.dataset.hoverText = color.split('-').join(' ');
      circle.addEventListener("click", () => {
        imageIndex = imgUrlArray.indexOf((imgUrlArray.filter((url) => url.includes(color)))[0]);
        updateCurrentProd(prod, color);
        updateImageDisplay()
      });
      colorContainer.appendChild(circle);
    });
    
  });

  
};

addCartBtn.addEventListener("click", () => {
  let account = JSON.parse(localStorage.getItem("account-in-use"));
  if (!account) {
    window.location.href = "../login-page/login.html";
  } else {
    let cart = account.cart;
    let product = currentProd;
    let isProdFound = false;
    for (let i = 0; i < cart.cartItems.length; i++) {
      if (cart.cartItems[i].product.itemID == product.itemID 
        && cart.cartItems[i].product.color[0] == product.color[0]) {
        cart.cartItems[i].quantity++;
        cart.totalPrice = parseFloat(
          (
            parseFloat(cart.totalPrice) +
            parseFloat(product.itemPrice) -
            (parseFloat(product.itemPrice) * parseFloat(product.discount)) / 100
          ).toFixed(2)
        );
        isProdFound = true;
      }
    }
    if (!isProdFound) {
      cart.cartItems.push({
        quantity: 1,
        product: product,
      });
      if (!cart.totalPrice) cart.totalPrice = 0;
      cart.totalPrice = parseFloat(
        (
          parseFloat(cart.totalPrice) +
          parseFloat(product.itemPrice) -
          (parseFloat(product.itemPrice) * parseFloat(product.discount)) / 100
        ).toFixed(2)
      );
    }
    localStorage.setItem("account-in-use", JSON.stringify(account));
    window.location.href = "../cart-page/cart.html";
  }
});

function updateImageDisplay() {
  prodImage.src = imgUrlArray[imageIndex];
  addScaleEffectToPaginationButton(paginBtns[imageIndex]);
}

function updateAddCartBtn(prod) {
  if (prod.stockQty <= 0) {
    addCartBtn.disabled = true;
    addCartBtn.innerHTML = "SOLD OUT";
    addCartBtn.style.backgroundColor = "#0a2136";
  } else {
    addCartBtn.disabled = false;
    addCartBtn.innerHTML = "Add to Cart";
    addCartBtn.style.backgroundColor = "#1e4974";
  }
}

function updateCurrentProd(prod, colorChosen = prod.color[0]) {
  currentProd = deepCopy(prod);
  currentProd.color = [];
  currentProd.color.push(colorChosen);
  if (colorChosen) colorDisplay.innerHTML = `Color: ${colorChosen.split('-').join(' ')}`;
}

getProducts();

function deepCopy(obj) {
  if (obj === null || typeof obj !== 'object') {
      return obj;
  }
  if (Array.isArray(obj)) {
      return obj.map(deepCopy);
  }
  const copy = {};
  for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
          copy[key] = deepCopy(obj[key]);
      }
  }
  return copy;
}
