document.addEventListener('DOMContentLoaded', () => {
  const cartIcon = document.getElementById('cart-icon');
  const cartModal = document.getElementById('cart-modal');
  const closeBtn = document.querySelector('.close-btn');
  console.log('CART.JS LOADED')

  cartIcon.addEventListener('click', () => {
    cartModal.classList.add('open');
  });

  closeBtn.addEventListener('click', () => {
    cartModal.classList.remove('open');
  });

  // También podés cerrarlo haciendo clic fuera del modal
  window.addEventListener('click', (e) => {
    if (e.target === cartModal) {
      cartModal.classList.remove('open');
    }
  });
});
