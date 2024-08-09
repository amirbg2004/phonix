const sidebarButtons = document.querySelectorAll(".sub-option a, .option:not(title) a");

sidebarButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
    window.location.href = `../results-page/results.html?collection=${btn.dataset.filter}`;
    console.log("Hello");
  })
);
