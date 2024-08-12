let footerURL = "../footer/footer.html";
let headerURL = "../header/header.html";

let questionContainers = document.querySelectorAll(".question-container");
let questionAnswerContainers = document.querySelectorAll(".question-answer-container");

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

function handleFAQClick(event) {
  let container = event.currentTarget;
  let plusSign = container.querySelector(".question-container .faq-plus-sign");
  let answer = container.querySelector(".faq-answer");
  // Toggle plus sign
  plusSign.textContent = plusSign.textContent === "+" ? "-" : "+";
  plusSign.classList.toggle("toggled");
  console.log(answer.style.display);
  // Toggle answer visibility
  if (answer.style.display === "none" || answer.style.display === "") {
    answer.style.display = "block";
  } else {
    answer.style.display = "none";
  }
}

function questionAnswerContainerListeners() {
  questionAnswerContainers.forEach((container) => {
    container.addEventListener("click", handleFAQClick);
  });
}

// Initialize event listeners
questionAnswerContainerListeners();
