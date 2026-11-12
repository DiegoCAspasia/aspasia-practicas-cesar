
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

});
