
Promise.all([
    fetch('data/articulos.csv').then(res => res.text()),
    fetch('data/rubros.csv').then(res => res.text()),
    fetch('data/materiales.csv').then(res => res.text())
])
.then(([articulosData, rubrosData, materialesData]) => {
    const rubros = {};
    const materiales = {};

    const rubrosLineas = rubrosData.trim().split('\n').slice(1);
    rubrosLineas.forEach(linea => {
        const [codigo, nombre] = linea.split(',');
        rubros[codigo.padStart(3, '0')] = nombre;
    });

    const materialesLineas = materialesData.trim().split('\n').slice(1);
    materialesLineas.forEach(linea => {
        const [codigo, nombre] = linea.split(',');
        materiales[codigo.padStart(2, '0')] = nombre;
    });

    const lineas = articulosData.trim().split('\n');
    const encabezados = lineas[0].split(',');

    const idxDescripcion = encabezados.indexOf('"DESCRIPCIO"');
    const idxCosto = encabezados.indexOf('"COSTO"');
    const idxOrigen = encabezados.indexOf('"ORIGEN"');
    const idxRubro = encabezados.indexOf('"RUBRO"');
    const idxCantidad = encabezados.indexOf('"CANTIDAD_U"');
    const idxMaterial = encabezados.indexOf('"MATERIAL"');

    if ([idxDescripcion, idxCosto, idxOrigen, idxRubro, idxCantidad, idxMaterial].includes(-1)) {
        console.error('No se encontraron los campos esperados.');
        return;
    }

    const filas = lineas.slice(1).slice(0, 100);
    const productos = [];

    filas.forEach(fila => {
        const columnas = fila.split(',');

        const nombre = columnas[idxDescripcion]?.replaceAll('"', '');
        const precio = columnas[idxCosto];
        const imagen = columnas[idxOrigen]?.replaceAll('"', '');
        const cantidad = parseInt(columnas[idxCantidad]?.replaceAll('"', ''), 10);
        const rubroCodigo = columnas[idxRubro]?.padStart(3, '0');
        const materialCodigo = columnas[idxMaterial]?.padStart(2, '0');

        if (nombre && precio && imagen && !isNaN(cantidad) && cantidad > 0) {
            productos.push({
                nombre,
                precio,
                imagen,
                cantidad,
                rubro: rubros[rubroCodigo] || 'Sin categoría',
                material: materiales[materialCodigo] || 'Desconocido'
            });
        }
    });

    // Poblar selects de filtros
    const filtroRubro = document.getElementById('filtro-rubro');
    const filtroMaterial = document.getElementById('filtro-material');

    const rubrosUnicos = [...new Set(productos.map(p => p.rubro))].sort();
    rubrosUnicos.forEach(rubro => {
        const option = document.createElement('option');
        option.value = rubro;
        option.textContent = rubro;
        filtroRubro.appendChild(option);
    });

    const materialesUnicos = [...new Set(productos.map(p => p.material))].sort();
    materialesUnicos.forEach(material => {
        const option = document.createElement('option');
        option.value = material;
        option.textContent = material;
        filtroMaterial.appendChild(option);
    });

    const contenedor = document.getElementById('productos-lista');

    function mostrarProductos() {
        const rubroSeleccionado = filtroRubro.value;
        const materialSeleccionado = filtroMaterial.value;

        contenedor.innerHTML = '';
        productos
            .filter(p => (!rubroSeleccionado || p.rubro === rubroSeleccionado))
            .filter(p => (!materialSeleccionado || p.material === materialSeleccionado))
            .forEach(p => {
                contenedor.innerHTML += `
                    <div class="producto">
                        <img src="${p.imagen}" alt="${p.nombre}" />
                        <h3>${p.nombre}</h3>
                        <p>Precio: $${p.precio}</p>
                        <p>Categoría: ${p.rubro}</p>
                        <p>Material: ${p.material}</p>
                        <p>Cantidad: ${p.cantidad}</p>
                    </div>
                `;
            });
    }

    filtroRubro.addEventListener('change', mostrarProductos);
    filtroMaterial.addEventListener('change', mostrarProductos);

    mostrarProductos(); // inicial
});
