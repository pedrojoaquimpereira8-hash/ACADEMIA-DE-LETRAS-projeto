let cursoSelecionado = "";

const linksCursos = document.querySelectorAll("#c1, #c2, #c3, #c4");

const modalCursoEl = document.getElementById("modalCurso");
const modalCadastroEl = document.getElementById("modalCadastro");

const modalCurso = bootstrap.Modal.getOrCreateInstance(modalCursoEl);
const modalCadastro = bootstrap.Modal.getOrCreateInstance(modalCadastroEl);

const btnFazerMatricula = document.getElementById("btnFazerMatricula");
const formCadastro = document.getElementById("formCadastroFinal");

const nomeAluno = document.getElementById("nomeAluno");
const cpfAluno = document.getElementById("cpfAluno");
const emailAluno = document.getElementById("emailAluno");
const telefoneAluno = document.getElementById("telefoneAluno");
const cursoAluno = document.getElementById("cursoAluno");

function validarNome() {
    if (!nomeAluno) return false;

    const valor = nomeAluno.value.trim();
    const regex = /^[A-Za-zÀ-ÿ\s]+$/;

    if (valor === "") {
        mostrarToast("Digite seu nome.", "warning");
        return false;
    }

    if (!regex.test(valor)) {
        mostrarToast("O nome deve conter apenas letras.", "warning");
        return false;
    }

    return true;
}

function validarCPF() {
    if (!cpfAluno) return false;

    const cpf = cpfAluno.value.replace(/\D/g, "");

    if (cpf === "") {
        mostrarToast("Digite seu CPF.", "warning");
        return false;
    }

    if (cpf.length !== 11) {
        mostrarToast("Digite um CPF válido.", "warning");
        return false;
    }

    return true;
}

function validarEmail() {
    if (!emailAluno) return false;

    const valor = emailAluno.value.trim();

    if (valor === "") {
        mostrarToast("Digite seu e-mail.", "warning");
        return false;
    }

    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!regexEmail.test(valor)) {
        mostrarToast("Digite um e-mail válido.", "warning");
        return false;
    }

    return true;
}

function validarTelefone() {
    if (!telefoneAluno) return false;

    const telefone = telefoneAluno.value.replace(/\D/g, "");

    if (telefone === "") {
        mostrarToast("Digite seu telefone.", "warning");
        return false;
    }

    if (telefone.length !== 11) {
        mostrarToast("Digite um telefone válido.", "warning");
        return false;
    }

    return true;
}

cpfAluno.addEventListener("input", () => {
    let valor = cpfAluno.value.replace(/\D/g, "");
    valor = valor.substring(0, 11);

    if (valor.length > 9) {
        valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1})/, "$1.$2.$3-$4");
    } else if (valor.length > 6) {
        valor = valor.replace(/(\d{3})(\d{3})(\d+)/, "$1.$2.$3");
    } else if (valor.length > 3) {
        valor = valor.replace(/(\d{3})(\d+)/, "$1.$2");
    }

    cpfAluno.value = valor;
});

telefoneAluno.addEventListener("input", () => {
    let valor = telefoneAluno.value.replace(/\D/g, "");
    valor = valor.substring(0, 11);

    if (valor.length > 10) {
        valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (valor.length > 6) {
        valor = valor.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
    } else if (valor.length > 2) {
        valor = valor.replace(/(\d{2})(\d+)/, "($1) $2");
    }

    telefoneAluno.value = valor;
});

function atualizarModalCurso(link) {
    if (!link) return;

    cursoSelecionado = link.dataset.curso;

    const nomeCurso = document.getElementById("nomeCurso");
    const precoCurso = document.getElementById("precoCurso");
    const planoModal = document.getElementById("planoModal");

    if (nomeCurso) {
        nomeCurso.textContent = "Curso de " + cursoSelecionado;
    }

    if (precoCurso) {
        precoCurso.textContent = link.dataset.preco;
    }

    if (planoModal) {
        planoModal.classList.remove("modal-ingles", "modal-espanhol", "modal-frances", "modal-japones");

        switch (cursoSelecionado) {
            case "Inglês":
                planoModal.classList.add("modal-ingles");
                break;
            case "Espanhol":
                planoModal.classList.add("modal-espanhol");
                break;
            case "Francês":
                planoModal.classList.add("modal-frances");
                break;
            case "Japonês":
                planoModal.classList.add("modal-japones");
                break;
        }
    }
}

linksCursos.forEach(link => {
    link.addEventListener("click", () => {
        atualizarModalCurso(link);
    });
});

btnFazerMatricula.addEventListener("click", () => {
    cursoAluno.value = cursoSelecionado;

    modalCurso.hide();

    modalCursoEl.addEventListener("hidden.bs.modal", () => {
        modalCadastro.show();
    }, { once: true });
});

function carregarAlunos() {
    return JSON.parse(localStorage.getItem("alunos")) || [];
}

function salvarAlunos(alunos) {
    localStorage.setItem("alunos", JSON.stringify(alunos));
}

formCadastro.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validarNome()) return;
    if (!validarCPF()) return;
    if (!validarEmail()) return;
    if (!validarTelefone()) return;

    const alunos = carregarAlunos();

    const cpf = cpfAluno.value.replace(/\D/g, "");
    const telefone = telefoneAluno.value.replace(/\D/g, "");

    const cpfExiste = alunos.some(aluno => aluno.cpf === cpf);

    if (cpfExiste) {
        mostrarToast("Já existe um aluno cadastrado com esse CPF.", "error");
        return;
    }

    const aluno = {
        nome: nomeAluno.value.trim(),
        cpf: cpf,
        email: emailAluno.value.trim(),
        telefone: telefone,
        curso: cursoSelecionado,
        notas: {
            marcoAbril: 0,
            maioJunho: 0,
            agostoSetembro: 0,
            outubroNovembro: 0
        },
        frequencia: {
            presencas: 0,
            faltas: 0
        }
    };

    alunos.push(aluno);
    salvarAlunos(alunos);

    modalCadastro.hide();

    mostrarToast("Pedido realizado! Aguardando o devido pagamento.", "success");

    formCadastro.reset();
    cursoAluno.value = "";
    cursoSelecionado = "";
});

function mostrarToast(mensagem, tipo = "success") {
    const toastElemento = document.getElementById("toastDonna");
    const toastBody = document.getElementById("toastBody");
    const toastTitle = document.getElementById("toastTitle");
    const toastIcon = document.getElementById("toastIcon");

    if (!toastElemento) {
        console.warn("Elemento do Toast não foi encontrado no HTML.");
        return;
    }

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