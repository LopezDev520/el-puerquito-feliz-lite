
document.addEventListener("DOMContentLoaded", async () => {
    const numeroMesas = await getNumeroMesas();
    const $numeroMesa = document.getElementById('numero-mesa');

    for (let i = 1; i <= numeroMesas; i++) {
        $numeroMesa.innerHTML += `<option value="${i}">Mesa ${i}</option`
    }
})

const getNumeroMesas = async () => {
    const response = await fetch('/api/numero-mesas');
    const data = await response.json();
    return data;
}

const obtenerToken = async (event) => {
    const form = event.target;
    const formData = new FormData(form);

    if (!formData.get("nombre")) {
        alert("El nombre es obligatorio");
        return;
    }

    const token = await fetch('/api/nuevo-cliente', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)),
    }).then(response => response.text());

    localStorage.setItem('token', token);
    window.location.href = '/movil/menu';
}