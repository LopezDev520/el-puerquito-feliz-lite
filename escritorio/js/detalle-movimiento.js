
let pago 

let $nombreCliente
let $numMesa
let $total
let $fecha

document.addEventListener("DOMContentLoaded", async e => {

    pedido = await obtenerPedido()
    console.log(pedido)

    // Establecer el nombre
    $nombreCliente = document.getElementById("nombre-cliente")
    $nombreCliente.textContent = pedido.cliente.nombre

    // Establecer el numero de mesa
    $numMesa = document.getElementById("num-mesa")
    $numMesa.textContent = pedido.cliente.num_mesa

    $total = document.getElementById("total")
    $total.textContent = "$ " + pedido.pago.total

    $fecha = document.getElementById("fecha")
    $fecha.textContent = pedido.fecha

})

async function obtenerPedido () {
    const id = new URL(window.location.href).searchParams.get("pago_id")
    const pago = await fetch(`/api/caja/obtener-pago?pago_id=${id}`)
        .then(res => res.json())
    return pago
}