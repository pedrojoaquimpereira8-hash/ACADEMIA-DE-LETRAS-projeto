const formLoginProfessor = document.getElementById("formLoginProfessor");
const cpfProfessor = document.getElementById("cpfProfessor");
const senhaProfessor = document.getElementById("senhaProfessor");

const cpfProfessorCadastrado = "12345678900";
const senhaProfessorCadastrada = "1234";

cpfProfessor.addEventListener("input", () => {
    let valor = cpfProfessor.value.replace(/\D/g, "");
    valor = valor.substring(0, 11);

    if (valor.length > 9) {
        valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
    } else if (valor.length > 6) {
        valor = valor.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    } else if (valor.length > 3) {
        valor = valor.replace(/(\d{3})(\d+)/, "$1.$2");
    }

    cpfProfessor.value = valor;
});

formLoginProfessor.addEventListener("submit", (event) => {
    event.preventDefault();

    const cpf = cpfProfessor.value.replace(/\D/g, "");
    const senha = senhaProfessor.value;

    if (cpf === "" || senha === "") {
        mostrarToast("Preencha todos os campos.", "warning");
        return;
    }

    if (cpf === cpfProfessorCadastrado && senha === senhaProfessorCadastrada) {
        window.location.href = "professor.html";
        return;
    }

    mostrarToast("CPF ou senha incorretos.", "error");
});

function mostrarToast(mensagem, tipo = "success") {
    const toastElemento = document.getElementById("toastDonna");
    const toastBody = document.getElementById("toastBody");
    const toastTitle = document.getElementById("toastTitle");
    const toastIcon = document.getElementById("toastIcon");

    if (!toastElemento) return;

    toastElemento.classList.remove("toast-success", "toast-error", "toast-warning");

    if (tipo === "success") {
        toastElemento.classList.add("toast-success");
        toastTitle.textContent = "Sucesso";
        toastIcon.className = "bi bi-check-circle-fill fs-3 me-3";
    }

    if (tipo === "error") {
        toastElemento.classList.add("toast-error");
        toastTitle.textContent = "Erro";
        toastIcon.className = "bi bi-x-circle-fill fs-3 me-3";
    }

    if (tipo === "warning") {
        toastElemento.classList.add("toast-warning");
        toastTitle.textContent = "Aviso";
        toastIcon.className = "bi bi-exclamation-triangle-fill fs-3 me-3";
    }

    toastBody.textContent = mensagem;

    const toast = bootstrap.Toast.getOrCreateInstance(toastElemento, { delay: 3500 });
    toast.show();
}