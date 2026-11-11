window.onload = start;

function start() {
    let velocidadSelect = document.getElementById("velocidad");
    let parrafo = document.getElementById("parrafo");

    let palabrasSpan = document.getElementById("palabras");
    let frasesSpan = document.getElementById("frases");
    let parrafosSpan = document.getElementById("parrafos");
    let calculo = document.getElementById("calculo");

    let copiar = document.getElementById("copiar");
    let tooltip = document.getElementsByClassName("tooltip")[0];

    let palabras = 0;
    let frases = 0;
    let parrafos = 0;

    let velocidad = velocidadSelect.value;

    velocidadSelect.addEventListener("change", () => {
        velocidad = velocidadSelect.value;
        medirTexto();
    })

    parrafo.addEventListener("input", medirTexto)

    function medirTexto() {
        let texto = parrafo.value;

        palabras = texto.trim().split(/\s+/).filter(palabra => palabra.trim() != "" /* Boolean hace lo mismo */).length;
        frases = texto.trim().split(/[.?!]+/).filter(frase => frase.trim() != "" /* Boolean hace lo mismo */).length;
        parrafos = texto.trim().split(/\n\s*\n/).filter(parrafo => parrafo.trim() != "" /* Boolean hace lo mismo */).length;

        palabrasSpan.textContent = palabras;
        frasesSpan.textContent = frases;
        parrafosSpan.textContent = parrafos;

        if(texto == ""){
            calculo.textContent = "Sin texto que medir";
            return;
        }

        let tiempoSegundos = Math.round((palabras / velocidad) * 60);

        let minutos = Math.floor(tiempoSegundos / 60);
        let segundos = tiempoSegundos % 60;

        let metrica = `${minutos} min ${segundos} s`;

        calculo.textContent = metrica;
    }

    copiar.addEventListener("click", (event) => {
        event.preventDefault();

        navigator.clipboard.writeText(calculo.textContent);
    })

    copiar.addEventListener("click", (event) => {
        tooltip.style.display = "block";

        setTimeout(() => {
            tooltip.style.display = "none";
        }, 2000);
    })
}
