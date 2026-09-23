let en = document.getElementById('c1');
let es = document.getElementById('c2');
let jp = document.getElementById('c3');
let fr = document.getElementById('c4');
let nome = document.getElementById('nome');
let email = document.getElementById('email');
let fone = document.getElementById('telefone');

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

const next = document.getElementById("continuar");
const modalCadastroEl = document.getElementById("modalCadastro");
const modalNovoEl = document.getElementById("modalNovo");
//const modalCadastro = bootstrap.Modal.getOrCreateInstance(modalCadastroEl);
//const modalNovo = bootstrap.Modal.getOrCreateInstance(modalNovoEl);
let cadastroConcluido = false;
const formCadastro = document.getElementById("formCadastro");
const linksCursos = document.querySelectorAll("#c1, #c2, #c3, #c4");
let cursoSelecionado = "";
const btnFinalizar = document.getElementById("toastConcluir");

if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
        modalNovo.hide(); // fecha o Modal 2
        mostrarToast(
            "Pedido realizado! Aguardando o devido pagamento.",
            "success"
        );
    });
}

function atualizarModalCurso(link) {
    cursoSelecionado = link.dataset.curso;
    document.getElementById("nomeCurso").textContent = "Curso de " + cursoSelecionado;
    document.getElementById("precoCurso").textContent = link.dataset.preco;

    const planoModal = document.getElementById("planoModal");
    // Remove qualquer cor antiga
    planoModal.classList.remove(
        "modal-ingles",
        "modal-espanhol",
        "modal-frances",
        "modal-japones"
    );
    // Adiciona a cor do curso
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

linksCursos.forEach(link => {
    link.addEventListener("click", () => {
        atualizarModalCurso(link);
    });
});

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
                atualizarModalCurso(link);
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

    const toast = bootstrap.Toast.getOrCreateInstance(
        toastElemento,
        {
            delay: 3500
        }
    );

    toast.show();

};

document.addEventListener("DOMContentLoaded", () => {

    const curso = document.getElementById("curso");
    const turma = document.getElementById("turma");
    const btnConsultar = document.getElementById("btnConsultar");
    const resultadoNotas = document.getElementById("resultadoNotas");

    if (!curso || !turma || !btnConsultar || !resultadoNotas) {
        return;
    }

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
                { nome: "Gabriel Alves", notas: [8.0, 8.5, 9.0, 8.5] },
                { nome: "Helena Martins", notas: [9.0, 9.0, 8.5, 9.5] }
            ]
        }
    };


    function consultarNotas() {

        const cursoSelecionado = curso.value;
        const turmaSelecionada = turma.value;

        if (!cursoSelecionado || !turmaSelecionada) {

            resultadoNotas.innerHTML = `
                <div class="alert alert-warning">
                    Selecione um curso e uma turma.
                </div>
            `;

            return;
        }


        if (!alunos[cursoSelecionado]) {

            resultadoNotas.innerHTML = `
                <div class="alert alert-danger">
                    Curso não encontrado.
                </div>
            `;

            return;
        }

        if (!alunos[cursoSelecionado][turmaSelecionada]) {

            resultadoNotas.innerHTML = `
                <div class="alert alert-danger">
                    Turma não encontrada.
                </div>
            `;

            return;
        }

        const listaAlunos = alunos[cursoSelecionado][turmaSelecionada];

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
                        </tr>
                    </thead>

                    <tbody>
        `;

        listaAlunos.forEach((aluno, index) => {

            const soma = aluno.notas.reduce(
                (total, nota) => total + nota,
                0
            );

            const media = soma / aluno.notas.length;


            tabela += `
                <tr>
                    <td>${index + 1}</td>

                    <td>${aluno.nome}</td>

                    <td>${aluno.notas[0].toFixed(1)}</td>

                    <td>${aluno.notas[1].toFixed(1)}</td>

                    <td>${aluno.notas[2].toFixed(1)}</td>

                    <td>${aluno.notas[3].toFixed(1)}</td>

                    <td><strong>${media.toFixed(1)}</strong></td>
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
                - Turma ${turmaSelecionada}
            </h3>

            ${tabela}
        `;
    }

    btnConsultar.addEventListener("click", consultarNotas);

});



