document.addEventListener("DOMContentLoaded", function () {
    function actualizarTotal() {
        let total = 0;
        document.querySelectorAll(".sumar_restar").forEach((seccion) => {
            const cantidad = parseInt(seccion.querySelector("span").textContent);
            const precioTexto = seccion.closest(".hamburguesa, .bebida").querySelector(".informacion p:nth-child(3)").textContent;
            const precio = parseInt(precioTexto.replace("$", "").replace(".", ""));
            total += cantidad * precio;
        });
        document.querySelector(".total").textContent = `Total a pagar: $${total.toLocaleString()}`;
    }

    document.querySelectorAll(".sumar_restar").forEach((seccion) => {
        const btnMenos = seccion.querySelector("button:first-child");
        const cantidadSpan = seccion.querySelector("span");
        const btnMas = seccion.querySelector("button:last-child");

        btnMas.addEventListener("click", function () {
            let cantidad = parseInt(cantidadSpan.textContent);
            cantidadSpan.textContent = cantidad + 1;
            actualizarTotal();
        });

        btnMenos.addEventListener("click", function () {
            let cantidad = parseInt(cantidadSpan.textContent);
            if (cantidad > 0) {
                cantidadSpan.textContent = cantidad - 1;
                actualizarTotal();
            }
        });
    });

    actualizarTotal(); // Asegurar que el total se calcule al inicio
});