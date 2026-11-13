
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
