const formLoginAluno = document.getElementById("formLoginAluno");
const nomeAlunoLogin = document.getElementById("nomeAlunoLogin");
const cpfAlunoLogin = document.getElementById("cpfAlunoLogin");

cpfAlunoLogin.addEventListener("input", () => {
    let valor = cpfAlunoLogin.value.replace(/\D/g, "");
    valor = valor.substring(0, 11);

    if (valor.length > 9) {
        valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
    } else if (valor.length > 6) {
        valor = valor.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    } else if (valor.length > 3) {
        valor = valor.replace(/(\d{3})(\d+)/, "$1.$2");
    }

    cpfAlunoLogin.value = valor;
});

formLoginAluno.addEventListener("submit", (event) => {
    event.preventDefault();

    const nome = nomeAlunoLogin.value.trim();
    const cpf = cpfAlunoLogin.value.replace(/\D/g, "");

    if (nome === "" || cpf === "") {
        mostrarToast("Preencha todos os campos.", "warning");
        return;
    }

    if (cpf.length !== 11) {
        mostrarToast("Digite um CPF válido.", "warning");
        return;
    }

    const alunos = JSON.parse(localStorage.getItem("alunos")) || [];

    const alunoEncontrado = alunos.find(aluno =>
        aluno.cpf === cpf &&
        aluno.nome.toLowerCase() === nome.toLowerCase()
    );

    if (!alunoEncontrado) {
        mostrarToast("Aluno não encontrado. Verifique o nome e o CPF.", "error");
        return;
    }

    sessionStorage.setItem("cpfAlunoLogado", alunoEncontrado.cpf);
    window.location.href = "aluno.html";
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