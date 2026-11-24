
/* =========================================
   AUDITOR ON-PAGE DE CÓDIGO HTML
========================================= */


/* =========================================
   1. REFERENCIAS AL HTML
========================================= */

const botonAnalizar = document.querySelector("#analizar");
const botonLimpiar = document.querySelector("#limpiar");

const campoDominio = document.querySelector("#dominio");
const campoCodigo = document.querySelector("#codigo-html");

const panelResultados = document.querySelector("#panel-resultados");
const resumenInforme = document.querySelector("#resumen-informe");
const mensajeFormulario = document.querySelector("#mensaje-formulario");

const resultadoMetadatos = document.querySelector("#resultado-metadatos");
const resultadoEncabezados = document.querySelector("#resultado-encabezados");
const resultadoImagenes = document.querySelector("#resultado-imagenes");
const resultadoEnlaces = document.querySelector("#resultado-enlaces");
const resultadoHreflang = document.querySelector("#resultado-hreflang");

const resumenImagenes = document.querySelector("#resumen-imagenes");
const resumenEnlaces = document.querySelector("#resumen-enlaces");

const tablaImagenes = document.querySelector("#tabla-imagenes");
const tablaEnlaces = document.querySelector("#tabla-enlaces");


/* =========================================
   2. COMPROBACIÓN DE ELEMENTOS
========================================= */

const elementosNecesarios = [
    botonAnalizar,
    botonLimpiar,
    campoDominio,
    campoCodigo,
    panelResultados,
    resumenInforme,
    mensajeFormulario,
    resultadoMetadatos,
    resultadoEncabezados,
    resultadoImagenes,
    resultadoEnlaces,
    resultadoHreflang,
    resumenImagenes,
    resumenEnlaces,
    tablaImagenes,
    tablaEnlaces
];

if (elementosNecesarios.some(elemento => !elemento)) {
    console.error(
        "No se han encontrado todos los elementos necesarios del index.html."
    );
}


/* =========================================
   3. EVENTOS
========================================= */

botonAnalizar.addEventListener("click", analizarHTML);
botonLimpiar.addEventListener("click", limpiarFormulario);


/* =========================================
   4. FUNCIONES GENERALES
========================================= */

/**
 * Normaliza y valida la URL introducida.
 */
function obtenerURL(valor) {

    let direccion = valor.trim();

    if (!direccion) {
        throw new Error("Introduce la URL de la página que quieres analizar.");
    }

    if (!/^https?:\/\//i.test(direccion)) {
        direccion = `https://${direccion}`;
    }

    let url;

    try {
        url = new URL(direccion);
    } catch {
        throw new Error("La URL introducida no es válida.");
    }

    if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("La URL debe utilizar HTTP o HTTPS.");
    }

    return url;
}


/**
 * Crea un indicador visual.
 *
 * Estados: verde, naranja y rojo.
 */
function crearIndicador(titulo, valor, detalle, estado = "verde") {

    const fila = document.createElement("div");
    fila.className = "fila-indicador";

    const indicador = document.createElement("span");
    indicador.className = `indicador ${estado}`;

    const contenido = document.createElement("div");
    contenido.className = "texto-indicador";

    const tituloElemento = document.createElement("strong");
    tituloElemento.textContent = titulo;

    const valorElemento = document.createElement("div");
    valorElemento.className = "valor-dato";
    valorElemento.textContent = valor;

    contenido.append(tituloElemento, valorElemento);

    if (detalle) {
        const detalleElemento = document.createElement("small");
        detalleElemento.className = "detalle-dato";
        detalleElemento.textContent = detalle;

        contenido.appendChild(detalleElemento);
    }

    fila.append(indicador, contenido);

    return fila;
}


/**
 * Crea una tarjeta de recuento.
 */
function crearTarjetaResumen(titulo, cantidad) {

    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-resumen";

    const nombre = document.createElement("span");
    nombre.className = "tarjeta-resumen-titulo";
    nombre.textContent = titulo;

    const valor = document.createElement("strong");
    valor.className = "tarjeta-resumen-valor";
    valor.textContent = cantidad;

    tarjeta.append(nombre, valor);

    return tarjeta;
}


/**
 * Crea un mensaje de ausencia de resultados.
 */
function crearMensajeVacio(texto) {

    const mensaje = document.createElement("p");
    mensaje.className = "estado-vacio";
    mensaje.textContent = texto;

    return mensaje;
}


/**
 * Comprueba si un enlace pertenece al dominio analizado.
 *
 * También considera internos los subdominios.
 */
function esEnlaceInterno(urlEnlace, urlDominio) {

    const hostname = urlEnlace.hostname
        .toLowerCase()
        .replace(/^www\./, "");

    const dominioBase = urlDominio.hostname
        .toLowerCase()
        .replace(/^www\./, "");

    return (
        hostname === dominioBase ||
        hostname.endsWith(`.${dominioBase}`)
    );
}


/**
 * Cuenta los caracteres de un texto.
 */
function contarCaracteres(texto) {
    return texto.trim().length;
}


/**
 * Añade un elemento a una lista.
 */
function crearElementoLista(texto, clase = "") {

    const elemento = document.createElement("li");
    elemento.textContent = texto;

    if (clase) {
        elemento.className = clase;
    }

    return elemento;
}


/* =========================================
   5. ANÁLISIS PRINCIPAL
========================================= */

function analizarHTML() {

    limpiarMensaje();

    const codigo = campoCodigo.value.trim();

    if (!codigo) {
        mostrarMensaje(
            "Pega el código HTML que deseas analizar.",
            "error"
        );
        return;
    }

    let urlDominio;

    try {
        urlDominio = obtenerURL(campoDominio.value);
    } catch (error) {
        mostrarMensaje(error.message, "error");
        return;
    }

    try {

        // Convertir el HTML en un documento analizable.
        const parser = new DOMParser();

        const documento = parser.parseFromString(
            codigo,
            "text/html"
        );

        // Limpiar resultados anteriores.
        limpiarResultados();

        // Ejecutar los análisis.
        analizarMetadatos(documento, urlDominio);
        analizarEncabezados(documento);
        analizarImagenes(documento);
        analizarEnlaces(documento, urlDominio);
        analizarHreflang(documento);

        // Mostrar el informe.
        panelResultados.hidden = false;

        mostrarMensaje(
            "Análisis completado correctamente.",
            "exito"
        );

        panelResultados.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    } catch (error) {

        console.error("Error durante el análisis:", error);

        mostrarMensaje(
            `No se ha podido completar el análisis: ${error.message}`,
            "error"
        );
    }
}


/* =========================================
   6. METADATOS E INDEXACIÓN
========================================= */

function analizarMetadatos(documento, urlDominio) {

    // TITLE
    const title = documento.querySelector("title");

    const textoTitle = title?.textContent.trim() || "";

    let estadoTitle = "verde";

    if (!textoTitle) {
        estadoTitle = "rojo";
    } else if (
        textoTitle.length < 30 ||
        textoTitle.length > 60
    ) {
        estadoTitle = "naranja";
    }

    resultadoMetadatos.appendChild(
        crearIndicador(
            "Etiqueta title",
            textoTitle || "No se ha encontrado la etiqueta title.",
            `${contarCaracteres(textoTitle)} caracteres. Como referencia orientativa, suele recomendarse una longitud aproximada de 50-60 caracteres.`,
            estadoTitle
        )
    );


    // META DESCRIPTION
    const description = documento.querySelector(
        'meta[name="description" i]'
    );

    const textoDescription =
        description?.getAttribute("content")?.trim() || "";

    let estadoDescription = "verde";

    if (!description || !textoDescription) {
        estadoDescription = "rojo";
    } else if (
        textoDescription.length < 70 ||
        textoDescription.length > 160
    ) {
        estadoDescription = "naranja";
    }

    resultadoMetadatos.appendChild(
        crearIndicador(
            "Meta description",
            textoDescription || "No se ha encontrado una meta description con contenido.",
            `${contarCaracteres(textoDescription)} caracteres. La longitud orientativa suele situarse entre 120 y 160 caracteres.`,
            estadoDescription
        )
    );


    // META ROBOTS
    const robots = documento.querySelector(
        'meta[name="robots" i]'
    );

    const contenidoRobots =
        robots?.getAttribute("content")?.trim() || "";

    const directivasRobots = contenidoRobots
        .toLowerCase()
        .split(",")
        .map(directiva => directiva.trim());

    let estadoRobots = "naranja";
    let textoRobots;

    if (
        directivasRobots.includes("noindex") ||
        directivasRobots.includes("none")
    ) {
        estadoRobots = "rojo";
        textoRobots =
            `La página contiene una directiva que impide la indexación: ${contenidoRobots}`;

    } else if (robots) {
        estadoRobots = "verde";
        textoRobots =
            contenidoRobots || "Etiqueta robots sin directivas explícitas.";

    } else {
        textoRobots =
            "No se ha encontrado una etiqueta meta robots. Se aplican los valores predeterminados de los buscadores.";
    }

    resultadoMetadatos.appendChild(
        crearIndicador(
            "Meta robots",
            textoRobots,
            "Este análisis no comprueba las cabeceras HTTP X-Robots-Tag.",
            estadoRobots
        )
    );


    // CANONICAL
    const canonical = documento.querySelector(
        'link[rel~="canonical" i]'
    );

    let estadoCanonical = "naranja";
    let textoCanonical = "No se ha encontrado una etiqueta canonical.";
    let detalleCanonical = "";

    if (canonical) {

        const href = canonical.getAttribute("href")?.trim() || "";

        if (href) {

            try {

                const urlCanonical = new URL(href, urlDominio);

                if (["http:", "https:"].includes(urlCanonical.protocol)) {
                    textoCanonical = urlCanonical.href;
                    detalleCanonical = "URL canonical detectada.";
                    estadoCanonical = "verde";
                } else {
                    textoCanonical = "La URL canonical no utiliza HTTP o HTTPS.";
                    estadoCanonical = "rojo";
                }

            } catch {
                textoCanonical = "La URL canonical no es válida.";
                estadoCanonical = "rojo";
            }

        } else {
            textoCanonical = "La etiqueta canonical no tiene atributo href.";
            estadoCanonical = "rojo";
        }
    }

    resultadoMetadatos.appendChild(
        crearIndicador(
            "URL canonical",
            textoCanonical,
            detalleCanonical,
            estadoCanonical
        )
    );


    // RESUMEN DE METADATOS
    const estados = [
        estadoTitle,
        estadoDescription,
        estadoRobots,
        estadoCanonical
    ];

    const correctos = estados.filter(
        estado => estado === "verde"
    ).length;

    const avisos = estados.filter(
        estado => estado === "naranja"
    ).length;

    const errores = estados.filter(
        estado => estado === "rojo"
    ).length;

    resumenInforme.textContent =
        `${correctos} correctos · ${avisos} avisos · ${errores} errores en metadatos`;
}


/* =========================================
   7. ESTRUCTURA DE ENCABEZADOS
========================================= */

function analizarEncabezados(documento) {

    const encabezados = documento.querySelectorAll(
        "h1, h2, h3, h4, h5, h6"
    );

    const totalH1 = documento.querySelectorAll("h1").length;

    let estadoH1 = "verde";
    let textoH1 = `${totalH1} etiquetas H1 encontradas.`;

    if (totalH1 === 0) {
        estadoH1 = "rojo";
        textoH1 = "No se ha encontrado ninguna etiqueta H1.";
    } else if (totalH1 > 1) {
        estadoH1 = "naranja";
        textoH1 = `Se han encontrado ${totalH1} etiquetas H1.`;
    }

    resultadoEncabezados.appendChild(
        crearIndicador(
            "Número de encabezados H1",
            textoH1,
            "Como recomendación estructural, suele utilizarse un H1 principal. Tener varios H1 no supone necesariamente una penalización.",
            estadoH1
        )
    );

    if (encabezados.length === 0) {

        resultadoEncabezados.appendChild(
            crearMensajeVacio(
                "No se han encontrado encabezados H1-H6."
            )
        );

        return;
    }

    const lista = document.createElement("ul");
    lista.className = "arbol-encabezados";

    let nivelAnterior = 0;
    let haySaltos = false;

    encabezados.forEach(encabezado => {

        const nivel = Number(
            encabezado.tagName.substring(1)
        );

        const texto = encabezado.textContent.trim() || "(Sin texto)";

        const elemento = document.createElement("li");
        elemento.className = `nivel-${nivel}`;

        const etiqueta = document.createElement("span");
        etiqueta.className = "etiqueta-nivel";
        etiqueta.textContent = encabezado.tagName;

        const contenido = document.createElement("span");
        contenido.textContent = ` ${texto}`;

        elemento.append(etiqueta, contenido);

        lista.appendChild(elemento);

        if (
            nivelAnterior > 0 &&
            nivel > nivelAnterior + 1
        ) {
            haySaltos = true;
        }

        nivelAnterior = nivel;
    });

    resultadoEncabezados.appendChild(lista);

    if (haySaltos) {

        resultadoEncabezados.appendChild(
            crearIndicador(
                "Jerarquía de encabezados",
                "Se han detectado saltos de nivel.",
                "Revisa que la estructura de encabezados sea lógica y ordenada.",
                "naranja"
            )
        );

    } else {

        resultadoEncabezados.appendChild(
            crearIndicador(
                "Jerarquía de encabezados",
                "No se han detectado saltos de nivel.",
                "Comprueba que los encabezados describan correctamente la estructura del contenido.",
                "verde"
            )
        );
    }
}


/* =========================================
   8. IMÁGENES Y ATRIBUTOS ALT
========================================= */

function analizarImagenes(documento) {

    const imagenes = documento.querySelectorAll("img");

    let conAlt = 0;
    let sinAlt = 0;
    let altVacio = 0;

    const listaImagenes = [];

    imagenes.forEach((imagen, indice) => {

        const tieneAlt = imagen.hasAttribute("alt");

        const alt = imagen.getAttribute("alt") || "";

        const src =
            imagen.getAttribute("src") ||
            imagen.getAttribute("data-src") ||
            imagen.getAttribute("srcset") ||
            "(Sin dirección identificable)";

        let estadoAlt;

        if (!tieneAlt) {
            sinAlt++;
            estadoAlt = "Sin atributo alt";

        } else if (alt.trim() === "") {
            altVacio++;
            estadoAlt = "Alt vacío";

        } else {
            conAlt++;
            estadoAlt = "Con alt";
        }

        listaImagenes.push({
            "N.º": indice + 1,
            "Imagen": src,
            "Texto ALT": alt.trim() || "—",
            "Estado ALT": estadoAlt
        });
    });


    // COMPROBAR CONTENEDORES
    if (!resumenImagenes || !tablaImagenes) {
        throw new Error(
            "Faltan los contenedores resumen-imagenes o tabla-imagenes en el index.html."
        );
    }


    // TARJETAS DE RECUENTO
    resumenImagenes.replaceChildren();

    resumenImagenes.append(
        crearTarjetaResumen("Total de imágenes", imagenes.length),
        crearTarjetaResumen("Con texto ALT", conAlt),
        crearTarjetaResumen("Sin atributo ALT", sinAlt),
        crearTarjetaResumen("ALT vacío", altVacio)
    );


    // TABLA PAGINADA
    if (typeof window.crearTablaPaginada !== "function") {
        throw new Error(
            "No se encuentra crearTablaPaginada(). Comprueba que está definida en base.js."
        );
    }

    window.crearTablaPaginada(
        tablaImagenes,
        listaImagenes,
        10,
        1
    );
}


/* =========================================
   9. ENLACES INTERNOS Y EXTERNOS
========================================= */

function analizarEnlaces(documento, urlDominio) {

    const enlaces = documento.querySelectorAll("a[href]");

    let internos = 0;
    let externos = 0;
    let normales = 0;
    let nofollow = 0;
    let otros = 0;

    const listaEnlaces = [];

    enlaces.forEach((enlace, indice) => {

        const href = enlace.getAttribute("href").trim();

        const texto =
            enlace.textContent.trim() ||
            enlace.getAttribute("aria-label") ||
            "(Sin texto)";

        const rel = (enlace.getAttribute("rel") || "")
            .toLowerCase()
            .split(/\s+/)
            .filter(Boolean);

        const esNofollow = rel.includes("nofollow");

        if (esNofollow) {
            nofollow++;
        } else {
            normales++;
        }

        let urlEnlace;
        let tipoEnlace;

        try {

            urlEnlace = new URL(href, urlDominio);

            if (!["http:", "https:"].includes(urlEnlace.protocol)) {

                tipoEnlace = "Otro protocolo";
                otros++;

            } else if (
                esEnlaceInterno(urlEnlace, urlDominio)
            ) {

                tipoEnlace = "Interno";
                internos++;

            } else {

                tipoEnlace = "Externo";
                externos++;
            }

        } catch {

            tipoEnlace = "URL no válida";
            otros++;
        }

        listaEnlaces.push({
            "N.º": indice + 1,
            "Texto": texto,
            "Destino": urlEnlace ? urlEnlace.href : href,
            "Tipo": tipoEnlace,
            "Seguimiento": esNofollow ? "nofollow" : "Normal",
            "Rel": rel.join(" ") || "—"
        });
    });


    // COMPROBAR CONTENEDORES
    if (!resumenEnlaces || !tablaEnlaces) {
        throw new Error(
            "Faltan los contenedores resumen-enlaces o tabla-enlaces en el index.html."
        );
    }


    // TARJETAS DE RECUENTO
    resumenEnlaces.replaceChildren();

    resumenEnlaces.append(
        crearTarjetaResumen("Total de enlaces", enlaces.length),
        crearTarjetaResumen("Enlaces normales", normales),
        crearTarjetaResumen("Enlaces nofollow", nofollow),
        crearTarjetaResumen("Enlaces internos", internos),
        crearTarjetaResumen("Enlaces externos", externos),
        crearTarjetaResumen("Otros enlaces", otros)
    );


    // TABLA PAGINADA
    if (typeof window.crearTablaPaginada !== "function") {
        throw new Error(
            "No se encuentra crearTablaPaginada(). Comprueba que está definida en base.js."
        );
    }

    window.crearTablaPaginada(
        tablaEnlaces,
        listaEnlaces,
        10,
        1
    );
}


/* =========================================
   10. ETIQUETAS HREFLANG
========================================= */

function analizarHreflang(documento) {

    const etiquetas = documento.querySelectorAll(
        'link[rel~="alternate" i][hreflang]'
    );

    const lista = document.createElement("ul");
    lista.className = "lista-recursos";

    let validas = 0;
    let incompletas = 0;

    etiquetas.forEach((etiqueta, indice) => {

        const idioma =
            etiqueta.getAttribute("hreflang")?.trim() || "";

        const href =
            etiqueta.getAttribute("href")?.trim() || "";

        if (idioma && href) {

            validas++;

            lista.appendChild(
                crearElementoLista(
                    `${idioma} → ${href}`
                )
            );

        } else {

            incompletas++;

            lista.appendChild(
                crearElementoLista(
                    `Etiqueta ${indice + 1}: falta el idioma o la URL.`,
                    "recurso-alerta"
                )
            );
        }
    });


    let estado = "verde";
    let texto = `${validas} etiquetas hreflang completas.`;

    if (etiquetas.length === 0) {

        estado = "naranja";
        texto = "No se han encontrado etiquetas hreflang.";

    } else if (incompletas > 0) {

        estado = "rojo";
        texto = `${incompletas} etiquetas hreflang incompletas.`;
    }

    resultadoHreflang.appendChild(
        crearIndicador(
            "Etiquetas hreflang",
            texto,
            "Se comprueba la presencia de los atributos hreflang y href. No se comprueba la reciprocidad entre páginas.",
            estado
        )
    );

    if (etiquetas.length > 0) {

        resultadoHreflang.appendChild(lista);

    } else {

        resultadoHreflang.appendChild(
            crearMensajeVacio(
                "No hay etiquetas hreflang declaradas en el código HTML."
            )
        );
    }
}


/* =========================================
   11. LIMPIEZA DEL INFORME
========================================= */

function limpiarResultados() {

    resultadoMetadatos.replaceChildren();
    resultadoEncabezados.replaceChildren();

    // Se conservan los contenedores del HTML.
    resumenImagenes.replaceChildren();
    tablaImagenes.replaceChildren();

    resumenEnlaces.replaceChildren();
    tablaEnlaces.replaceChildren();

    resultadoHreflang.replaceChildren();

    resumenInforme.textContent = "";
}


/* =========================================
   12. MENSAJES
========================================= */

function limpiarMensaje() {

    mensajeFormulario.textContent = "";
    mensajeFormulario.className = "mensaje-formulario";
}


function mostrarMensaje(texto, tipo) {

    mensajeFormulario.textContent = texto;
    mensajeFormulario.className =
        `mensaje-formulario ${tipo}`;
}


/* =========================================
   13. LIMPIAR FORMULARIO
========================================= */

function limpiarFormulario() {

    campoDominio.value = "";
    campoCodigo.value = "";

    limpiarResultados();
    limpiarMensaje();

    panelResultados.hidden = true;

    campoDominio.focus();
}
