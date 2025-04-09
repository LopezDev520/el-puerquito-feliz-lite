
let plato;
let categorias;

let $inputId;
let $imagen;
let $inputNombre;
let $inputDescripcion;
let $inputPrecio;
let $selectCategorias;

let token;

document.addEventListener("DOMContentLoaded", async () => {

    token = window.localStorage.getItem("token")

    plato = await obtenerPlato();
    console.log(plato)

    $inputId = document.querySelector("input[name='id']")
    $inputId.value = plato.id

    $imagen = document.querySelector("#plato-img")
    $imagen.src = plato.imagen

    $inputNombre = document.querySelector("input[name='nombre']")
    $inputNombre.value = plato.nombre

    $inputDescripcion = document.querySelector("input[name='descripcion']")
    $inputDescripcion.value = plato.descripcion

    $inputPrecio = document.querySelector("input[name='precio']")
    $inputPrecio.value = plato.precio

    categorias = await obtenerCategorias();
    console.log(categorias)

    $selectCategorias = document.querySelector("select[name='categoria']")
    categorias.forEach(categoria => {
        const html = `<option value='${categoria.id}' ${categoria.id === plato.categoria.id ? "selected" : ""}>${categoria.nombre}</option>`
        $selectCategorias.innerHTML += html
    })

})

const obtenerPlato = async () => {
    const id = new URL(window.location.href).searchParams.get("plato_id");
    return await fetch(`/api/admin/obtener-plato?id=${id}`)
        .then(res => res.json())
}

const obtenerCategorias = async () =>
    await fetch("/api/admin/obtener-categorias")
        .then(res => res.json())

const mostrarImagen = event => {
    const input = event.target
    const imagen = input.files[0]
    console.log(imagen)

    const reader = new FileReader()
    reader.onload = readerEvt => $imagen.src = readerEvt.target.result
    reader.readAsDataURL(imagen)
}

const enviarPlatoModificado = async event => {
    const formData = new FormData(event.target);

    // Si el usuario no seleccionó una nueva imagen, convertir la URL en un File
    const imagenInput = document.querySelector("#imagen-input");
    if (!imagenInput.files.length) {
        const respuesta = await fetch($imagen.src);
        const blob = await respuesta.blob();
        const archivo = new File([blob], "imagen.jpg", { type: blob.type });
        formData.append("imagen", archivo);
    }

    console.log(Object.fromEntries(formData));

    const res = await fetch("/api/admin/modificar-plato", {
        method: "POST",
        headers: {
            'Authorization': token
        },
        body: formData,
    });

    if (res.ok) {
        alert("El plato/bebida ha sido guardado correctamente");
        window.location.href = "/escritorio/configuracion/menu";
    }
};
