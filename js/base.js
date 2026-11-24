
document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".boton").forEach(contenedor => {

        const boton = contenedor.querySelector("button");
        const dialogoBoton = contenedor.querySelector(".dialogo-boton");

        if (!boton || !dialogoBoton) return;

        let temporizador;

        boton.addEventListener("click", () => {

            clearTimeout(temporizador);

            dialogoBoton.classList.add("visible");

            temporizador = setTimeout(() => {
                dialogoBoton.classList.remove("visible");
            }, 2000);

        });

    });

    document.querySelectorAll('.tabs-container').forEach(container => {

        const buttons = container.querySelectorAll('.tabs-nav [data-tab]');
        const panels = container.querySelectorAll('[data-tab-content]');

        buttons.forEach(button => {

            button.addEventListener('click', function () {

                const tabId = this.dataset.tab;

                // Desactivar todos los botones
                buttons.forEach(btn => {
                    btn.classList.remove('active');
                });

                // Ocultar todos los paneles
                panels.forEach(panel => {
                    panel.classList.remove('active');
                });

                // Activar botón seleccionado
                this.classList.add('active');

                // Mostrar panel correspondiente
                const targetPanel = container.querySelector(
                    `[data-tab-content="${tabId}"]`
                );

                if (targetPanel) {
                    targetPanel.classList.add('active');
                }

            });

        });

    });

});


window.crearTablaPaginada = function (
    contenedor,
    lista,
    itemsPorPagina = 10,
    paginaActual = 1
) {

    if (typeof contenedor === "string") {
        contenedor = document.querySelector(contenedor);
    }

    if (!contenedor) {
        console.error("No se ha encontrado el contenedor de la tabla.");
        return;
    }

    if (!Array.isArray(lista)) {
        console.error("La lista proporcionada no es válida.");
        return;
    }

    itemsPorPagina = Math.max(1, Number(itemsPorPagina) || 10);

    let pagina = Math.max(1, Number(paginaActual) || 1);

    contenedor.replaceChildren();

    const tablaContenedor = document.createElement("div");
    tablaContenedor.className = "tabla-paginada";

    const tabla = document.createElement("table");
    tabla.className = "tabla-paginada-datos";

    const cabecera = document.createElement("thead");
    const cuerpo = document.createElement("tbody");

    const controles = document.createElement("div");
    controles.className = "tabla-paginada-controles";

    const informacion = document.createElement("span");
    informacion.className = "tabla-paginada-info";

    const navegacion = document.createElement("div");
    navegacion.className = "tabla-paginada-navegacion";

    const botonAnterior = document.createElement("button");
    botonAnterior.type = "button";
    botonAnterior.className = "paginacion-btn";
    botonAnterior.textContent = "Anterior";

    const botonSiguiente = document.createElement("button");
    botonSiguiente.type = "button";
    botonSiguiente.className = "paginacion-btn";
    botonSiguiente.textContent = "Siguiente";

    navegacion.append(botonAnterior, botonSiguiente);
    controles.append(informacion, navegacion);

    tabla.append(cabecera, cuerpo);
    tablaContenedor.append(tabla, controles);

    contenedor.appendChild(tablaContenedor);

    if (lista.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.className = "estado-vacio";
        mensaje.textContent = "No hay elementos para mostrar.";
        tablaContenedor.replaceChildren(mensaje);
        return;
    }

    // Obtener las columnas a partir del primer objeto.
    const columnas = Object.keys(lista[0]);

    // Crear cabecera.
    const filaCabecera = document.createElement("tr");

    columnas.forEach(columna => {
        const th = document.createElement("th");
        th.textContent = columna;
        filaCabecera.appendChild(th);
    });

    cabecera.appendChild(filaCabecera);

    function representarPagina() {

        const totalPaginas = Math.max(
            1,
            Math.ceil(lista.length / itemsPorPagina)
        );

        pagina = Math.min(pagina, totalPaginas);

        const inicio = (pagina - 1) * itemsPorPagina;
        const elementosPagina = lista.slice(
            inicio,
            inicio + itemsPorPagina
        );

        cuerpo.replaceChildren();

        elementosPagina.forEach(elemento => {

            const fila = document.createElement("tr");

            columnas.forEach(columna => {

                const celda = document.createElement("td");
                const valor = elemento[columna];

                celda.textContent =
                    valor === null || valor === undefined || valor === ""
                        ? "—"
                        : String(valor);

                fila.appendChild(celda);
            });

            cuerpo.appendChild(fila);
        });

        informacion.textContent =
            `Mostrando ${inicio + 1}-${Math.min(
                inicio + itemsPorPagina,
                lista.length
            )} de ${lista.length} elementos · Página ${pagina} de ${totalPaginas}`;

        botonAnterior.disabled = pagina === 1;
        botonSiguiente.disabled = pagina === totalPaginas;
    }

    botonAnterior.addEventListener("click", () => {
        if (pagina > 1) {
            pagina--;
            representarPagina();
        }
    });

    botonSiguiente.addEventListener("click", () => {
        const totalPaginas = Math.ceil(lista.length / itemsPorPagina);

        if (pagina < totalPaginas) {
            pagina++;
            representarPagina();
        }
    });

    representarPagina();
};
