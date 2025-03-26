let $clientesDelDia
let $gananciasDelDia
let $clientesEnElLugar
let $pedidosPagados

let datosPanel

document.addEventListener("DOMContentLoaded", async () => {

    $clientesDelDia = document.getElementById("clientes-del-dia")
    $gananciasDelDia = document.getElementById("ganancias-del-dia")
    $clientesEnElLugar = document.getElementById("clientes-en-el-lugar")
    $pedidosPagados = document.getElementById("pedidos-pagados")

    datosPanel = await obtenerDatosPanel()

    console.log(datosPanel)

    $clientesDelDia.querySelector("h3").textContent = datosPanel.clientesDelDia

    if (datosPanel.ventaDelDia) $gananciasDelDia.querySelector("#total").textContent = datosPanel.ventaDelDia
    else $gananciasDelDia.querySelector("#total").textContent = "------"

    if (datosPanel.ventaDelDia) $gananciasDelDia.querySelector("#dinero-en-caja").textContent = datosPanel.dineroEnCaja
    else $gananciasDelDia.querySelector("#dinero-en-caja").textContent = "------"

    $clientesEnElLugar.querySelector("h3").textContent = datosPanel.clientesEnLugar
    $pedidosPagados.querySelector("h3").textContent = datosPanel.pedidosPagados


    renderizarPlatosVendidos(datosPanel.platosVendidos)
})

const obtenerDatosPanel = async () =>
    await fetch("/api/caja/obtener-datos-panel")
        .then(res => res.json())

const renderizarPlatosVendidos = (platos) => {
    const $mejorVendidos = document.getElementById("mejor-vendidos")
    $mejorVendidos.innerHTML = "" // Limpiar contenido existente

    platos.forEach(item => {
        const platoHTML = `
            <section class="mejor-vendido">
                <div class="product-card">
                    <img src="${item.plato.imagen}" alt="${item.plato.nombre}">
                    <div class="product-info">
                        <h3>${item.plato.nombre}</h3>
                        <p>${item.plato.descripcion}</p>
                        <p>$${item.plato.precio}</p>
                        <p><strong>x${item.cantidad}</strong></p>
                    </div>
                </div>
            </section>
        `
        $mejorVendidos.innerHTML += platoHTML
    })
}