Promise.all([
    fetch('data/articulos.csv').then(res => res.text()),
    fetch('data/rubros.csv').then(res => res.text()),
    fetch('data/materiales.csv').then(res => res.text())
])
    .then(([articulosData, rubrosData, materialesData]) => {
        const filtroRubro = document.getElementById('filtro-rubro');
        const filtroMaterial = document.getElementById('filtro-material');
        const contenedor = document.getElementById('productos-lista');

        if (!filtroRubro || !filtroMaterial || !contenedor) {
            console.warn('No es la página de productos. Script productos.js no se ejecuta.');
            return;
        }

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

        const buscadorNombre = document.getElementById('buscador-nombre');

        buscadorNombre.addEventListener('input', mostrarProductos);

        if ([idxDescripcion, idxCosto, idxOrigen, idxRubro, idxCantidad, idxMaterial].includes(-1)) {
            console.error('No se encontraron los campos esperados.');
            return;
        }

        const filas = lineas.slice(1).slice(0, 100);
        const productos = [];

        filas.forEach((fila, index) => {
            const columnas = fila.split(',');

            const nombre = columnas[idxDescripcion]?.replaceAll('"', '');
            const precio = columnas[idxCosto];
            const imagen = columnas[idxOrigen]?.replaceAll('"', '');
            const cantidad = parseInt(columnas[idxCantidad]?.replaceAll('"', ''), 10);
            const rubroCodigo = columnas[idxRubro]?.padStart(3, '0');
            const materialCodigo = columnas[idxMaterial]?.padStart(2, '0');

            if (nombre && precio && imagen && !isNaN(cantidad) && cantidad > 0) {
                productos.push({
                    id: `prod-${index}`,
                    nombre,
                    precio,
                    imagen,
                    cantidad,
                    rubro: rubros[rubroCodigo] || 'Sin categoría',
                    material: materiales[materialCodigo] || 'Desconocido'
                });
            }
        });

        // Poblar filtros
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

        function mostrarProductos() {
            const rubroSeleccionado = filtroRubro.value;
            const materialSeleccionado = filtroMaterial.value;
            const nombreBuscado = buscadorNombre.value.toLowerCase();

            contenedor.innerHTML = '';

            const productosFiltrados = productos
                .filter(p => (!rubroSeleccionado || p.rubro === rubroSeleccionado))
                .filter(p => (!materialSeleccionado || p.material === materialSeleccionado))
                .filter(p => p.nombre.toLowerCase().includes(nombreBuscado));

            if (productosFiltrados.length === 0) {
                contenedor.innerHTML = `<p class="no-productos">No se encontraron productos que coincidan con la búsqueda.</p>`;
                return;
            }

            productosFiltrados.forEach(p => {
                contenedor.innerHTML += `
                    <div class="producto-card">
                        <img src="${p.imagen}" alt="${p.nombre}" />
                        <div class="producto-info">
                            <h3 class="producto-nombre">${p.nombre}</h3>
                        <div class="producto-detalles">
                            <p><strong>Precio:</strong> $${p.precio}</p>
                            <p><strong>Stock:</strong> ${p.cantidad}</p>
                        </div>
                            <p><strong>Categoría:</strong> ${p.rubro}</p>
                            <p><strong>Material:</strong> ${p.material}</p>
                        </div>
                        <button class="agregar-carrito" data-id="${p.id}">Agregar al carrito</button>
                    </div>
                `;
            });


            // Eventos de botón agregar al carrito
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

                    localStorage.setItem("carrito", JSON.stringify(carrito));
                    actualizarContadorCarrito();
                    mostrarCarrito();
                });
            });
        }

        filtroRubro.addEventListener('change', mostrarProductos);
        filtroMaterial.addEventListener('change', mostrarProductos);
        mostrarProductos(); // inicial
    });
