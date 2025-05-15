Promise.all([
    fetch('data/articulos.csv').then(res => res.text()),
    fetch('data/rubros.csv').then(res => res.text())
]).then(([articulosData, rubrosData]) => {
    const rubros = {};
    const rubrosLineas = rubrosData.trim().split('\n').slice(1); // ignorar encabezado
    rubrosLineas.forEach(linea => {
        const [codigo, nombre] = linea.split(',');
        rubros[codigo.padStart(3, '0')] = nombre; // aseguramos 3 dígitos
    });

    const lineas = articulosData.trim().split('\n');
    const encabezados = lineas[0].split(',');

    const idxDescripcion = encabezados.indexOf('"DESCRIPCIO"');
    const idxCosto = encabezados.indexOf('"COSTO"');
    const idxOrigen = encabezados.indexOf('"ORIGEN"');
    const idxRubro = encabezados.indexOf('"RUBRO"');

    if ([idxDescripcion, idxCosto, idxOrigen, idxRubro].includes(-1)) {
        console.error('No se encontraron los campos esperados en el CSV.');
        return;
    }

    const filas = lineas.slice(1).slice(0, 100); // máximo 100 productos
    const contenedor = document.getElementById('productos-lista');

    filas.forEach(fila => {
        const columnas = fila.split(',');
        const nombre = columnas[idxDescripcion]?.replaceAll('"', '');
        const precio = columnas[idxCosto];
        const imagen = columnas[idxOrigen]?.replaceAll('"', '');
        const rubroCodigo = columnas[idxRubro]?.padStart(3, '0');
        const rubroNombre = rubros[rubroCodigo] || 'Sin categoría';

        if (nombre && precio && imagen) {
            const productoHTML = `
                <div class="producto">
                    <img src="${imagen}" alt="${nombre}" />
                    <h3>${nombre}</h3>
                    <p>Precio: $${precio}</p>
                    <p>Categoría: ${rubroNombre}</p>
                </div>
            `;
            contenedor.innerHTML += productoHTML;
        }
    });
});
