
import { Utils } from "../../js/utilidades.js";

window.onload = start;

function start() {
    const gridMetrica = document.getElementById("grid-metrica");
    const cuerpoTabla = document.getElementById("tabla-cuerpo");
    const keywordsTextArea = document.getElementById("keywords");
    const textoInput = document.getElementById("parrafo");
    const numeroPalabrasInput = document.getElementById("numero-palabras");
    const analizarBoton = document.getElementById("analizar");

    let frecuenciaKeywords = new Map();
    let frecuencia = new Map();

    function updateKeywords() {
        return keywordsTextArea.value
            .split(",")
            .map(keyword => Utils.normalizarTexto(keyword.trim()))
            .filter(keyword => keyword !== "");
    }

    function calcularFrecuenciaKeywords(texto, keywords) {
        frecuenciaKeywords = new Map();

        keywords.forEach(keyword => {
            frecuenciaKeywords.set(
                keyword,
                texto.split(keyword).length - 1
            );
        });
    }

    function calcularFrecuenciaNgramas(texto, n) {
        frecuencia = new Map();

        const palabras = texto.match(/\b[\p{L}\p{N}]+\b/gu) || [];

        for (let i = 0; i <= palabras.length - n; i++) {
            const conjunto = palabras.slice(i, i + n).join(" ");

            frecuencia.set(
                conjunto,
                (frecuencia.get(conjunto) || 0) + 1
            );
        }
    }

    function pintarMetricas(keywords) {
        gridMetrica.innerHTML = "";

        keywords.forEach(keyword => {
            const metricCard = document.createElement("div");
            metricCard.className = "metric-card";

            const span = document.createElement("span");
            span.textContent = keyword;

            const strong = document.createElement("strong");
            strong.textContent = frecuenciaKeywords.get(keyword);

            metricCard.append(span, strong);
            gridMetrica.append(metricCard);
        });
    }

    function pintarTabla() {
        cuerpoTabla.innerHTML = "";

        const totalNgramas = [...frecuencia.values()]
            .reduce((a, b) => a + b, 0);

        const arrayFrecuencias = [...frecuencia.entries()]
            .sort((a, b) => b[1] - a[1]);

        arrayFrecuencias.slice(0, 20).forEach(([key, value]) => {
            const tr = document.createElement("tr");

            const conjunto = document.createElement("td");
            conjunto.textContent = key;

            const cantidad = document.createElement("td");
            cantidad.textContent = value;

            const porcentaje = document.createElement("td");
            porcentaje.textContent = totalNgramas
                ? `${((value / totalNgramas) * 100).toFixed(2)}%`
                : "0%";

            tr.append(conjunto, cantidad, porcentaje);
            cuerpoTabla.append(tr);
        });
    }

    function analizar() {
        const texto = Utils.normalizarTexto(textoInput.value);
        const keywords = updateKeywords();
        const numeroPalabras = Math.max(
            1,
            Math.floor(Number(numeroPalabrasInput.value) || 1)
        );

        calcularFrecuenciaKeywords(texto, keywords);
        calcularFrecuenciaNgramas(texto, numeroPalabras);
        pintarMetricas(keywords);
        pintarTabla();
    }

    analizarBoton.addEventListener("click", analizar);
}
