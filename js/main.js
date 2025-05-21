window.addEventListener("DOMContentLoaded", () => {
  loadComponent("components/nav.html", "nav", initCartModal);
  loadComponent("components/footer.html", "footer");
});

function loadComponent(url, targetId, callback) {
  fetch(url)
    .then(res => res.text())
    .then(html => {
      document.getElementById(targetId).innerHTML = html;
      if (typeof callback === "function") callback(); 
    })
    .catch(err => console.error("Error cargando componente:", err));
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



/** ** CART ** */

function initCartModal() {
  const cartIcon = document.getElementById('cart-icon');
  const cartModal = document.getElementById('cart-modal');
  const closeBtn = document.querySelector('.close-btn');

  if (cartIcon && cartModal && closeBtn) {
    cartIcon.addEventListener('click', () => {
      cartModal.classList.add('open');
    });

    closeBtn.addEventListener('click', () => {
      cartModal.classList.remove('open');
    });

    window.addEventListener('click', (e) => {
      if (e.target === cartModal) {
        cartModal.classList.remove('open');
      }
    });
  } else {
    console.warn('No se encontró algún elemento necesario para el modal del carrito');
  }
}
