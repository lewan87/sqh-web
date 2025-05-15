function includeHTML(selector, file) {
  fetch(file)
    .then(res => res.text())
    .then(data => {
      document.querySelector(selector).innerHTML = data;
    })
    .catch(err => console.error(`Error al incluir ${file}:`, err));
}
