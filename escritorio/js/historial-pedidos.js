
let pedidos
let $tbody

document.addEventListener("DOMContentLoaded", async e => {

    pedidos = await obtenerPedidos()
    console.log(pedidos)

    $tbody = document.querySelector("tbody")

    pedidos.forEach(pedido => {
        const html = `
            <tr>
                <td>${pedido.fecha}</td>
                <td>${pedido.cliente.nombre}</td>
                <td>${pedido.pago ? pedido.pago.total : "No se ha pagado todavia"}</td>
                <td>${pedido.pago ? pedido.pago.cambio : "No se ha pagado todavia"}</td>
                <td>${pedido.cliente.num_mesa}</td>
                <td><a href="/escritorio/pedidos/pedido-detalle?id=${pedido.id}">Ver pedido</a></td>
            </tr>
        `

        $tbody.innerHTML += html
    })

})

const obtenerPedidos = async () =>
    await fetch("/api/caja/obtener-pedidos")
        .then(res => res.json())
