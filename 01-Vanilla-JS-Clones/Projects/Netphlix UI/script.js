const cardCon = document.querySelector(".card-container");
const leftBtn = document.querySelector(".prevbtn");
const rightBtn = document.querySelector(".nextbtn");

const scrollAmount = 700;
const maxScroll = cardCon.scrollWidth - cardCon.clientWidth - 50;


leftBtn.addEventListener('click', () => {
    cardCon.scrollLeft -= scrollAmount;
})

rightBtn.addEventListener('click', () => {
    cardCon.scrollLeft += scrollAmount;
})

function ScrollCheck() {
    cardCon.scrollLeft <= 50 ? leftBtn.classList.add("prevbtnHide") : leftBtn.classList.remove("prevbtnHide");
    cardCon.scrollLeft >= maxScroll ? rightBtn.classList.add("nextbtnHide") : rightBtn.classList.remove("nextbtnHide");
}

ScrollCheck();
cardCon.addEventListener('scroll', ScrollCheck);