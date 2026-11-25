
let tabActivo =
    document.querySelector(".tabs-nav button.active")?.dataset.tab || "course";

const codigoGenerado = document.getElementById("codigo-generado");
const faqContainer = document.getElementById("lista-faq");
const breadcrumbContainer = document.getElementById("lista-breadcrumb");

// -------------------------
// PESTAÑAS
// -------------------------

document.querySelectorAll(".tabs-nav button[data-tab]").forEach(boton => {
    boton.addEventListener("click", function () {
        tabActivo = this.dataset.tab;
        generarCodigo();
    });
});

// Actualizar el código al modificar los campos
document.getElementById("tabs")?.addEventListener("input", generarCodigo);
document.getElementById("tabs")?.addEventListener("change", generarCodigo);

// -------------------------
// FUNCIONES GENERALES
// -------------------------

function obtenerValor(id) {
    return document.getElementById(id)?.value.trim() || "";
}

function limpiarObjeto(objeto) {
    return Object.fromEntries(
        Object.entries(objeto).filter(([clave, valor]) => {
            if (valor === undefined || valor === null || valor === "") {
                return false;
            }

            if (Array.isArray(valor) && valor.length === 0) {
                return false;
            }

            return true;
        })
    );
}

// -------------------------
// GENERAR CÓDIGO
// -------------------------

function generarCodigo() {
    let datos;

    if (tabActivo === "course") {
        datos = generarCourse();
    } else if (tabActivo === "faq") {
        datos = generarFAQ();
    } else if (tabActivo === "article") {
        datos = generarArticle();
    } else if (tabActivo === "breadcrumb") {
        datos = generarBreadcrumb();
    }

    if (!datos) return;

    const json = JSON.stringify(datos, null, 2);

    codigoGenerado.textContent =
        `<script type="application/ld+json">\n${json}\n<\/script>`;
}

// -------------------------
// COURSE
// -------------------------

function generarCourse() {
    const curso = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: obtenerValor("course-name"),
        description: obtenerValor("course-description"),
        url: obtenerValor("course-url"),
        image: obtenerValor("course-image")
    };

    const proveedor = obtenerValor("course-provider");
    const fechaInicio = obtenerValor("course-start");
    const fechaFin = obtenerValor("course-end");
    const modalidad = obtenerValor("course-mode");

    if (proveedor) {
        curso.provider = {
            "@type": "Organization",
            name: proveedor
        };
    }

    const modalidades = {
        "Presencial": "Onsite",
        "Online": "Online",
        "Semipresencial": "Blended"
    };

    if (fechaInicio || fechaFin || modalidad) {
        curso.hasCourseInstance = limpiarObjeto({
            "@type": "CourseInstance",
            courseMode: modalidades[modalidad] || modalidad,
            startDate: fechaInicio || undefined,
            endDate: fechaFin || undefined
        });
    }

    return limpiarObjeto(curso);
}

// -------------------------
// FAQ
// -------------------------

function generarFAQ() {
    const preguntas = [];

    faqContainer.querySelectorAll(".faq-item").forEach(elemento => {
        const pregunta =
            elemento.querySelector(".faq-question")?.value.trim() || "";

        const respuesta =
            elemento.querySelector(".faq-answer")?.value.trim() || "";

        if (pregunta && respuesta) {
            preguntas.push({
                "@type": "Question",
                name: pregunta,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: respuesta
                }
            });
        }
    });

    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: preguntas
    };
}

// Añadir pregunta
document.getElementById("add-faq")?.addEventListener("click", () => {
    const nuevaFaq = document.createElement("div");
    nuevaFaq.className = "card faq-item";

    const etiquetaPregunta = document.createElement("label");
    etiquetaPregunta.textContent = "Pregunta:";

    const campoPregunta = document.createElement("input");
    campoPregunta.type = "text";
    campoPregunta.className = "faq-question";
    campoPregunta.placeholder = "Escribe la pregunta";

    etiquetaPregunta.appendChild(campoPregunta);

    const etiquetaRespuesta = document.createElement("label");
    etiquetaRespuesta.textContent = "Respuesta:";

    const campoRespuesta = document.createElement("textarea");
    campoRespuesta.className = "faq-answer";
    campoRespuesta.placeholder = "Escribe la respuesta";

    etiquetaRespuesta.appendChild(campoRespuesta);

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "del-faq";
    botonEliminar.textContent = "Eliminar";

    nuevaFaq.append(
        etiquetaPregunta,
        etiquetaRespuesta,
        botonEliminar
    );

    faqContainer.appendChild(nuevaFaq);
    generarCodigo();
});

// Eliminar pregunta
faqContainer.addEventListener("click", evento => {
    if (evento.target.classList.contains("del-faq")) {
        evento.target.closest(".faq-item").remove();
        generarCodigo();
    }
});

// -------------------------
// ARTICLE
// -------------------------

function generarArticle() {
    const articulo = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: obtenerValor("article-headline"),
        description: obtenerValor("article-description"),
        url: obtenerValor("article-url"),
        image: obtenerValor("article-image"),
        datePublished: obtenerValor("article-published"),
        dateModified: obtenerValor("article-modified")
    };

    const autor = obtenerValor("article-author");
    const editor = obtenerValor("article-publisher");

    if (autor) {
        articulo.author = {
            "@type": "Person",
            name: autor
        };
    }

    if (editor) {
        articulo.publisher = {
            "@type": "Organization",
            name: editor
        };
    }

    return limpiarObjeto(articulo);
}

// -------------------------
// BREADCRUMB
// -------------------------

function generarBreadcrumb() {
    const enlaces = [];

    breadcrumbContainer
        .querySelectorAll(".breadcrumb-item")
        .forEach(elemento => {
            const nombre =
                elemento.querySelector(".breadcrumb-name")?.value.trim() || "";

            const url =
                elemento.querySelector(".breadcrumb-url")?.value.trim() || "";

            if (nombre) {
                const posicion = enlaces.length + 1;

                enlaces.push({
                    "@type": "ListItem",
                    position: posicion,
                    name: nombre,
                    ...(url ? { item: url } : {})
                });
            }
        });

    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: enlaces
    };
}

// Añadir enlace
document.getElementById("add-breadcrumb")?.addEventListener("click", () => {
    const nuevoEnlace = document.createElement("div");
    nuevoEnlace.className = "card breadcrumb-item";

    const etiquetaEnlace = document.createElement("label");
    etiquetaEnlace.textContent = "Enlace:";

    const campoNombre = document.createElement("input");
    campoNombre.type = "text";
    campoNombre.className = "breadcrumb-name";
    campoNombre.placeholder = "Nombre del enlace";

    etiquetaEnlace.appendChild(campoNombre);

    const etiquetaUrl = document.createElement("label");
    etiquetaUrl.textContent = "URL:";

    const campoUrl = document.createElement("input");
    campoUrl.type = "url";
    campoUrl.className = "breadcrumb-url";
    campoUrl.placeholder = "https://ejemplo.com";

    etiquetaUrl.appendChild(campoUrl);

    const botonEliminar = document.createElement("button");
    botonEliminar.type = "button";
    botonEliminar.className = "del-breadcrumb";
    botonEliminar.textContent = "Eliminar";

    nuevoEnlace.append(
        etiquetaEnlace,
        etiquetaUrl,
        botonEliminar
    );

    breadcrumbContainer.appendChild(nuevoEnlace);
    generarCodigo();
});

// Eliminar enlace
breadcrumbContainer.addEventListener("click", evento => {
    if (evento.target.classList.contains("del-breadcrumb")) {
        evento.target.closest(".breadcrumb-item").remove();
        generarCodigo();
    }
});

// -------------------------
//  COPIAR CODIGO
// -------------------------

document.getElementById("copiar-codigo")?.addEventListener("click", async () => {
    const codigo = codigoGenerado.textContent;
    navigator.clipboard.writeText(codigo);
});

// -------------------------
// INICIALIZAR
// -------------------------

generarCodigo();
