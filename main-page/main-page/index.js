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

function displayCards(product, gridElement) {
  let priceDis = product[0].itemPrice - (product[0].itemPrice * product[0].discount) / 100;
  let priceDisP =
    product[0].discount > 0
      ? `<s>$${product[0].itemPrice}</s>  $${priceDis.toFixed(2)}`
      : `$${priceDis.toFixed(2)}`;
  let price =
    product[0].stockQty > 0 ? `<p>${priceDisP}</p>` : `<p style="font-weight: bold;">SOLD OUT</p>`;
  let productGroup = [];
  product.forEach((prod) => productGroup.push(prod["itemID"]));

  let cardTemplate = document.createElement("div");
  cardTemplate.classList.add("prod1");
  cardTemplate.innerHTML = `
  <a href="../product-details/product-details.html?details=${productGroup.join("+")}">
    <div class="prod-img"><img src=${product[0].imageURL[1]} alt="${product[0].itemID}"></div>
    <p class="prod-title">${product[0].itemName}</p>
    ${price}
    <div class="prod-view-container">
      <div class="view-all-button">VIEW</div>
    </div>
  </a>
  `;
  if (product[0].discount <= 0) {
    cardTemplate.style.setProperty("--sale-render", "none");
  }
  gridElement.appendChild(cardTemplate);
}

function groupProductsByName(products) {
  let grouped = {};
  products.forEach((product) => {
    if (!grouped[product.itemName]) {
      grouped[product.itemName] = {
        itemName: product.itemName,
        items: [],
      };
    }
    grouped[product.itemName].items.push(product);
  });
  return Object.values(grouped);
}

let samsungContainer = document.querySelector(".div1");
let iphoneContainer = document.querySelector(".div2");
let googleContainer = document.querySelector(".div3");
DataBase.fetchProductsByType("samsung").then((products) =>
  groupProductsByName(products).forEach((product) =>
    displayCards(product["items"], samsungContainer)
  )
);
DataBase.fetchProductsByType("iphone").then((products) =>
  groupProductsByName(products).forEach((product) =>
    displayCards(product["items"], iphoneContainer)
  )
);
DataBase.fetchProductsByType("google").then((products) =>
  groupProductsByName(products.slice(0, 4)).forEach((product) =>
    displayCards(product["items"], googleContainer)
  )
);

fetchFooter();
fetchHeader();
