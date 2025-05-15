document.getElementById("contactoForm").addEventListener("submit", function (e) {
    e.preventDefault();
    alert("¡Formulario enviado!");
    this.reset();
  });