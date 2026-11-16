
window.onload = start;

function start() {
    let urlInput = document.getElementById("url");
    let tituloInput = document.getElementById("titulo");
    let descripcionInput = document.getElementById("descripcion");
    let nombreInput = document.getElementById("nombre");
    let tipoInput = document.getElementById("tipo");
    let imagenInput = document.getElementById("imagen");

    let linkedinEmbed = document.getElementById("linkedin");
    let facebookEmbed = document.getElementById("facebook");
    let twitterEmbed = document.getElementById("twitter");

    let analizar = document.getElementById("analizar");

    let avisoProporcion = document.getElementById("aviso-proporcion");
    let proporcionDisplay = document.getElementById("proporcion");
    let mensajeProporcion = document.getElementById("mensaje-proporcion");

    let urlImagenPublica = "";

    function copiarTextos() {
        let url = urlInput.value;
        let titulo = tituloInput.value;
        let descripcion = descripcionInput.value;
        let nombre = nombreInput.value;
        let tipo = tipoInput.value;

        copiarAEmbed(linkedinEmbed, url, titulo, descripcion, nombre, tipo);
        copiarAEmbed(facebookEmbed, url, titulo, descripcion, nombre, tipo);
        copiarAEmbed(twitterEmbed, url, titulo, descripcion, nombre, tipo);

        generarCodigo(linkedinEmbed, url, titulo, descripcion, nombre, tipo);
        generarCodigo(facebookEmbed, url, titulo, descripcion, nombre, tipo);
        generarCodigo(twitterEmbed, url, titulo, descripcion, nombre, tipo);
    }

    function copiarAEmbed(embed, url, titulo, descripcion, nombre, tipo) {
        let embedUrl = embed.querySelector(`#embed-domain-${embed.id}`);
        let embedTitulo = embed.querySelector(`#embed-title-${embed.id}`);
        let embedDescripcion = embed.querySelector(`#embed-description-${embed.id}`);
        let embedNombre = embed.querySelector(`#embed-site-name-${embed.id}`);
        let embedTipo = embed.querySelector(`#embed-type-${embed.id}`);

        embedUrl.textContent = url;
        embedTitulo.textContent = titulo;
        embedDescripcion.textContent = descripcion;
        embedNombre.textContent = nombre;
        embedTipo.textContent = tipo;
    }

    function copiarImagen() {
        let archivo = imagenInput.files[0];

        if (!archivo) {
            return;
        }

        if (!archivo.type.startsWith("image/")) {
            alert("Selecciona un archivo de imagen.");
            return;
        }

        let reader = new FileReader();

        reader.onload = function () {
            let urlImagen = reader.result;

            linkedinEmbed.querySelector("#embed-image-linkedin").src = urlImagen;
            facebookEmbed.querySelector("#embed-image-facebook").src = urlImagen;
            twitterEmbed.querySelector("#embed-image-twitter").src = urlImagen;

            let imagen = new Image();

            imagen.onload = function () {
                let proporcion = proporcionImagen(imagen);
                mostrarProporcion(proporcion);
            };

            imagen.onerror = function () {
                alert("No se pudo cargar la imagen.");
            };

            imagen.src = urlImagen;
        };

        reader.onerror = function () {
            alert("No se pudo leer el archivo.");
        };

        reader.readAsDataURL(archivo);
    }

    function proporcionImagen(imagen) {
        let ancho = imagen.naturalWidth;
        let alto = imagen.naturalHeight;

        return ancho / alto;
    }

    function mostrarProporcion(proporcion) {
        if (proporcion < 1.85 || proporcion > 1.96) {
            avisoProporcion.className = "result danger";
            mensajeProporcion.textContent =
                "La proporción no es adecuada. Se recomienda 1200 × 630 px.";
        } else {
            avisoProporcion.className = "result";
            mensajeProporcion.textContent = "La proporción es adecuada.";
        }

        proporcionDisplay.textContent = proporcion.toFixed(2) + ":1";
    }

    function escaparHTML(texto) {
        return String(texto).replace(/[&<>"']/g, caracter => {
            const entidades = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entidades[caracter];
        });
    }

    function generarCodigo(embed, url, titulo, descripcion, nombre, tipo) {
        let codigo = document.getElementById(`codigo-generado-${embed.id}`);

        if (!codigo) return;

        let etiquetas = `
<!-- Open Graph -->
<meta property="og:url" content="${escaparHTML(url)}">
<meta property="og:type" content="${escaparHTML(tipo)}">
<meta property="og:title" content="${escaparHTML(titulo)}">
<meta property="og:description" content="${escaparHTML(descripcion)}">
<meta property="og:image" content="${escaparHTML(urlImagenPublica)}">
<meta property="og:site_name" content="${escaparHTML(nombre)}">
`;

        if (embed.id === "twitter") {
            etiquetas += `
<!-- X / Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escaparHTML(titulo)}">
<meta name="twitter:description" content="${escaparHTML(descripcion)}">
<meta name="twitter:image" content="${escaparHTML(urlImagenPublica)}">
`;
        }

        codigo.textContent = etiquetas.trim();
    }

    function cargarPrevisualizaciones() {
        let tabs = document.getElementById("tabs");

        tabs.style.display = "block";
        avisoProporcion.style.display = "block";

        copiarImagen();
        copiarTextos();
    }

    analizar.addEventListener("click", cargarPrevisualizaciones);
}
