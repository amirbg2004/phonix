let footerURL = "../footer/footer.html";
let headerURL = "../header/header.html";

const inputs = document.querySelectorAll(".input-group input");
const form = document.getElementById("sign-up-form");
const signUpButton = document.getElementById("sign-up-button");
const alertField = document.getElementById("alert-field");

const phoneRegex = /^[0-9]{8}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function isFieldEmpty(input) {
  if (input.value.trim() === "") return true;
  return false;
}

function isEmail(input) {
  return emailRegex.test(input.value.trim());
}

function isPhoneNumber(input) {
  return phoneRegex.test(input.value.trim());
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  alertField.innerHTML = "";
  inputs.forEach((input) => {
    input.style.backgroundColor = "#f4f4f4";
    input.style.fontWeight = 500;
  });
  let counter = 0;
  inputs.forEach((input) => {
    if (isFieldEmpty(input)) {
      counter++;
      input.style.backgroundColor = "#EC523E";
      input.style.fontWeight = 600;
      input.style;
      let alert = document.createElement("p");
      alert.innerHTML = `
                            <p>${input.placeholder} can't be blank.</p>
                        `;
      alertField.appendChild(alert);
    } else if (input.name === "email" && !isEmail(input)) {
      counter++;
      input.style.backgroundColor = "#EC523E";
      input.style.fontWeight = 600;
      let alert = document.createElement("p");
      alert.innerHTML = `
                            <p>${input.placeholder} is invalid!</p>
                        `;
      alertField.appendChild(alert);
    } else if (input.name === "phone" && !isPhoneNumber(input)) {
      counter++;
      input.style.backgroundColor = "#EC523E";
      input.style.fontWeight = 600;
      let alert = document.createElement("p");
      alert.innerHTML = `
                            <p>${input.placeholder} is invalid!</p>
                        `;
      alertField.appendChild(alert);
    }
  });
  if (inputs[4].value !== inputs[5].value) {
    counter++;
    let alert = document.createElement("p");
    alert.innerHTML = `
                        Password and Confirm Password don't match!`;
    alertField.appendChild(alert);
  }
  if (counter != 0) alertField.style.display = "block";
  else {
    const firstName = inputs[0].value;
    const lastName = inputs[1].value;
    const email = inputs[2].value;
    const phoneNum = inputs[3].value;
    const pass = inputs[4].value;

    simpleHash(pass).then((hashedPass) => {
      const acc = new Account(firstName, lastName, email, hashedPass, phoneNum);
      const add = addAccount(acc);
      if (add) {
        alertField.style.display = "none";
        window.location.href = "../main-page/index.html";
      } else {
        let alert = document.createElement("p");
        alert.innerHTML = `Account already created.`;
        alertField.appendChild(alert);
        alertField.style.display = "block";
      }
    });
  }
});
