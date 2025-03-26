
let $password

document.addEventListener("DOMContentLoaded", () => {
    $password = document.getElementById("password")
})

const login = async event => {
    const formData = new FormData(event.target)

    const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData))
    })

    if (res.ok) {
        const token = await res.text()
        localStorage.setItem("token", token)
        window.location.href = "/escritorio/panel"
    }
}