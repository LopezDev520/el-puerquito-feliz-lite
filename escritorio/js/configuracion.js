
let token
let contrasenaActual
let numeroMesas

let $contrasenaInput
let $numeroMesasInput

document.addEventListener("DOMContentLoaded", async () => {
    
    token = window.localStorage.getItem("token")

    // Obtener y mostrar contrasena
    contrasenaActual = await obtenerContrasenaActual()
    $contrasenaInput = document.querySelector("input[name='contrasena']")
    $contrasenaInput.value = contrasenaActual

    // Obtener y mostar numero de mesas
    numeroMesas = await obtenerNumeroMesas()
    $numeroMesasInput = document.querySelector("input[name='numero_mesas']")
    $numeroMesasInput.value = numeroMesas

})

const obtenerContrasenaActual = async () => 
    await fetch("/api/admin/obtener-contrasena", {
        headers: { 'Authorization': token }
    })
        .then(res => res.text())

const mostrarContrasena = () => {
    if ($contrasenaInput.type === "password") $contrasenaInput.type = "text"
    else if ($contrasenaInput.type === "text") $contrasenaInput.type = "password"
}

const guardarContrasena = async () => {
    const { value: nuevaContrasena } = $contrasenaInput

    const res = await fetch("/api/admin/cambiar-contrasena", {
        method: "POST",
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nueva_contrasena: nuevaContrasena })
    })

    if (res.ok) alert("Contraseña cambiada correctamente")
}

const obtenerNumeroMesas = async () => 
    await fetch("/api/cliente/obtener-numero-mesas", {
        headers: { 'Authorization': token }
    }).then(res => res.text())

const guardarNumeroMesas = async () => {
    const { value: numero_mesas } = $numeroMesasInput

    const res = await fetch("/api/admin/cambiar-numero-mesas", {
        method: "POST",
        headers: { 'Authorization': token },
        body: JSON.stringify({ numero_mesas })
    })

    if (res.ok) alert("El numero de mesas ha sido actualizado")
}