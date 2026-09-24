// =====================================================
// CADASTRO / MODAL DOS CURSOS
// =====================================================

let nome = document.getElementById("nome");
let email = document.getElementById("email");
let fone = document.getElementById("telefone");

const modalCadastroEl = document.getElementById("modalCadastro");
const modalNovoEl = document.getElementById("modalNovo");

const modalCadastro = modalCadastroEl
    ? bootstrap.Modal.getOrCreateInstance(modalCadastroEl)
    : null;

const modalNovo = modalNovoEl
    ? bootstrap.Modal.getOrCreateInstance(modalNovoEl)
    : null;

const formCadastro = document.getElementById("formCadastro");
const linksCursos = document.querySelectorAll("#c1, #c2, #c3, #c4");

let cadastroConcluido = false;
let cursoSelecionado = "";

const btnFinalizar = document.getElementById("toastConcluir");


// =====================================================
// VALIDAÇÕES
// =====================================================

function validarNome() {

    if (!nome) {
        return false;
    }

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

    if (!email) {
        return false;
    }

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

    if (!fone) {
        return false;
    }

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


// =====================================================
// MÁSCARA DO TELEFONE
// =====================================================

if (fone) {

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

}


// =====================================================
// MODAL DOS CURSOS
// =====================================================

function atualizarModalCurso(link) {

    if (!link) {
        return;
    }

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

        planoModal.classList.remove(
            "modal-ingles",
            "modal-espanhol",
            "modal-frances",
            "modal-japones"
        );

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


// Clique nos 4 cursos

linksCursos.forEach(link => {

    link.addEventListener("click", () => {

        atualizarModalCurso(link);

    });

});


// =====================================================
// CADASTRO -> MODAL 2
// =====================================================

const next = document.getElementById("continuar");

if (
    next &&
    modalCadastro &&
    modalNovo &&
    modalCadastroEl &&
    modalNovoEl
) {

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

        cadastroConcluido = true;


        // Depois do cadastro, os links passam a abrir
        // diretamente o Modal 2.

        linksCursos.forEach(link => {

            link.removeAttribute("data-bs-toggle");
            link.removeAttribute("data-bs-target");

            link.onclick = (e) => {

                e.preventDefault();

                atualizarModalCurso(link);

                modalNovo.show();

            };

        });


        next.blur();

        modalCadastro.hide();


        modalCadastroEl.addEventListener(
            "hidden.bs.modal",
            function abrirModalNovo() {

                modalNovo.show();

            },
            { once: true }
        );

    });


    modalNovoEl.addEventListener(
        "hidden.bs.modal",
        () => {

            if (formCadastro) {
                formCadastro.reset();
            }

        }
    );

}


// =====================================================
// BOTÃO FINALIZAR MATRÍCULA
// =====================================================

if (btnFinalizar && modalNovo) {

    btnFinalizar.addEventListener("click", () => {

        modalNovo.hide();

        mostrarToast(
            "Pedido realizado! Aguardando o devido pagamento.",
            "success"
        );

    });

}


// =====================================================
// TOAST
// =====================================================

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


    toastElemento.classList.remove(
        "toast-success",
        "toast-error",
        "toast-warning"
    );


    if (tipo === "success") {

        toastElemento.classList.add("toast-success");

        toastTitle.textContent = "Sucesso";

        toastIcon.className =
            "bi bi-check-circle-fill fs-3 me-3";

    }


    if (tipo === "error") {

        toastElemento.classList.add("toast-error");

        toastTitle.textContent = "Erro";

        toastIcon.className =
            "bi bi-x-circle-fill fs-3 me-3";

    }


    if (tipo === "warning") {

        toastElemento.classList.add("toast-warning");

        toastTitle.textContent = "Aviso";

        toastIcon.className =
            "bi bi-exclamation-triangle-fill fs-3 me-3";

    }


    toastBody.textContent = mensagem;


    const toast = bootstrap.Toast.getOrCreateInstance(
        toastElemento,
        {
            delay: 3500
        }
    );


    toast.show();

}


// =====================================================
// SISTEMAS ACADÊMICOS
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // =================================================
    // ELEMENTOS DAS NOTAS
    // =================================================

    const curso = document.getElementById("curso");
    const turma = document.getElementById("turma");

    const btnConsultar =
        document.getElementById("btnConsultar");

    const alunos = {

        ingles: {
            A: [
                { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
            ],

            B: [
                { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
            ],

            C: [
                { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
            ]
        },

        espanhol: {
            A: [
                { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
            ],

            B: [
                { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
            ],

            C: [
                { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
            ]
        },

        japones: {
            A: [
                { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
            ],

            B: [
                { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
            ],

            C: [
                { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Gabriel S.C.S", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
            ]
        },

        frances: {
            A: [
                { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Gabriel S.C.S", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
            ],

            B: [
                { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Gabriel S.C.S", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
            ],

            C: [
                { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                { nome: "Gabriel S.C.S", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
            ]
        }
    };

    const modalEditarNota = new bootstrap.Modal(
        document.getElementById("modalEditarNota")
    );

    const nomeAlunoEditar = document.getElementById("nomeAlunoEditar");

    const notaMarco = document.getElementById("notaMarco");
    const notaAbril = document.getElementById("notaAbril");
    const notaMaio = document.getElementById("notaMaio");
    const notaJunho = document.getElementById("notaJunho");

    const btnSalvarNota = document.getElementById("btnSalvarNota");

    let alunoEditando = null;


    // =================================================
    // ELEMENTOS DA FREQUÊNCIA
    // =================================================

    const cursoFreq =
        document.getElementById("cursoFreq");

    const turmaFreq =
        document.getElementById("turmaFreq");

    const btnConsultarFreq =
        document.getElementById("btnConsultarFreq");

    const resultadoFrequencia =
        document.getElementById("resultadoFrequencia");


    // =================================================
    // CONTROLE DE NOTAS
    // =================================================

    if (btnConsultar && resultadoNotas && curso && turma) {

        const alunos = {

            ingles: {

                A: [
                    { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                    { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                    { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                    { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                    { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                    { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Maria Souza", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
                ],

                B: [
                    { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                    { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                    { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                    { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                    { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                    { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Maria Souza", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
                ],

                C: [
                    { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                    { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                    { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                    { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                    { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                    { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Maria Souza", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
                ]
            },

            espanhol: {

                A: [
                    { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                    { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                    { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                    { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                    { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                    { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Maria Souza", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
                ],

                B: [
                    { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                    { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                    { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                    { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                    { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                    { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Maria Souza", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
                ],

                C: [
                    { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                    { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                    { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                    { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                    { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                    { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Maria Souza", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
                ]
            },

            japones: {

                A: [
                    { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                    { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                    { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                    { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                    { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                    { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Maria Souza", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
                ],

                B: [
                    { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                    { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                    { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                    { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                    { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                    { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Maria Souza", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
                ],

                C: [
                    { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                    { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                    { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                    { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                    { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                    { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Maria Souza", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
                ]
            },

            frances: {

                A: [
                    { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                    { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                    { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                    { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                    { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                    { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Maria Souza", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
                ],

                B: [
                    { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                    { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                    { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                    { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                    { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                    { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Maria Souza", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
                ],

                C: [
                    { nome: "Ana Silva", notas: [8.5, 7.5, 9.0, 8.0] },
                    { nome: "Bruno Santos", notas: [7.0, 8.0, 7.5, 9.0] },
                    { nome: "Carlos Oliveira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Daniel Souza", notas: [7.5, 8.0, 8.5, 7.0] },
                    { nome: "Eduarda Lima", notas: [9.0, 9.5, 8.0, 9.0] },
                    { nome: "Felipe Costa", notas: [6.5, 7.0, 8.0, 7.5] },
                    { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "João Pereira", notas: [9.0, 8.5, 9.5, 9.0] },
                    { nome: "Maria Souza", notas: [8.0, 8.5, 9.0, 8.5] },
                    { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
                ]
            }

        };


        const modalEditarNotaEl =
            document.getElementById("modalEditarNota");

        const modalEditarNota =
            modalEditarNotaEl
                ? bootstrap.Modal.getOrCreateInstance(
                    modalEditarNotaEl
                )
                : null;


        const nomeAlunoEditar =
            document.getElementById("nomeAlunoEditar");

        const notaMarco =
            document.getElementById("notaMarco");

        const notaAbril =
            document.getElementById("notaAbril");

        const notaMaio =
            document.getElementById("notaMaio");

        const notaJunho =
            document.getElementById("notaJunho");

        const btnSalvarNota =
            document.getElementById("btnSalvarNota");


        let alunoEditando = null;


        function consultarNotas() {

            const cursoSelecionadoNotas =
                curso.value;

            const turmaSelecionadaNotas =
                turma.value;


            if (
                !cursoSelecionadoNotas ||
                !turmaSelecionadaNotas
            ) {

                resultadoNotas.innerHTML = `
                    <div class="alert alert-warning">
                        Selecione um curso e uma turma.
                    </div>
                `;

                return;
            }


            if (
                !alunos[cursoSelecionadoNotas] ||
                !alunos[cursoSelecionadoNotas][turmaSelecionadaNotas]
            ) {

                resultadoNotas.innerHTML = `
                    <div class="alert alert-danger">
                        Curso ou turma não encontrados.
                    </div>
                `;

                return;
            }


            const listaAlunos =
                alunos[cursoSelecionadoNotas][turmaSelecionadaNotas];


            if (listaAlunos.length === 0) {

                resultadoNotas.innerHTML = `
                    <div class="alert alert-info">
                        Não existem alunos cadastrados nesta turma.
                    </div>
                `;

                return;
            }


            let tabela = `
                <div class="table-responsive">
                    <table class="table table-striped table-bordered">

                        <thead>
                            <tr>
                                <th>Nº</th>
                                <th>Aluno</th>
                                <th>Março</th>
                                <th>Abril</th>
                                <th>Maio</th>
                                <th>Junho</th>
                                <th>Média</th>
                                <th>Ações</th>
                            </tr>
                        </thead>

                        <tbody>
            `;


            listaAlunos.forEach((aluno, index) => {

                const soma = aluno.notas.reduce(
                    (total, nota) => total + nota,
                    0
                );

                const media =
                    soma / aluno.notas.length;


                tabela += `
                    <tr>

                        <td>${index + 1}</td>

                        <td>${aluno.nome}</td>

                        <td>${aluno.notas[0].toFixed(1)}</td>

                        <td>${aluno.notas[1].toFixed(1)}</td>

                        <td>${aluno.notas[2].toFixed(1)}</td>

                        <td>${aluno.notas[3].toFixed(1)}</td>

                        <td>
                            <strong>
                                ${media.toFixed(1)}
                            </strong>
                        </td>

                        <td>

                            <button
                                type="button"
                                class="btn btn-warning btn-sm btn-editar"
                                data-index="${index}">
                                Editar
                            </button>

                        </td>

                    </tr>
                `;

            });


            tabela += `
                        </tbody>
                    </table>
                </div>
            `;


            resultadoNotas.innerHTML = `
                <h3>
                    ${curso.options[curso.selectedIndex].text}
                    - Turma ${turmaSelecionadaNotas}
                </h3>

                ${tabela}
            `;


            const botoesEditar =
                resultadoNotas.querySelectorAll(".btn-editar");


            botoesEditar.forEach(botao => {

                botao.addEventListener("click", () => {

                    const index =
                        Number(botao.dataset.index);


                    alunoEditando =
                        listaAlunos[index];


                    nomeAlunoEditar.textContent =
                        alunoEditando.nome;


                    notaMarco.value =
                        alunoEditando.notas[0];

                    notaAbril.value =
                        alunoEditando.notas[1];

                    notaMaio.value =
                        alunoEditando.notas[2];

                    notaJunho.value =
                        alunoEditando.notas[3];


                    if (modalEditarNota) {
                        modalEditarNota.show();
                    }

                });

            });

        }


        if (btnSalvarNota) {

            btnSalvarNota.addEventListener("click", () => {

                if (!alunoEditando) {
                    return;
                }


                alunoEditando.notas[0] =
                    Number(notaMarco.value);

                alunoEditando.notas[1] =
                    Number(notaAbril.value);

                alunoEditando.notas[2] =
                    Number(notaMaio.value);

                alunoEditando.notas[3] =
                    Number(notaJunho.value);


                if (modalEditarNota) {
                    modalEditarNota.hide();
                }


                consultarNotas();

            });

        }


        btnConsultar.addEventListener(
            "click",
            consultarNotas
        );

    }


    // =================================================
    // CONTROLE DE FREQUÊNCIA
    // =================================================

    if (
        btnConsultarFreq &&
        resultadoFrequencia &&
        cursoFreq &&
        turmaFreq
    ) {

        const frequencias = {

            ingles: {

                A: [
                    { nome: "Ana Silva", presencas: 75, faltas: 5 },
                    { nome: "Bruno Santos", presencas: 69, faltas: 11 },
                    { nome: "Carlos Oliveira", presencas: 78, faltas: 2 },
                    { nome: "Daniel Souza", presencas: 71, faltas: 9 },
                    { nome: "Eduarda Lima", presencas: 77, faltas: 3 },
                    { nome: "Felipe Costa", presencas: 64, faltas: 16 },
                    { nome: "Gabriel Alves", presencas: 73, faltas: 7 },
                    { nome: "João Pereira", presencas: 76, faltas: 4 },
                    { nome: "Maria Souza", presencas: 72, faltas: 8 },
                    { nome: "Helena Martins", presencas: 79, faltas: 1 }
                ],

                B: [
                    { nome: "Ana Silva", presencas: 74, faltas: 6 },
                    { nome: "Bruno Santos", presencas: 68, faltas: 12 },
                    { nome: "Carlos Oliveira", presencas: 77, faltas: 3 },
                    { nome: "Daniel Souza", presencas: 70, faltas: 10 },
                    { nome: "Eduarda Lima", presencas: 76, faltas: 4 },
                    { nome: "Felipe Costa", presencas: 66, faltas: 14 },
                    { nome: "Gabriel Alves", presencas: 72, faltas: 8 },
                    { nome: "João Pereira", presencas: 75, faltas: 5 },
                    { nome: "Maria Souza", presencas: 73, faltas: 7 },
                    { nome: "Helena Martins", presencas: 78, faltas: 2 }
                ],

                C: [
                    { nome: "Ana Silva", presencas: 76, faltas: 4 },
                    { nome: "Bruno Santos", presencas: 67, faltas: 13 },
                    { nome: "Carlos Oliveira", presencas: 79, faltas: 1 },
                    { nome: "Daniel Souza", presencas: 72, faltas: 8 },
                    { nome: "Eduarda Lima", presencas: 75, faltas: 5 },
                    { nome: "Felipe Costa", presencas: 65, faltas: 15 },
                    { nome: "Gabriel Alves", presencas: 74, faltas: 6 },
                    { nome: "João Pereira", presencas: 74, faltas: 6 },
                    { nome: "Maria Souza", presencas: 71, faltas: 9 },
                    { nome: "Helena Martins", presencas: 80, faltas: 0 }
                ]

            },


            espanhol: {

                A: [
                    { nome: "Ana Silva", presencas: 73, faltas: 7 },
                    { nome: "Bruno Santos", presencas: 70, faltas: 10 },
                    { nome: "Carlos Oliveira", presencas: 77, faltas: 3 },
                    { nome: "Daniel Souza", presencas: 69, faltas: 11 },
                    { nome: "Eduarda Lima", presencas: 78, faltas: 2 },
                    { nome: "Felipe Costa", presencas: 63, faltas: 17 },
                    { nome: "Gabriel Alves", presencas: 74, faltas: 6 },
                    { nome: "João Pereira", presencas: 75, faltas: 5 },
                    { nome: "Maria Souza", presencas: 72, faltas: 8 },
                    { nome: "Helena Martins", presencas: 79, faltas: 1 }
                ],

                B: [
                    { nome: "Ana Silva", presencas: 74, faltas: 6 },
                    { nome: "Bruno Santos", presencas: 68, faltas: 12 },
                    { nome: "Carlos Oliveira", presencas: 76, faltas: 4 },
                    { nome: "Daniel Souza", presencas: 71, faltas: 9 },
                    { nome: "Eduarda Lima", presencas: 77, faltas: 3 },
                    { nome: "Felipe Costa", presencas: 64, faltas: 16 },
                    { nome: "Gabriel Alves", presencas: 73, faltas: 7 },
                    { nome: "João Pereira", presencas: 74, faltas: 6 },
                    { nome: "Maria Souza", presencas: 71, faltas: 9 },
                    { nome: "Helena Martins", presencas: 78, faltas: 2 }
                ],

                C: [
                    { nome: "Ana Silva", presencas: 75, faltas: 5 },
                    { nome: "Bruno Santos", presencas: 69, faltas: 11 },
                    { nome: "Carlos Oliveira", presencas: 78, faltas: 2 },
                    { nome: "Daniel Souza", presencas: 72, faltas: 8 },
                    { nome: "Eduarda Lima", presencas: 76, faltas: 4 },
                    { nome: "Felipe Costa", presencas: 65, faltas: 15 },
                    { nome: "Gabriel Alves", presencas: 74, faltas: 6 },
                    { nome: "João Pereira", presencas: 75, faltas: 5 },
                    { nome: "Maria Souza", presencas: 73, faltas: 7 },
                    { nome: "Helena Martins", presencas: 79, faltas: 1 }
                ]

            },


            frances: {

                A: [
                    { nome: "Ana Silva", presencas: 76, faltas: 4 },
                    { nome: "Bruno Santos", presencas: 70, faltas: 10 },
                    { nome: "Carlos Oliveira", presencas: 79, faltas: 1 },
                    { nome: "Daniel Souza", presencas: 72, faltas: 8 },
                    { nome: "Eduarda Lima", presencas: 78, faltas: 2 },
                    { nome: "Felipe Costa", presencas: 66, faltas: 14 },
                    { nome: "Gabriel Alves", presencas: 74, faltas: 6 },
                    { nome: "João Pereira", presencas: 76, faltas: 4 },
                    { nome: "Maria Souza", presencas: 73, faltas: 7 },
                    { nome: "Helena Martins", presencas: 80, faltas: 0 }
                ],

                B: [
                    { nome: "Ana Silva", presencas: 75, faltas: 5 },
                    { nome: "Bruno Santos", presencas: 69, faltas: 11 },
                    { nome: "Carlos Oliveira", presencas: 78, faltas: 2 },
                    { nome: "Daniel Souza", presencas: 71, faltas: 9 },
                    { nome: "Eduarda Lima", presencas: 77, faltas: 3 },
                    { nome: "Felipe Costa", presencas: 65, faltas: 15 },
                    { nome: "Gabriel Alves", presencas: 73, faltas: 7 },
                    { nome: "João Pereira", presencas: 75, faltas: 5 },
                    { nome: "Maria Souza", presencas: 72, faltas: 8 },
                    { nome: "Helena Martins", presencas: 79, faltas: 1 }
                ],

                C: [
                    { nome: "Ana Silva", presencas: 74, faltas: 6 },
                    { nome: "Bruno Santos", presencas: 68, faltas: 12 },
                    { nome: "Carlos Oliveira", presencas: 77, faltas: 3 },
                    { nome: "Daniel Souza", presencas: 70, faltas: 10 },
                    { nome: "Eduarda Lima", presencas: 78, faltas: 2 },
                    { nome: "Felipe Costa", presencas: 64, faltas: 16 },
                    { nome: "Gabriel Alves", presencas: 72, faltas: 8 },
                    { nome: "João Pereira", presencas: 76, faltas: 4 },
                    { nome: "Maria Souza", presencas: 71, faltas: 9 },
                    { nome: "Helena Martins", presencas: 80, faltas: 0 }
                ]

            },


            japones: {

                A: [
                    { nome: "Ana Silva", presencas: 74, faltas: 6 },
                    { nome: "Bruno Santos", presencas: 67, faltas: 13 },
                    { nome: "Carlos Oliveira", presencas: 79, faltas: 1 },
                    { nome: "Daniel Souza", presencas: 71, faltas: 9 },
                    { nome: "Eduarda Lima", presencas: 77, faltas: 3 },
                    { nome: "Felipe Costa", presencas: 63, faltas: 17 },
                    { nome: "Gabriel Alves", presencas: 73, faltas: 7 },
                    { nome: "João Pereira", presencas: 75, faltas: 5 },
                    { nome: "Maria Souza", presencas: 72, faltas: 8 },
                    { nome: "Helena Martins", presencas: 80, faltas: 0 }
                ],

                B: [
                    { nome: "Ana Silva", presencas: 75, faltas: 5 },
                    { nome: "Bruno Santos", presencas: 68, faltas: 12 },
                    { nome: "Carlos Oliveira", presencas: 78, faltas: 2 },
                    { nome: "Daniel Souza", presencas: 70, faltas: 10 },
                    { nome: "Eduarda Lima", presencas: 76, faltas: 4 },
                    { nome: "Felipe Costa", presencas: 65, faltas: 15 },
                    { nome: "Gabriel Alves", presencas: 74, faltas: 6 },
                    { nome: "João Pereira", presencas: 76, faltas: 4 },
                    { nome: "Maria Souza", presencas: 71, faltas: 9 },
                    { nome: "Helena Martins", presencas: 79, faltas: 1 }
                ],

                C: [
                    { nome: "Ana Silva", presencas: 76, faltas: 4 },
                    { nome: "Bruno Santos", presencas: 69, faltas: 11 },
                    { nome: "Carlos Oliveira", presencas: 79, faltas: 1 },
                    { nome: "Daniel Souza", presencas: 72, faltas: 8 },
                    { nome: "Eduarda Lima", presencas: 77, faltas: 3 },
                    { nome: "Felipe Costa", presencas: 64, faltas: 16 },
                    { nome: "Gabriel Alves", presencas: 75, faltas: 5 },
                    { nome: "João Pereira", presencas: 74, faltas: 6 },
                    { nome: "Maria Souza", presencas: 73, faltas: 7 },
                    { nome: "Helena Martins", presencas: 80, faltas: 0 }
                ]

            }

        };


        const modalEditarFreqEl =
            document.getElementById("modalEditarFreq");

        const modalEditarFreq =
            modalEditarFreqEl
                ? bootstrap.Modal.getOrCreateInstance(
                    modalEditarFreqEl
                )
                : null;


        const nomeAlunoFreq =
            document.getElementById("nomeAlunoFreq");

        const presencasAluno =
            document.getElementById("presencasAluno");

        const faltasAluno =
            document.getElementById("faltasAluno");

        const btnSalvarFreq =
            document.getElementById("btnSalvarFreq");


        let alunoEditandoFreq = null;


        function calcularPercentual(presencas, faltas) {

            const total =
                Number(presencas) + Number(faltas);


            if (total <= 0) {
                return 0;
            }


            return (
                (Number(presencas) / total) * 100
            ).toFixed(0);

        }


        function consultarFrequencia() {

            const cursoSelecionadoFreq =
                cursoFreq.value;

            const turmaSelecionadaFreq =
                turmaFreq.value;


            if (
                !cursoSelecionadoFreq ||
                !turmaSelecionadaFreq
            ) {

                resultadoFrequencia.innerHTML = `
                    <div class="alert alert-warning">
                        Selecione um curso e uma turma.
                    </div>
                `;

                return;
            }


            if (
                !frequencias[cursoSelecionadoFreq] ||
                !frequencias[cursoSelecionadoFreq][turmaSelecionadaFreq]
            ) {

                resultadoFrequencia.innerHTML = `
                    <div class="alert alert-danger">
                        Curso ou turma não encontrados.
                    </div>
                `;

                return;
            }


            const listaAlunos =
                frequencias[
                cursoSelecionadoFreq
                ][
                turmaSelecionadaFreq
                ];


            if (listaAlunos.length === 0) {

                resultadoFrequencia.innerHTML = `
                    <div class="alert alert-info">
                        Não existem alunos cadastrados nesta turma.
                    </div>
                `;

                return;
            }


            let tabela = `
                <div class="table-responsive">

                    <table class="table table-striped table-bordered">

                        <thead>

                            <tr>

                                <th>Nº</th>
                                <th>Aluno</th>
                                <th>Presenças</th>
                                <th>Faltas</th>
                                <th>Frequência</th>
                                <th>Status</th>
                                <th>Ações</th>

                            </tr>

                        </thead>

                        <tbody>
            `;


            listaAlunos.forEach((aluno, index) => {

                const porcentagem =
                    Number(
                        calcularPercentual(
                            aluno.presencas,
                            aluno.faltas
                        )
                    );


                const status =
                    porcentagem >= 75
                        ? "Aprovado"
                        : "Reprovado";


                const classeStatus =
                    porcentagem >= 75
                        ? "bg-success"
                        : "bg-danger";


                tabela += `
                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            ${aluno.nome}
                        </td>

                        <td>
                            ${aluno.presencas}
                        </td>

                        <td>
                            ${aluno.faltas}
                        </td>

                        <td>
                            ${porcentagem}%
                        </td>

                        <td>
                            <span class="badge ${classeStatus}">
                                ${status}
                            </span>
                        </td>

                        <td>

                            <button
                                type="button"
                                class="btn btn-warning btn-sm btn-editar-freq"
                                data-index="${index}">
                                Editar
                            </button>

                        </td>

                    </tr>
                `;

            });


            tabela += `
                        </tbody>

                    </table>

                </div>
            `;


            resultadoFrequencia.innerHTML = `

                <h3>

                    ${cursoFreq.options[
                    cursoFreq.selectedIndex
                ].text}

                    - Turma ${turmaSelecionadaFreq}

                </h3>

                ${tabela}

            `;


            const botoesEditarFreq =
                resultadoFrequencia.querySelectorAll(
                    ".btn-editar-freq"
                );


            botoesEditarFreq.forEach(botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                botao.dataset.index
                            );


                        alunoEditandoFreq =
                            listaAlunos[index];


                        nomeAlunoFreq.textContent =
                            alunoEditandoFreq.nome;


                        presencasAluno.value =
                            alunoEditandoFreq.presencas;


                        faltasAluno.value =
                            alunoEditandoFreq.faltas;


                        if (modalEditarFreq) {
                            modalEditarFreq.show();
                        }

                    }
                );

            });

        }


        if (btnSalvarFreq) {

            btnSalvarFreq.addEventListener(
                "click",
                () => {

                    if (!alunoEditandoFreq) {
                        return;
                    }


                    let presencas =
                        Number(
                            presencasAluno.value
                        );

                    let faltas =
                        Number(
                            faltasAluno.value
                        );


                    // Não permite números negativos

                    if (presencas < 0) {
                        presencas = 0;
                    }

                    if (faltas < 0) {
                        faltas = 0;
                    }


                    alunoEditandoFreq.presencas =
                        presencas;

                    alunoEditandoFreq.faltas =
                        faltas;


                    if (modalEditarFreq) {
                        modalEditarFreq.hide();
                    }


                    consultarFrequencia();

                }
            );

        }


        btnConsultarFreq.addEventListener(
            "click",
            consultarFrequencia
        );
    }
});