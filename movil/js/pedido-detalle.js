
let pedido

/* Elementos HTML  */
let $listaItems
let $estadoPedido

socket.on("estado-cambiado", estado => mostrarEstadoPedido(estado))

document.addEventListener("DOMContentLoaded", async () => {

    pedido = await obtenerPedido()
    $listaItems = document.getElementById("lista-items")
    $estadoPedido = document.getElementById("estado")

    mostrarEstadoPedido(pedido.estado)

    /* Renderizar los items (platos o bebidas) en el pedido  */
    pedido.pedidoPlatos.forEach(({ plato, cantidad, anotacion }) => {
        const subtotal = plato.precio * cantidad
        const html = `
            <div class="item">
                <div class="image-container">
                    <img src="${plato.imagen}" alt="${plato.nombre}" />
                </div>
                <div class="info-container">
                    <h4>${plato.nombre}</h4>
                    <p>${plato.descripcion}</p>
                    <p>$ ${subtotal}</p>
                    <p>Unidad: $${plato.precio}</p>
                    <p>x${cantidad}</p>
                    <p>${anotacion}</p>
                </div>
            </div>
        `

        $listaItems.innerHTML += html 
    })
    
})

const mostrarEstadoPedido = estado => {
    /* Mostrar el estado del pedido (Pendiente, En Preparacion o Entregado) */
    $estadoPedido.className = "estado"
    if (estado === "Pendiente") {
        $estadoPedido.classList.add("pendiente")
        $estadoPedido.textContent = "Pendiente"
    } else if (estado == "En preparación") {
        $estadoPedido.classList.add("en-preparacion")
        $estadoPedido.textContent = "En Preparación"
    } else if (estado == "Entregado") {
        $estadoPedido.classList.add("entregado")
        $estadoPedido.textContent = "Entregado"
    }
}

const obtenerPedido = async () => {
    const pedidoId = localStorage.getItem("pedido_id")

    const pedido = await fetch(`/api/caja/obtener-pedido?id=${pedidoId}`)
        .then(res => res.json())

    return pedido;
}