
let token
let categorias

let $categorias
let $nombreCategoria
let $nuevoItemBtn
let $elementosCategoria

let indexCategoriaActual

document.addEventListener("DOMContentLoaded", async () => {
    token = window.localStorage.getItem("token")
    categorias = await obtenerCategorias()
    $categorias = document.getElementById("categorias")
    $nombreCategoria = document.getElementById("nombre-categoria")
    $nuevoItemBtn = document.getElementById("nuevo-item-btn")
    $elementosCategoria = document.querySelector(".elementos")

    console.log(categorias)

    categorias.map(categoria => categoria.nombre).forEach((nombre, i) => {
        const html = `<p onclick="mostrarCategoria(${i})">${nombre}</p>`
        $categorias.innerHTML += html
    })

    mostrarCategoria(0)
})

const cambiarHidden = sel => document.querySelector(sel).classList.toggle("hidden")

const eliminarPlato = async id => {
    const eliminar = confirm("Desea eliminar el plato?")

    if (eliminar) {
        const res = await fetch(`/api/admin/eliminar-plato?id=${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': token
            }
        })

        if (res.ok) {
            alert("Plato eliminado correctamente");
            window.location.href = "/escritorio/configuracion/menu"
        }
    }
}

const crearCategoria = async event => {
    const formData = new FormData(event.target)

    const res = await fetch("/api/admin/crear-categoria",{
        method: "POST",
        headers: { 'Authorization': token },
        body: formData
    })

    if (res.ok) {
        alert("Categoria creada")
        window.location.href = "/escritorio/configuracion/menu"
    }
}

const mostrarCategoria = index => {

    $elementosCategoria.innerHTML = ""
    const categoria = categorias[index]

    indexCategoriaActual = index

    $nombreCategoria.textContent = categoria.nombre
    $nuevoItemBtn.href = `/escritorio/configuracion/menu/nuevo?id_categoria=${categoria.id}`

    categoria.platos.forEach(plato => {
        const html =
            `<div class="elemento">
                <img src="${plato.imagen}"
                    alt="${plato.nombre}">
                    <div class="informacion">
                        <p><strong>${plato.nombre}</strong></p>
                        <p>${plato.descripcion}</p>
                        <p>$ ${plato.precio}</p>

                        <div class="acciones">
                            <a href="/escritorio/configuracion/menu/editar?plato_id=${plato.id}"><button>Editar</button></a>
                            <button onclick="eliminarPlato(${plato.id})">Eliminar</button>
                        </div>
                    </div>
            </div>`

        $elementosCategoria.innerHTML += html
    })
}

const obtenerCategorias = async () =>
    await fetch("/api/admin/obtener-categorias-platos", {
        headers: { 'Authorization': token }
    }).then(res => res.json())
