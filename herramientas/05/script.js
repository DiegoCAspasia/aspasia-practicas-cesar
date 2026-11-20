
// ========================================
// REFERENCIAS AL HTML
// ========================================

const listaGenerada = document.getElementById("lista-generada");
const template = document.getElementById("template");

const tituloArticulo = document.getElementById("titulo-articulo");
const generarIndice = document.getElementById("generar-indice");

const paginaGenerada = document.getElementById("pagina-generada");
const codigoGenerado = document.getElementById("codigo-generado");

const erroresValidacion = document.getElementById("errores-validacion");
const copiarCodigo = document.getElementById("copiar-codigo");
const mensajeCopiado = document.getElementById("mensaje-copiado");


// ========================================
// DATOS Y ALMACENAMIENTO
// ========================================

const CLAVE_ALMACENAMIENTO = "constructor-articulos";

let siguienteId = 1;
let elementos = [];


// Cada elemento tiene un identificador,
// un tipo y los campos necesarios para ese tipo.

class ModeloElemento {
    constructor(tipo) {
        this.id = siguienteId++;
        this.tipo = tipo;

        this.texto = "";
        this.url = "";
        this.alt = "";
        this.src = "";
    }
}


// ========================================
// CARGAR BORRADOR
// ========================================

function cargarBorrador() {
    const borrador = localStorage.getItem(CLAVE_ALMACENAMIENTO);

    if (!borrador) return;

    try {
        const datos = JSON.parse(borrador);

        tituloArticulo.value = datos.titulo || "";
        generarIndice.checked = Boolean(datos.generarIndice);

        elementos = Array.isArray(datos.elementos)
            ? datos.elementos
            : [];

        const ids = elementos.map(elemento => Number(elemento.id) || 0);
        siguienteId = Math.max(0, ...ids) + 1;

    } catch (error) {
        console.error("No se pudo cargar el borrador:", error);
        elementos = [];
    }
}


// ========================================
// GUARDAR BORRADOR
// ========================================

function guardarBorrador() {
    const datos = {
        titulo: tituloArticulo.value,
        generarIndice: generarIndice.checked,
        elementos
    };

    localStorage.setItem(
        CLAVE_ALMACENAMIENTO,
        JSON.stringify(datos)
    );
}


// ========================================
// AÑADIR ELEMENTOS
// ========================================

function agregarElemento(tipo) {
    const elemento = new ModeloElemento(tipo);

    elementos.push(elemento);

    guardarBorrador();
    actualizarInterfaz();
}


// Botones principales

document.getElementById("addH2").addEventListener("click", () => {
    agregarElemento("h2");
});

document.getElementById("addH3").addEventListener("click", () => {
    agregarElemento("h3");
});

document.getElementById("addP").addEventListener("click", () => {
    agregarElemento("p");
});

document.getElementById("addUl").addEventListener("click", () => {
    agregarElemento("ul");
});

document.getElementById("addImg").addEventListener("click", () => {
    agregarElemento("img");
});

document.getElementById("addCTA").addEventListener("click", () => {
    agregarElemento("cta");
});


// ========================================
// BUSCAR ELEMENTO POR ID
// ========================================

function buscarElemento(id) {
    return elementos.find(elemento => elemento.id === id);
}


// ========================================
// EDITAR ELEMENTOS
// ========================================

listaGenerada.addEventListener("input", (event) => {
    const campo = event.target.closest("[data-field]");

    if (!campo) return;

    const tarjeta = campo.closest('[data-role="elemento"]');

    if (!tarjeta) return;

    const id = Number(tarjeta.dataset.id);
    const elemento = buscarElemento(id);

    if (!elemento) return;

    const propiedad = campo.dataset.field;

    elemento[propiedad] = campo.value;

    guardarBorrador();
    actualizarResultados();
});


// ========================================
// MOVER, ELIMINAR Y GESTIONAR BLOQUES
// ========================================

listaGenerada.addEventListener("click", (event) => {
    const boton = event.target.closest("[data-action]");

    if (!boton || !listaGenerada.contains(boton)) return;

    const tarjeta = boton.closest('[data-role="elemento"]');

    if (!tarjeta) return;

    const id = Number(tarjeta.dataset.id);
    const indice = elementos.findIndex(elemento => elemento.id === id);

    if (indice === -1) return;

    switch (boton.dataset.action) {

        case "subir":
            if (indice > 0) {
                [elementos[indice - 1], elementos[indice]] =
                    [elementos[indice], elementos[indice - 1]];
            }
            break;

        case "bajar":
            if (indice < elementos.length - 1) {
                [elementos[indice + 1], elementos[indice]] =
                    [elementos[indice], elementos[indice + 1]];
            }
            break;

        case "eliminar":
            elementos.splice(indice, 1);
            break;
    }

    guardarBorrador();
    actualizarInterfaz();
});


// ========================================
// CREAR CAMPOS DE EDICIÓN
// ========================================

function escaparHTML(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, caracter => {
        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return caracteres[caracter];
    });
}


function crearCampos(elemento) {
    const texto = escaparHTML(elemento.texto);
    const url = escaparHTML(elemento.url);
    const src = escaparHTML(elemento.src);
    const alt = escaparHTML(elemento.alt);

    switch (elemento.tipo) {

        case "h2":
            return `
                <label>Texto del H2</label>
                <input
                    type="text"
                    data-field="texto"
                    value="${texto}"
                    placeholder="Escribe el encabezado H2">
            `;

        case "h3":
            return `
                <label>Texto del H3</label>
                <input
                    type="text"
                    data-field="texto"
                    value="${texto}"
                    placeholder="Escribe el encabezado H3">
            `;

        case "p":
            return `
                <label>Texto del párrafo</label>
                <textarea
                    data-field="texto"
                    rows="4"
                    placeholder="Escribe el párrafo">${texto}</textarea>
            `;

        case "ul":
            return `
                <label>Elementos de la lista</label>
                <p>Escribe un elemento por línea.</p>
                <textarea
                    data-field="texto"
                    rows="5"
                    placeholder="Primer elemento&#10;Segundo elemento&#10;Tercer elemento">${texto}</textarea>
            `;

        case "img":
            return `
                <label>Dirección de la imagen</label>
                <input
                    type="text"
                    data-field="src"
                    value="${src}"
                    placeholder="https://...">

                <label>Texto alternativo (alt)</label>
                <input
                    type="text"
                    data-field="alt"
                    value="${alt}"
                    placeholder="Describe la imagen">
            `;

        case "cta":
            return `
                <label>Texto del botón</label>
                <input
                    type="text"
                    data-field="texto"
                    value="${texto}"
                    placeholder="Ej. Descubre nuestros cursos">

                <label>Enlace del botón</label>
                <input
                    type="text"
                    data-field="url"
                    value="${url}"
                    placeholder="https://...">
            `;

        default:
            return "";
    }
}


// ========================================
// DIBUJAR LISTA DE ELEMENTOS
// ========================================

function renderizarElementos() {
    listaGenerada.innerHTML = "";

    elementos.forEach(elemento => {
        const fragmento = template.content.cloneNode(true);

        const tarjeta = fragmento.querySelector(
            '[data-role="elemento"]'
        );

        tarjeta.dataset.id = elemento.id;

        const tipo = tarjeta.querySelector('[data-role="tipo"]');
        const campos = tarjeta.querySelector('[data-role="campos"]');

        const nombres = {
            h2: "Encabezado H2",
            h3: "Encabezado H3",
            p: "Párrafo",
            ul: "Lista",
            img: "Imagen",
            cta: "Llamada a la acción"
        };

        tipo.textContent = nombres[elemento.tipo] || elemento.tipo;
        campos.innerHTML = crearCampos(elemento);

        listaGenerada.appendChild(fragmento);
    });
}


// ========================================
// GENERAR SLUG PARA LOS H2
// ========================================

function generarSlug(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}


// Cada H2 recibe un ID único.
// Si hay dos encabezados iguales,
// se añade un número al segundo.

function obtenerIdsH2() {
    const usados = new Set();
    const ids = new Map();

    elementos
        .filter(elemento => elemento.tipo === "h2")
        .forEach((elemento, indice) => {
            const base = generarSlug(elemento.texto) || `seccion-${indice + 1}`;

            let id = base;
            let contador = 2;

            while (usados.has(id)) {
                id = `${base}-${contador}`;
                contador++;
            }

            usados.add(id);
            ids.set(elemento.id, id);
        });

    return ids;
}


// ========================================
// GENERAR HTML DE LA VISTA PREVIA
// ========================================

function generarHTML() {
    const partes = [];
    const idsH2 = obtenerIdsH2();

    const titulo = escaparHTML(tituloArticulo.value.trim());

    // H1 independiente
    partes.push(`<h1>${titulo}</h1>`);


    // Índice automático
    if (generarIndice.checked) {
        const encabezados = elementos.filter(
            elemento => elemento.tipo === "h2"
        );

        if (encabezados.length > 0) {
            partes.push(`
<nav class="indice" aria-label="Índice del artículo">
    <ul>
        ${encabezados.map(elemento => `
        <li>
            <a href="#${escaparHTML(idsH2.get(elemento.id))}">
                ${escaparHTML(elemento.texto)}
            </a>
        </li>`).join("")}
    </ul>
</nav>`);
        }
    }


    // Resto de bloques
    elementos.forEach(elemento => {
        const texto = escaparHTML(elemento.texto);

        switch (elemento.tipo) {

            case "h2":
                partes.push(
                    `<h2 id="${escaparHTML(idsH2.get(elemento.id))}">${texto}</h2>`
                );
                break;

            case "h3":
                partes.push(`<h3>${texto}</h3>`);
                break;

            case "p":
                partes.push(`<p>${texto}</p>`);
                break;

            case "ul": {
                const items = String(elemento.texto || "")
                    .split("\n")
                    .map(item => item.trim())
                    .filter(item => item !== "");

                partes.push(`
<ul>
    ${items.map(item => `<li>${escaparHTML(item)}</li>`).join("\n    ")}
</ul>`);
                break;
            }

            case "img":
                partes.push(
                    `<img src="${escaparHTML(elemento.src)}" alt="${escaparHTML(elemento.alt)}">`
                );
                break;

            case "cta":
                partes.push(`
<div class="cta">
    <a href="${escaparHTML(elemento.url)}">
        ${texto}
    </a>
</div>`);
                break;
        }
    });

    return partes.join("\n\n");
}


// ========================================
// VALIDACIONES
// ========================================

function validarArticulo() {
    const errores = [];

    // Comprobar H1
    if (!tituloArticulo.value.trim()) {
        errores.push("El título del artículo (H1) es obligatorio.");
    }

    // Comprobar jerarquía de encabezados
    let existeH2 = false;

    elementos.forEach((elemento, indice) => {
        if (elemento.tipo === "h2") {
            existeH2 = true;
        }

        if (elemento.tipo === "h3" && !existeH2) {
            errores.push(
                `El bloque H3 de la posición ${indice + 1} necesita un H2 anterior.`
            );
        }
    });

    // Comprobar texto alternativo de imágenes
    elementos.forEach((elemento, indice) => {
        if (elemento.tipo === "img" && !elemento.alt.trim()) {
            errores.push(
                `La imagen de la posición ${indice + 1} necesita un texto alternativo (alt).`
            );
        }
    });

    return errores;
}


// ========================================
// ACTUALIZAR RESULTADOS
// ========================================

function actualizarResultados() {
    const html = generarHTML();
    const errores = validarArticulo();

    // Vista previa
    paginaGenerada.innerHTML = html;

    // Código HTML visible para copiar
    codigoGenerado.textContent = html;

    // Mostrar errores
    erroresValidacion.innerHTML = "";

    if (errores.length > 0) {
        const listaErrores = document.createElement("ul");

        errores.forEach(error => {
            const li = document.createElement("li");
            li.textContent = error;
            listaErrores.appendChild(li);
        });

        erroresValidacion.appendChild(listaErrores);
    } else {
        erroresValidacion.textContent = "El artículo no presenta errores de validación.";
    }

    // No permitir copiar si hay errores
    copiarCodigo.disabled = errores.length > 0;
}


// ========================================
// ACTUALIZAR TODA LA INTERFAZ
// ========================================

function actualizarInterfaz() {
    renderizarElementos();
    actualizarResultados();
}


// ========================================
// CAMBIOS EN EL H1 Y EL ÍNDICE
// ========================================

tituloArticulo.addEventListener("input", () => {
    guardarBorrador();
    actualizarResultados();
});

generarIndice.addEventListener("change", () => {
    guardarBorrador();
    actualizarResultados();
});


// ========================================
// COPIAR CÓDIGO HTML
// ========================================

copiarCodigo.addEventListener("click", async () => {
    const errores = validarArticulo();

    if (errores.length > 0) {
        actualizarResultados();
        return;
    }

    try {
        await navigator.clipboard.writeText(
            codigoGenerado.textContent
        );

        mensajeCopiado.style.display = "block";

        setTimeout(() => {
            mensajeCopiado.style.display = "none";
        }, 2000);

    } catch (error) {
        console.error("No se pudo copiar el código:", error);
        alert("No se ha podido copiar el código. Comprueba los permisos del navegador.");
    }
});


// ========================================
// INICIAR APLICACIÓN
// ========================================

cargarBorrador();
actualizarInterfaz();
