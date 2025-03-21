let pedido = []
let menu = []

function addCantidad(id, event) {
    const platoIndex = pedido.findIndex(plato => plato.plato_id == id)
    const platoExiste = platoIndex != -1

    const pedidoPlatoEl = event.target.parentElement.parentElement.parentElement

    if (!platoExiste) {
        const anotacion = pedidoPlatoEl.querySelector(".anotacion").value

        const pedidoPlato = {
            plato_id: id,
            cantidad: 1,
            anotacion
        }

        pedidoPlatoEl.querySelector(".cantidad").textContent = 1

        pedido.push(pedidoPlato)
    } else {
        pedido[platoIndex].cantidad++
        pedidoPlatoEl.querySelector(".cantidad").textContent = pedido[platoIndex].cantidad
    }


    calcularTotalActual()
}

function removeCantidad(id, event) {
    const platoIndex = pedido.findIndex(plato => plato.plato_id == id)
    const platoExiste = platoIndex != -1

    const pedidoPlatoEl = event.target.parentElement.parentElement.parentElement

    if (platoExiste) {
        pedido[platoIndex].cantidad--
        pedidoPlatoEl.querySelector(".cantidad").textContent = pedido[platoIndex].cantidad
    }

    if (pedido[platoIndex].cantidad <= 0) {
        pedido = pedido.filter(plato => plato.plato_id != id)
        pedidoPlatoEl.querySelector(".cantidad").textContent = 0
    }

    console.log(pedido)
    calcularTotalActual()
}

function calcularTotalActual() {
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

document.addEventListener("DOMContentLoaded", async function () {
    const contenedorMenu = document.querySelector(".contenedor_menu")
    menu = await obtenerMenu()

    console.log({ menu })

    const renderizarPlato = (plato, esBebida) => `
        <div class="seccion_plato">
            <div class="${esBebida ? "bebida" : "hamburguesa"}">
                <img src="${plato.imagen}" alt="${plato.nombre}" />
                <div class="informacion">
                    <p><strong>${plato.nombre}</strong></p>
                    <p>${plato.descripcion}</p>
                    <p>$ ${plato.precio}</p>
                </div>

                <div class="sumar_restar">
                    <button onclick="removeCantidad(${plato.id}, event)">-</button>
                    <span class="cantidad">0</span>
                    <button onclick="addCantidad(${plato.id}, event)">+</button>
                </div>
            </div>
            ${!esBebida ? `<input class="anotacion" type="text" placeholder="Anotaciones..." />` : ""}
        </div>
    `

    menu.forEach(categoria => {
        const html = `<h2>${categoria.nombre}</h2>`
        const platos = categoria.platos.map(plato => renderizarPlato(plato, categoria.nombre === "Bebidas"))

        contenedorMenu.innerHTML += `${html}${platos}`
    })
});