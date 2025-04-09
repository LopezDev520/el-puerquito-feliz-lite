let pedido = []
let menu

document.addEventListener("DOMContentLoaded", async function () {
    const $menu = document.querySelector(".contenedor_menu")
    menu = await obtenerMenu()

    menu.forEach(categoria => {
        const html = `<h2>${categoria.nombre}</h2>`
        const platos = categoria.platos.map(plato => renderizarPlato(plato, categoria.nombre === "Bebidas"))

        $menu.innerHTML += `${html}${platos}`
    })

    // Inhabilitar Mi pedido en caso de que no se haya hecho pedido todavia
    const pedido_id = window.localStorage.getItem("pedido_id")
    if (!pedido_id) {
        const $link = document.getElementById("link-mi-pedido")
        $link.onclick = () => alert("No haz hecho ningun pedido")
        $link.href = "#"
    }
});

const renderizarPlato = (plato, esBebida) => `
    <div class="seccion_plato">
        <div class="${esBebida ? "bebida" : "hamburguesa"}">
            <img src="${plato.imagen}" alt="${plato.nombre}" />
            <div class="informacion">
                <p><strong>${plato.nombre}</strong></p>
                <p>${plato.descripcion}</p>
                <p>$${plato.precio}</p>
            </div>

            <div class="sumar_restar">
                <button onclick="removeToPedido(${plato.id}, event)">-</button>
                <span class="cantidad">0</span>
                <button onclick="addToPedido(${plato.id}, event)">+</button>
            </div>
        </div>
        ${!esBebida ? `<input disabled class="anotacion" type="text" placeholder="Anotaciones..." oninput="addAnotaciones(${plato.id},event)" />` : ""}
    </div>
`

const encontrarPlato = idPlato => {
    for (let categoria of menu) {
        for (let plato of categoria.platos) {
            if (plato.id == idPlato) return plato
        }
    }
}

const addToPedido = (idPlato, event) => {
    let platoEnPedido = pedido.find(pedidoPlato => pedidoPlato.plato_id == idPlato)

    const seccionPlato = event.target.parentElement.parentElement.parentElement

    if (!platoEnPedido) {
        const anotacionInput = seccionPlato.querySelector(".anotacion")

        const pedidoPlato = {
            plato_id: idPlato,
            cantidad: 1,
        }

        if (anotacionInput) {
            anotacionInput.removeAttribute("disabled")
            pedidoPlato.anotacion = anotacionInput.value
        } else pedidoPlato.anotacion = ""

        pedido.push(pedidoPlato)
        platoEnPedido = pedidoPlato
    } else platoEnPedido.cantidad++

    seccionPlato.querySelector(".cantidad").textContent = platoEnPedido.cantidad
    calcularTotalActual()
}

const removeToPedido = (idPlato, event) => {
    const platoEnPedido = pedido.find(pedidoPlato => pedidoPlato.plato_id == idPlato)
    const seccionPlato = event.target.parentElement.parentElement.parentElement

    if (!platoEnPedido) return

    platoEnPedido.cantidad--

    if (platoEnPedido.cantidad == 0) {
        pedido = pedido.filter(pedidoPlato => pedidoPlato.plato_id != idPlato)

        const anotacionInput = seccionPlato.querySelector(".anotacion")
        anotacionInput.setAttribute("disabled", "")
    }

    seccionPlato.querySelector(".cantidad").textContent = platoEnPedido.cantidad
    calcularTotalActual()
}

const addAnotaciones = (idPlato, event) => {
    const platoEnPedido = pedido.find(pedidoPlato => pedidoPlato.plato_id == idPlato)
    platoEnPedido.anotacion = event.target.value
}


const calcularTotalActual = () => {
    const total = pedido.reduce((acum, plato) => {
        let platoMenu

        for (let categoria of menu) {
            platoMenu = categoria.platos.find(platoActual => platoActual.id === plato.plato_id)
            console.log(platoMenu)
            if (platoMenu) break
        }

        acum += plato.cantidad * Number(platoMenu.precio)
        return acum
    }, 0)

    document.querySelector("#total").textContent = total
}

const obtenerMenu = async () => {
    const response = await fetch("/api/cliente/obtener-menu")
        .then(res => res.json())
    return response
}

const enviarPedido = async () => {
    const pedido_id_actual = window.localStorage.getItem("pedido_id")
    const token = window.localStorage.getItem("token")
    if (!pedido_id_actual) {
        const pedidoRes = await fetch("/api/cliente/enviar-pedido", {
            method: "POST",
            headers: { 'Authorization': token, 'Content-Type': "application/json" },
            body: JSON.stringify({ pedido_id: null, pedidos: pedido })
        }).then(res => res.json())

        window.localStorage.setItem("pedido_id", pedidoRes.id)

        alert("Pedido enviado")
        window.location.href = "/movil/pedido-detalle"
    }
}