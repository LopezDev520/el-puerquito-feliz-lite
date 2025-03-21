
let imagen
let token
let $imagen
let $inputImagen
let $inputCategoriaId

document.addEventListener("DOMContentLoaded", () => {
    token = window.localStorage.getItem("token")

    $imagen = document.getElementById("imagen")
    $inputImagen = document.getElementById("imagen-input")

    $inputCategoriaId = document.querySelector("input[name='categoria_id']")
    $inputCategoriaId.value = obtenerIdCategoria()
})

const obtenerIdCategoria = () => {
    const url = new URL(window.location.href)
    return url.searchParams.get("id_categoria")
}

const mostrarImagen = event => {
    const input = event.target
    imagen = input.files[0]
    console.log(imagen)

    const reader = new FileReader()
    reader.onload = readerEvt => $imagen.src = readerEvt.target.result
    reader.readAsDataURL(imagen)
}

const guardarItem = async event => {
    const formData = new FormData(event.target)

    const res = await fetch("/api/admin/crear-plato", {
        method: "POST",
        headers: {
            'Authorization': token
        },
        body: formData,
    })

    if (res.ok) {
        alert("El plato/bebida ha sido guardado correctamente")
        window.location.href = "/escritorio/configuracion/menu"
    }
}