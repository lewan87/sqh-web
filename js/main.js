window.addEventListener("DOMContentLoaded", () => {
  loadComponent("components/nav.html", "nav");
  loadComponent("components/footer.html", "footer");
});

function loadComponent(url, elementId) {
  fetch(url)
    .then(res => res.text())
    .then(html => document.getElementById(elementId).innerHTML = html);
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

// Cambio automático cada 5 segundos
setInterval(() => {
  showSlide(currentIndex + 1);
}, 5000);

// Inicializar el carrusel
showSlide(0);
