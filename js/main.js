let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

window.addEventListener("DOMContentLoaded", () => {
  loadComponent("components/nav.html", "nav", initCartModal);
  loadComponent("components/footer.html", "footer");
});

function loadComponent(url, selector, callback) {
  fetch(url)
    .then(res => res.text())
    .then(data => {
      document.getElementById(selector).innerHTML = data;
      if (callback) callback();
    });
}





/****** CARROUSEL ******/
let currentIndex = 0;
const slider = document.getElementById('slider');
const slides = slider.querySelectorAll('img');
const totalSlides = slides.length;

function showSlide(index) {
  // Asegura que el índice esté en rango
  if (index < 0) currentIndex = totalSlides - 1;
  else if (index >= totalSlides) currentIndex = 0;
  else currentIndex = index;

  const offset = -currentIndex * 100;
  slider.style.transform = `translateX(${offset}%)`;
}

document.querySelector('.prev').addEventListener('click', () => {
  showSlide(currentIndex - 1);
});

document.querySelector('.next').addEventListener('click', () => {
  showSlide(currentIndex + 1);
});

setInterval(() => {
  showSlide(currentIndex + 1);
}, 5000);

showSlide(0);
