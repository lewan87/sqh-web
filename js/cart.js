/** ** CART ** */
function initCartModal() {
  const cartIcon = document.getElementById('cart-icon');
  const cartModal = document.getElementById('cart-modal');
  const closeBtn = document.querySelector('.close-btn');

  if (!cartIcon || !cartModal || !closeBtn) {
    console.warn('No se encontró algún elemento necesario para el modal del carrito');
    return;
  }

  // Mostrar y ocultar el modal
  cartIcon.addEventListener('click', () => {
    mostrarCarrito(); // 👈 Mostrar productos cada vez que se abre
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
  actualizarContadorCarrito();

}



document.querySelectorAll('.agregar-carrito').forEach(boton => {
  boton.addEventListener('click', () => {
    const id = boton.dataset.id;
    const producto = productos.find(p => p.id === id);

    if (!producto) return;

    const existe = carrito.find(item => item.id === id);
    if (existe) {
      existe.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    mostrarCarrito();
  });
});

function mostrarCarrito() {
  const contenedor = document.getElementById("cart-items");
  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>El carrito está vacío.</p>";
    return;
  }

  carrito.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("item-carrito");

    div.innerHTML = `
      <img src="${item.imagen}" alt="${item.nombre}" />
      <div class="info-superior">
        <p class="nombre">${item.nombre}</p>
      </div>
      <div class="info-inferior">
        <p>Precio: $${item.precio}</p>
        <p>Cantidad: ${item.cantidad}</p>
      </div>
      <button class="eliminar-producto" data-index="${index}">Eliminar</button>
    `;


    contenedor.appendChild(div);
  });

  document.querySelectorAll('.eliminar-producto').forEach(boton => {
    boton.addEventListener('click', () => {
      const index = boton.dataset.index;
      if (carrito[index].cantidad > 1) {
        carrito[index].cantidad--; // Resta una unidad
      } else {
        carrito.splice(index, 1); // Elimina si solo queda una unidad
      }
      localStorage.setItem("carrito", JSON.stringify(carrito)); // Guarda cambios
      mostrarCarrito(); // Vuelve a renderizar
      actualizarContadorCarrito();
    });
  });


}

function actualizarContadorCarrito() {
  const cartCount = document.getElementById("cart-count");
  const carritoGuardado = JSON.parse(localStorage.getItem("carrito")) || [];

  const total = carritoGuardado.reduce((sum, item) => sum + item.cantidad, 0);

  if (cartCount) {
    if (total > 0) {
      cartCount.textContent = total;
      cartCount.style.display = 'inline-block';
    } else {
      cartCount.style.display = 'none';
    }
  }
}

