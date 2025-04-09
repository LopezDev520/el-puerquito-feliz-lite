
let pedido
let total
let $estadoSelector
let $seccionPago
let $personaPedido
let $elementos
let $totalPago
let $cambioPago

document.addEventListener("DOMContentLoaded", async () => {
    pedido = await obtenerPedido()
    total = calcularTotal()
    console.log(pedido)

    if (!pedido.activado) {
        $seccionPago = document.querySelector(".pago")
        $seccionPago.style["display"] = "none"
    }

    $estadoSelector = document.getElementById("estado")
    $estadoSelector.value = pedido.estado

    $personaPedido = document.getElementById("persona-pedido")
    $personaPedido.textContent = pedido.cliente.nombre

    $elementos = document.querySelector(".elementos")
    
    $totalPago = document.getElementById("total-pago")
    $totalPago.textContent = total

    $cambioPago = document.getElementById("cambio-pago")

    for (let pedidoPlato of pedido.pedidoPlatos) {
        const { plato, cantidad, anotacion } = pedidoPlato
        const html = crearPlatoHtml(plato, cantidad, anotacion)
        $elementos.innerHTML += html
    }


})

const calcularTotal = () => pedido.pedidoPlatos.reduce((acum, pedidoPlato) => acum + pedidoPlato.subtotal, 0)

const crearPlatoHtml = (plato, cantidad, anotacion) => 
    `<div class="elemento">
        <img src="${plato.imagen}"
            alt="${plato.nombre}">
            <div class="informacion">
                <p><strong>${plato.nombre}</strong></p>
                <p>${plato.descripcion}</p>
                <p>$ ${plato.precio}</p>
                <p>x${cantidad}</p>
                <p>${anotacion}</p>
            </div>
    </div>`


const obtenerPedido = async () => {
    const idPedido = obtenerIdPedido()
    const res = await fetch(`/api/caja/obtener-pedido?id=${idPedido}`).then(res => res.json())
    return res
}

const obtenerIdPedido = () => {
    const url = new URL(window.location.href)
    return url.searchParams.get("id")
}

const manejarEntradaPrecio = event => {
    let { value: precioInput } = event.target
    precioInput = Number(precioInput)

    const cambio = precioInput - total
    $cambioPago.textContent = cambio
}

const enviarPago = async event => {
    const formData = new FormData(event.target)
    
    const pedido_id = obtenerIdPedido()
    const form = { pedido_id, ...Object.fromEntries(formData) }

    const res = await fetch("/api/caja/realizar-pago", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
    })

    if (res.ok) {
        const pago = await res.json()
        window.location.href = `/escritorio/pedidos/detalle-movimiento?pago_id=${pago.id}`
    }
}

const cambiarEstadoPedido = async event => {

    const estado = event.target.value

    await fetch(`/api/caja/cambio-estado-pedido?pedido_id=${pedido.id}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado })
    })

}