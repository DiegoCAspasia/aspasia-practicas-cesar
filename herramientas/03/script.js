window.onload = start;

function start() {
    const tituloLongitudDesktop = 580;
    const descripcionLongitudDesktop = 920;
    const tituloLongitudMobile = 580;
    const descripcionLongitudMobile = 720;

    let urlInput = document.getElementById("url");
    let tituloInput = document.getElementById("titulo");
    let descripcionInput = document.getElementById("descripcion");

    let barraTitulo = document.getElementById("barra-titulo");
    let barraDescripcion = document.getElementById("barra-descripcion");

    let desktopPage = document.getElementById("desktop-page");
    let mobilePage = document.getElementById("mobile-page");

    let desktop = true;

    function procesar() {
        let url = urlInput.value;
        let tituloDesktop = tituloInput.value;
        let descripcionDesktop = descripcionInput.value;
        let tituloMobile = tituloInput.value;
        let descripcionMobile = descripcionInput.value;

        let tituloDesktopElipsis = false;
        let descripcionDesktopElipsis = false;
        let tituloMobileElipsis = false;
        let descripcionMobileElipsis = false;

        // Titulo desktop
        while (medirTexto(tituloDesktop) > tituloLongitudDesktop) {
            tituloDesktop = tituloDesktop.slice(0, -1);
            tituloDesktopElipsis = true;
        }
        if (tituloDesktopElipsis) tituloDesktop = `${tituloDesktop} ...`;

        // Titulo mobile
        while (medirTexto(tituloMobile) > tituloLongitudMobile) {
            tituloMobile = tituloMobile.slice(0, -1);
            tituloMobileElipsis = true;
        }
        if (tituloMobileElipsis) tituloMobile = `${tituloMobile} ...`;

        // Descripcion desktop
        while (medirTexto(descripcionDesktop) > descripcionLongitudDesktop) {
            descripcionDesktop = descripcionDesktop.slice(0, -1);
            descripcionDesktopElipsis = true;
        }
        if (descripcionDesktopElipsis) descripcionDesktop = `${descripcionDesktop} ...`;

        // Descripcion mobile
        while (medirTexto(descripcionMobile) > descripcionLongitudMobile) {
            descripcionMobile = descripcionMobile.slice(0, -1);
            descripcionMobileElipsis = true;
        }
        if (descripcionMobileElipsis) descripcionMobile = `${descripcionMobile} ...`;

        setProgressBar(
            desktop ? tituloDesktop : tituloMobile, 
            barraTitulo,
            desktop ? tituloLongitudDesktop : tituloLongitudMobile);
        setProgressBar(
            desktop ? descripcionDesktop : descripcionMobile,
            barraDescripcion, 
            desktop ? descripcionLongitudDesktop : descripcionLongitudMobile);
        setTextsSnippet("google-snippet-desktop", url, tituloDesktop, descripcionDesktop);
        setTextsSnippet("google-snippet-mobile", url, tituloMobile, descripcionMobile);
    }

    function setTextsSnippet(snippetId, url, titulo, descripcion) {
        let snippet = document.getElementById(snippetId);

        let snippetUrl = snippet.querySelector("#snippet-url")
        let snippetTitle = snippet.querySelector("#snippet-title")
        let snippetDescription = snippet.querySelector("#snippet-description")

        snippetUrl.textContent = url;
        snippetTitle.textContent = titulo;
        snippetDescription.textContent = descripcion;
    }

    function setProgressBar(texto, barra, longitud) {
        let longitudTexto = medirTexto(texto);
        let porcentaje = (longitudTexto * 100) / longitud;
        if (porcentaje > 100) porcentaje = 100;

        barra.style.setProperty('--progress', porcentaje)
    }

    function medirTexto(texto) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        ctx.font = '14px Arial';

        return ctx.measureText(texto).width;
    }

    urlInput.addEventListener("input", procesar);
    tituloInput.addEventListener("input", procesar);
    descripcionInput.addEventListener("input", procesar);

    desktopPage.addEventListener("click", () => {
        desktop = true;
        procesar();
    })
    mobilePage.addEventListener("click", () => {
        desktop = false;
        procesar();
    })
}