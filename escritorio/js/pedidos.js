let pedidos
let numMesas
let pedidosFiltrados

let $busquedaEl
let $mesaEl
let $pedidosEl

document.addEventListener("DOMContentLoaded", async () => {
    pedidos = await obtenerPedidosActivos()
    pedidosFiltrados = pedidos
    numMesas = await obtenerMesas()

    console.log(numMesas)

    $mesaEl = document.querySelector("select[name='num_mesa']")
    new Array(Number(numMesas)).fill(0).forEach((_, i) => {
        $mesaEl.innerHTML += `<option value="${i + 1}">Mesa ${i + 1}</option>`
    })
    
    console.log(pedidos)

    $pedidosEl = document.querySelector(".pedidos-pendientes")
    renderPedidos()
})

const renderPedidos = () => {
    $pedidosEl.innerHTML = ""
    pedidosFiltrados.forEach(pedido => {
        const total = pedido.pedidoPlatos.reduce((acum, pedidoPlato) => acum + pedidoPlato.subtotal, 0)
        const html = `<a href="/escritorio/pedidos/pedido-detalle?id=${pedido.id}" class="pedido">Pedido de: ${pedido.cliente.nombre} | Total: ${total} | Articulos: ${pedido.pedidoPlatos.length}</a>`
        $pedidosEl.innerHTML += html
    })
}

const obtenerPedidosActivos = async () => {
    const res = await fetch("/api/caja/obtener-pedidos-activos")
    const pedidos = await res.json()
    return pedidos
}

const obtenerMesas = async () => {
    const res = await fetch("/api/cliente/obtener-numero-mesas")
    const mesas = await res.text()
    return mesas
}

const filtrarPorMesa = mesa => {
    pedidosFiltrados = pedidos
    
    if (mesa !== "0") {
        pedidosFiltrados = pedidosFiltrados.filter(pedido => 
            pedido.cliente.num_mesa === Number(mesa)
        )
    }
    
    const nombreActual = document.querySelector(".search-input").value
    if (nombreActual) {
        pedidosFiltrados = pedidosFiltrados.filter(pedido => 
            pedido.cliente.nombre.toLowerCase().includes(nombreActual.toLowerCase())
        )
    }
    
    renderPedidos()
}

const filtrarPorNombre = nombre => {
    pedidosFiltrados = pedidos
    
    if (nombre) {
        pedidosFiltrados = pedidosFiltrados.filter(pedido => 
            pedido.cliente.nombre.toLowerCase().includes(nombre.toLowerCase())
        )
    }
    
    const mesaActual = document.querySelector("select[name='num_mesa']").value
    if (mesaActual !== "0") {
        pedidosFiltrados = pedidosFiltrados.filter(pedido => 
            pedido.cliente.num_mesa === Number(mesaActual)
        )
    }
    
    renderPedidos()
}