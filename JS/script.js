//Variáveis//
let en = document.getElementById('c1');
let es = document.getElementById('c2');
let jp = document.getElementById('c3');
let fr = document.getElementById('c4');
let nome = document.getElementById('nome');
let email = document.getElementById('email');
let fone = document.getElementById('telefone');

//Validação//
function validarNome() {

    const valor = nome.value.trim();

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

function validarEmail() {

    const valor = email.value.trim();

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

    const telefone = fone.value.replace(/\D/g, "");

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

fone.addEventListener("input", () => {

    let valor = fone.value.replace(/\D/g, "");

    valor = valor.substring(0, 11);

    if (valor.length > 10) {

        valor = valor.replace(
            /(\d{2})(\d{5})(\d{4})/,
            "($1) $2-$3"
        );

    } else if (valor.length > 6) {

        valor = valor.replace(
            /(\d{2})(\d{4})(\d+)/,
            "($1) $2-$3"
        );

    } else if (valor.length > 2) {

        valor = valor.replace(
            /(\d{2})(\d+)/,
            "($1) $2"
        );
    }

    fone.value = valor;
});

//Formulário//
const next = document.getElementById("continuar");
const modalCadastroEl = document.getElementById("modalCadastro");
const modalNovoEl = document.getElementById("modalNovo");
const modalCadastro = bootstrap.Modal.getOrCreateInstance(modalCadastroEl);
const modalNovo = bootstrap.Modal.getOrCreateInstance(modalNovoEl);
let cadastroConcluido = false;
const formCadastro = document.getElementById("formCadastro");
const linksCursos = document.querySelectorAll("#c1, #c2, #c3, #c4");

if (next) {
    next.addEventListener("click", () => {
        if (!validarNome()) {
            return;
        }
        if (!validarEmail()) {
            return;
        }
        if (!validarTelefone()) {
            return;
        }

        if (nome.value.trim() == "" || email.value.trim() == "" || fone.value.trim() == "") {
            mostrarToast("Preencha todos os campos antes de continuar.", "warning");
            return;
        }

        cadastroConcluido = true;
        linksCursos.forEach(link => {
            link.removeAttribute("data-bs-toggle");
            link.removeAttribute("data-bs-target");

            link.onclick = (e) => {
                e.preventDefault();
                modalNovo.show();
            };
        });        

        next.blur();
        modalCadastro.hide();

        modalCadastroEl.addEventListener("hidden.bs.modal",
        function abrirModalNovo() {

            modalNovo.show();

            modalCadastroEl.removeEventListener(
                "hidden.bs.modal",
                abrirModalNovo
            );
        });

    });

    modalNovoEl.addEventListener("hidden.bs.modal", () => {
        formCadastro.reset();
    });

}


    
//Toast//
function mostrarToast(mensagem, tipo = "success") {

    const toastElemento = document.getElementById("toastDonna");
    const toastBody = document.getElementById("toastBody");
    const toastTitle = document.getElementById("toastTitle");
    const toastIcon = document.getElementById("toastIcon");


    if (!toastElemento) {

        console.warn(
            "Elemento do Toast não foi encontrado no HTML."
        );

        return;
    }

    toastElemento.classList.remove("toast-success","toast-error","toast-warning");

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

    const toast = bootstrap.Toast.getOrCreateInstance(
        toastElemento,
        {
            delay: 3500
        }
    );

    toast.show();
};


