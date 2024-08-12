const sidebarButtons = document.querySelectorAll(".option:not(title) a");

sidebarButtons.forEach((btn) =>
  btn.addEventListener("click", () => {
    window.location.href = `../results-page/results.html?collection=${btn.dataset.filter}`;
  })
);

function checkAccountInUse() {
  let accSidebarBtn =  document.querySelector('.option.title:nth-last-of-type(1) a');
  let account = JSON.parse(localStorage.getItem("account-in-use"));
  if(account){
    accSidebarBtn.href = "../cart-page/cart.html";
  }else{
    accSidebarBtn.href = "../login-page/login.html";
  }
}
checkAccountInUse();