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

const resetPass = document.getElementById("reset-pass");
const cancelBtn = document.getElementById("cancel");
const loginContainer = document.querySelector(".login-container");
const resetContainer = document.querySelector(".reset");
const loginForm = document.getElementById("login-form");
const resetForm = document.getElementById("resetpass-form");
const loginAlert = document.getElementById("alert-login-container");
const resetAlert = document.getElementById("alert-reset-container");
const loginInputs = document.querySelectorAll(".login-container input");
const resetInput = document.getElementById("reset-email");
const resetResponse = document.getElementById("reset-response-container");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEmpty(input) {
  return input.value.trim() === "";
}

function isValid(input) {
  return emailPattern.test(input.value.trim());
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loginAlert.innerHTML = "";
  loginInputs.forEach((input) => {
    input.style.backgroundColor = "#f4f4f4";
    input.style.fontWeight = 500;
  });

  let counter = 0;
  loginInputs.forEach((input) => {
    if (isEmpty(input)) {
      counter++;
      input.style.backgroundColor = "#EC523E";
      input.style.fontWeight = 600;
      let alert = document.createElement("p");
      alert.innerHTML = `<p>${input.placeholder} can't be blank.</p>`;
      loginAlert.appendChild(alert);
    } else if (input.name === "email" && !isValid(input)) {
      counter++;
      input.style.backgroundColor = "#EC523E";
      input.style.fontWeight = 600;
      let alert = document.createElement("p");
      alert.innerHTML = `<p>${input.placeholder} is invalid!</p>`;
      loginAlert.appendChild(alert);
    }
  });

  if (counter != 0) loginAlert.style.display = "block";
  else {
    const email = loginInputs[0].value;
    const pass = loginInputs[1].value;

    simpleHash(pass).then((hashedPass) => {
      if (!checkAccount(email)) {
        if (checkPassword(email, hashedPass)) {
          const acc = getAccount(email);
          saveCurrUser(acc);
          loginAlert.style.display = "none";
          window.location.href = "../main-page/index.html";
        } else {
          let alert = document.createElement("p");
          alert.innerHTML = `Incorrect email or password.`;
          loginAlert.appendChild(alert);
          loginAlert.style.display = "block";
        }
      } else {
        let alert = document.createElement("p");
        alert.innerHTML = `Please sign up, account not found.`;
        loginAlert.appendChild(alert);
        loginAlert.style.display = "block";
      }
      resetResponse.style.display = "none";
    });
  }
});

resetForm.addEventListener("submit", (event) => {
  event.preventDefault();
  resetAlert.innerHTML = "";
  resetInput.style.backgroundColor = "#f4f4f4";
  resetInput.style.fontWeight = 500;

  let counter = 0;
  if (isEmpty(resetInput)) {
    counter++;
    resetInput.style.backgroundColor = "#EC523E";
    resetInput.style.fontWeight = 600;
    let alert = document.createElement("p");
    alert.innerHTML = `<p>${resetInput.placeholder} can't be blank.</p>`;
    resetAlert.appendChild(alert);
  } else if (!isValid(resetInput)) {
    counter++;
    resetInput.style.backgroundColor = "#EC523E";
    resetInput.style.fontWeight = 600;
    let alert = document.createElement("p");
    alert.innerHTML = `<p>${resetInput.placeholder} is invalid!</p>`;
    resetAlert.appendChild(alert);
  }

  if (counter != 0) resetAlert.style.display = "block";
  else {
    const emailToReset = resetInput.value;
    if (!checkAccount(emailToReset)) {
      loginContainer.style.display = "flex";
      resetContainer.style.display = "none";
      resetResponse.innerHTML = "";
      let alert = document.createElement("p");
      alert.innerHTML = `We've sent you an email with a link to update your password.`;
      resetResponse.appendChild(alert);
      resetResponse.style.display = "block";
    } else {
      let alert = document.createElement("p");
      alert.innerHTML = `Please sign up, account not found.`;
      resetAlert.appendChild(alert);
      resetAlert.style.display = "block";
    }
  }
});

resetPass.addEventListener("click", () => {
  loginContainer.style.display = "none";
  resetContainer.style.display = "flex";
  loginAlert.style.display = "none";
});

cancelBtn.addEventListener("click", () => {
  loginContainer.style.display = "flex";
  resetContainer.style.display = "none";
  resetAlert.style.display = "none";
});
