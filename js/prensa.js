// Esperamos que el DOM esté cargado
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal-imagen");
  const imagenAmpliada = document.getElementById("imagen-ampliada");

  document.querySelectorAll(".div-prensa img").forEach(img => {
    img.addEventListener("click", () => {
      imagenAmpliada.src = img.src;
      modal.style.display = "flex";
    });
  });

  modal.addEventListener("click", () => {
    modal.style.display = "none";
    imagenAmpliada.src = "";
  });
});
