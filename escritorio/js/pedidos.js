let pedidos

let $busquedaEl
let $mesasEl
let $pedidosEl

document.addEventListener("DOMContentLoaded", async () => {
    pedidos = await fetch("/api/caja/obtener-pedidos-activos").then(res => res.json())
    
    console.log(pedidos)

    $pedidosEl = document.querySelector(".pedidos-pendientes")
    pedidos.forEach(pedido => {
        const total = pedido.pedidoPlatos.reduce((acum, pedidoPlato) => acum + pedidoPlato.subtotal, 0)
        const html = `<a href="/escritorio/pedidos/pedido-detalle?id=${pedido.id}" class="pedido">Pedido de: ${pedido.cliente.nombre} | Total: ${total} | Articulos: ${pedido.pedidoPlatos.length}</a>`
        $pedidosEl.innerHTML += html

        // TODO: Quedé en pedidos detalle
    })
})
