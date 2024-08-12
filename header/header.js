const menuIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e8eaed"><path d="M120-240v-66.67h720V-240H120Zm0-206.67v-66.66h720v66.66H120Zm0-206.66V-720h720v66.67H120Z"/></svg>`;
const closeIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="32px" fill="#e8eaed"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`;

const navBarSticky = document.querySelector(".sticky-navbar");
const lowerNavBarSearch = navBarSticky.querySelector("form");
const upperNavBarSearch = document.querySelector(".upper-navbar").querySelector("form");
const urlparam = new URLSearchParams(window.location.search);
const menuButtons = document.querySelectorAll(".open-menu-button");

let NavBarSearches = [lowerNavBarSearch, upperNavBarSearch];
let searchBarOpen = false;
let sideBarOpen = false;

// functions for the search bars in the NavBars (WIP)
NavBarSearches.forEach((form) => {
  form.querySelector("input").value = urlparam.get("search-question") || "";

  form.querySelector("button").addEventListener("click", () => {
    if (form.classList.contains("search-navbar-form-close") && searchBarOpen !== true) {
      form.classList.remove("search-navbar-form-close");
      form.classList.add("search-navbar-form-open");
      form.querySelector("input").focus();
      setTimeout(() => (searchBarOpen = true), 100);
    }
  });
  form.querySelector("input").addEventListener("focusout", () => {
    if (!form.matches(":hover")) {
      form.querySelector("input").style.animation = "animate-searchbar-navbar-close .15s ease-out";
      setTimeout(() => {
        form.classList.remove("search-navbar-form-open");
        form.classList.add("search-navbar-form-close");
        searchBarOpen = false;
        form.querySelector("input").style.animation = "";
      }, 140);
    }
  });
  form.addEventListener("submit", (e) => {
    if (form.querySelector("input").value == "" || searchBarOpen !== true) {
      e.preventDefault();
      if (searchBarOpen == true) {
        if (form.matches(":hover")) {
          form.querySelector("input").style.animation =
            "animate-searchbar-navbar-close .15s ease-out";
          setTimeout(() => {
            form.classList.remove("search-navbar-form-open");
            form.classList.add("search-navbar-form-close");
            searchBarOpen = false;
            form.querySelector("input").style.animation = "";
          }, 140);
        }
      }
    }
  });
});

async function fetchSideBar() {
  try {
    const response = await fetch("../sidebar/sidebar.html");
    if (!response.ok) throw new Error("Error fetching sidebar.");
    const html = await response.text();
    const sidebarCSSLink = document.createElement("link");
    sidebarCSSLink.rel = "stylesheet";
    sidebarCSSLink.href = "../sidebar/sidebar.css";
    sidebarCSSLink.onload = () => {
      const sidebarElement = document.createElement("div");
      sidebarElement.id = "side-bar";
      sidebarElement.innerHTML = `
                ${html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)[1]}
            `;
      const mainDivs = document.querySelectorAll("body > div");
      const mainContainer = document.createElement("div");
      mainContainer.id = "nextSideBar-Container";
      mainDivs.forEach((div) => mainContainer.appendChild(div));

      document.body.insertBefore(mainContainer, document.body.firstChild);
      document.body.insertBefore(sidebarElement, document.body.firstChild);

      const sidebarScript = document.createElement("script");
      sidebarScript.src = "../sidebar/sidebar.js";
      document.body.appendChild(sidebarScript);
    };

    document.head.appendChild(sidebarCSSLink);
  } catch (error) {
    console.error("Error loading HTML file!", error);
  }
}
// open sidebar when a menu btn is clicked
menuButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
    const sidebar = document.getElementById("side-bar");
    if (!sideBarOpen) {
      setTimeout(() => (sideBarOpen = true), 5);
      setTimeout(() => sidebar.classList.add("sidebar-Open"), 100);
      document.documentElement.style.overflowX = "hidden";
      if (navBarSticky.classList.contains("sticky-active")) {
        navBarSticky.classList.remove("sticky-active");
      }
      menuButtons.forEach(
        (btn) => (btn.innerHTML = btn.innerHTML.replace(/<svg[\s\S]*?<\/svg>/g, closeIcon))
      );
    }
  })
);
// when sidebar is open and any area other than the sidebar is clicked, sidebar closes
document.addEventListener("click", (e) => {
  const sidebar = document.getElementById("side-bar");
  if (sideBarOpen && !sidebar.contains(e.target)) {
    setTimeout(() => (sideBarOpen = false), 5);
    sidebar.classList.remove("sidebar-Open");
    document.documentElement.style.overflowX = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    menuButtons.forEach(
      (btn) => (btn.innerHTML = btn.innerHTML.replace(/<svg[\s\S]*?<\/svg>/g, menuIcon))
    );
    console.log('umm')
  }
});

// function for the sticky NavBar
window.onscroll = function () {
  if (!document.getElementById("side-bar").classList.contains("sidebar-Open")) {
    if (window.scrollY > document.querySelector(".lower-navbar").offsetTop) {
      navBarSticky.classList.add("sticky-active");
    } else {
      navBarSticky.classList.remove("sticky-active");
    }
  }
};

function checkAccountInUse() {
  const shoppingBtn = document.querySelectorAll(".shopping-bag-button");
  const accountBtn = document.querySelector(".lower-navbar a");
  const lowerNavBar = document.querySelector(".lower-navbar .page-width");
  let account = JSON.parse(localStorage.getItem("account-in-use"));
  

  let logout = document.createElement("a");
  if (account) {
    accountBtn.href = "../cart-page/cart.html";
    let cartAmount = 0;
    account.cart.cartItems.forEach((product) => (cartAmount += product.quantity));
    let cartTotal = 0;
    if (cartAmount > 0) {
      if (cartAmount < 99) cartTotal = cartAmount.toString();
      else cartTotal = "99+";
      shoppingBtn.forEach((btn) =>
        btn.style.setProperty("--shopping-items-size", `"${cartTotal}"`)
      );
    }
    shoppingBtn.forEach((btn) => (btn.href = "../cart-page/cart.html"));
    
    logout.innerHTML = "Logout";
    logout.addEventListener("click", () => {
      let allAccounts = JSON.parse(localStorage.getItem('users'));
      allAccounts.forEach(acc => {
        if(acc.email ===  account.email){
          acc.cart = account.cart;
        }
      });
      localStorage.setItem('users',JSON.stringify(allAccounts));
      localStorage.removeItem("account-in-use");
      window.location.href = "../main-page/index.html";
    });
    lowerNavBar.appendChild(logout);
  } else {
    if (lowerNavBar.contains(logout)) {
      logout.remove();
    }
    accountBtn.href = "../login-page/login.html";
    
    shoppingBtn.forEach((btn) => (btn.href = "../login-page/login.html"));
  }
}

function updateShoppingBagCount() {
  const shoppingBtn = document.querySelectorAll(".shopping-bag-button");
  const accountBtn = document.querySelector(".lower-navbar a");
  let account = JSON.parse(localStorage.getItem("account-in-use"));

  if (account) {
    accountBtn.href = "../cart-page/cart.html";
    let cartAmount = 0;
    account.cart.cartItems.forEach((product) => (cartAmount += product.quantity));
    let cartTotal = 0;
    if (cartAmount > 0) {
      if (cartAmount < 99) cartTotal = cartAmount.toString();
      else cartTotal = "99+";
      shoppingBtn.forEach((btn) =>
        btn.style.setProperty("--shopping-items-size", `"${cartTotal}"`)
      );
    } else {
      shoppingBtn.forEach((btn) => btn.style.setProperty("--shopping-items-size", 0));
    }
    shoppingBtn.forEach((btn) => (btn.href = "../cart-page/cart.html"));
  } else {
    accountBtn.href = "../login-page/login.html";
    shoppingBtn.forEach((btn) => (btn.href = "../login-page/login.html"));
  }
}

fetchSideBar();
checkAccountInUse();
