const cursoFrequencia = document.getElementById("cursoFrequencia");
const tabelaFrequencia = document.getElementById("tabelaFrequencia");
const btnSalvarFrequencia = document.getElementById("btnSalvarFrequencia");
const btnLimparAlunos = document.getElementById("btnLimparAlunos");
const btnSair = document.getElementById("btnSair");

function carregarAlunos() {
    return JSON.parse(localStorage.getItem("alunos")) || [];
}

function salvarAlunos(alunos) {
    localStorage.setItem("alunos", JSON.stringify(alunos));
}

cursoFrequencia.addEventListener("change", () => {
    mostrarFrequencia();
});

function mostrarFrequencia() {
    const curso = cursoFrequencia.value;
    const alunos = carregarAlunos();

    tabelaFrequencia.innerHTML = "";

    if (curso === "") {
        tabelaFrequencia.innerHTML = '<tr><td colspan="4" class="text-muted">Selecione um curso para visualizar os alunos.</td></tr>';
        return;
    }

    const alunosCurso = alunos.filter(aluno => aluno.curso === curso);

    if (alunosCurso.length === 0) {
        tabelaFrequencia.innerHTML = '<tr><td colspan="4" class="text-muted">Nenhum aluno cadastrado neste curso.</td></tr>';
        return;
    }

    alunosCurso.forEach(aluno => {
        const totalAulas = aluno.frequencia.presencas + aluno.frequencia.faltas;
        let porcentagem = 0;

        if (totalAulas > 0) {
            porcentagem = (aluno.frequencia.presencas / totalAulas) * 100;
        }

        tabelaFrequencia.innerHTML += `
            <tr>
                <td>${aluno.nome}</td>
                <td><input type="number" class="form-control text-center presencas" data-cpf="${aluno.cpf}" value="${aluno.frequencia.presencas}" min="0" oninput="if(this.value < 0) this.value = 0"></td>
                <td><input type="number" class="form-control text-center faltas" data-cpf="${aluno.cpf}" value="${aluno.frequencia.faltas}" min="0" oninput="if(this.value < 0) this.value = 0"></td>
                <td>${porcentagem.toFixed(1)}%</td>
            </tr>
        `;
    });
}

btnSalvarFrequencia.addEventListener("click", () => {
    const alunos = carregarAlunos();

    const camposPresencas = document.querySelectorAll(".presencas");
    const camposFaltas = document.querySelectorAll(".faltas");

    camposPresencas.forEach(campo => {
        const cpf = campo.dataset.cpf;
        const aluno = alunos.find(aluno => aluno.cpf === cpf);

        if (aluno) {
            aluno.frequencia.presencas = Number(campo.value);
        }
    });

    camposFaltas.forEach(campo => {
        const cpf = campo.dataset.cpf;
        const aluno = alunos.find(aluno => aluno.cpf === cpf);

        if (aluno) {
            aluno.frequencia.faltas = Number(campo.value);
        }
    });

    salvarAlunos(alunos);
    mostrarFrequencia();
    mostrarToast("Frequência salva com sucesso.", "success");
});

const cursoNotas = document.getElementById("cursoNotas");
const tabelaNotas = document.getElementById("tabelaNotas");
const btnSalvarNotas = document.getElementById("btnSalvarNotas");

cursoNotas.addEventListener("change", mostrarAlunosNotas);

function calcularMedia(notas) {
    const valores = [
        notas.marAbr,
        notas.maiJun,
        notas.agoSet,
        notas.outNov
    ];

    if (valores.some(nota => nota === null || nota === undefined || nota === "")) {
        return "—";
    }

    const soma = valores.reduce((total, nota) => total + Number(nota), 0);

    return (soma / 4).toFixed(1);
}

function mostrarAlunosNotas() {

    const cursoSelecionado = cursoNotas.value;

    tabelaNotas.innerHTML = "";

    if (cursoSelecionado === "") {
        tabelaNotas.innerHTML = `
            <tr>
                <td colspan="6" class="text-muted">
                    Selecione um curso para visualizar os alunos.
                </td>
            </tr>
        `;
        return;
    }

    const alunos = carregarAlunos();

    const alunosCurso = alunos.filter(aluno =>
        aluno.curso === cursoSelecionado
    );

    if (alunosCurso.length === 0) {
        tabelaNotas.innerHTML = `
            <tr>
                <td colspan="6" class="text-muted">
                    Nenhum aluno cadastrado neste curso.
                </td>
            </tr>
        `;
        return;
    }

    alunosCurso.forEach(aluno => {

        if (!aluno.notas) {
            aluno.notas = {
                marAbr: "",
                maiJun: "",
                agoSet: "",
                outNov: ""
            };
        }

        const notas = aluno.notas;

        const media = calcularMedia(notas);

        tabelaNotas.innerHTML += `
            <tr data-cpf="${aluno.cpf}">

                <td>${aluno.nome}</td>

                <td>
                    <input
                        type="number"
                        class="form-control text-center nota"
                        data-nota="marAbr"
                        min="0"
                        max="10"
                        step="0.1"
                        value="${notas.marAbr}"
                        placeholder="0 a 10"
                    >
                </td>

                <td>
                    <input
                        type="number"
                        class="form-control text-center nota"
                        data-nota="maiJun"
                        min="0"
                        max="10"
                        step="0.1"
                        value="${notas.maiJun}"
                        placeholder="0 a 10"
                    >
                </td>

                <td>
                    <input
                        type="number"
                        class="form-control text-center nota"
                        data-nota="agoSet"
                        min="0"
                        max="10"
                        step="0.1"
                        value="${notas.agoSet}"
                        placeholder="0 a 10"
                    >
                </td>

                <td>
                    <input
                        type="number"
                        class="form-control text-center nota"
                        data-nota="outNov"
                        min="0"
                        max="10"
                        step="0.1"
                        value="${notas.outNov}"
                        placeholder="0 a 10"
                    >
                </td>

                <td class="media-aluno fw-bold">
                    ${media}
                </td>

            </tr>
        `;
    });

    document.querySelectorAll("#tabelaNotas .nota").forEach(input => {

        input.addEventListener("input", function () {

            const linha = this.closest("tr");

            const campos = linha.querySelectorAll(".nota");

            const valores = Array.from(campos).map(campo => campo.value);

            const mediaElemento = linha.querySelector(".media-aluno");

            if (valores.some(valor => valor === "")) {
                mediaElemento.textContent = "—";
                return;
            }

            const soma = valores.reduce(
                (total, valor) => total + Number(valor),
                0
            );

            mediaElemento.textContent = (soma / 4).toFixed(1);
        });

    });
}

btnSalvarNotas.addEventListener("click", function () {

    const cursoSelecionado = cursoNotas.value;

    if (cursoSelecionado === "") {
        mostrarToast("Selecione um curso primeiro.", "warning");
        return;
    }

    const alunos = carregarAlunos();

    const linhas = tabelaNotas.querySelectorAll("tr[data-cpf]");

    let notasInvalidas = false;

    linhas.forEach(linha => {

        const campos = linha.querySelectorAll(".nota");

        campos.forEach(campo => {

            if (
                campo.value !== "" &&
                (Number(campo.value) < 0 || Number(campo.value) > 10)
            ) {
                notasInvalidas = true;
            }

        });

    });

    if (notasInvalidas) {
        mostrarToast("As notas devem estar entre 0 e 10.", "danger");
        return;
    }

    linhas.forEach(linha => {

        const cpf = linha.dataset.cpf;

        const aluno = alunos.find(aluno => aluno.cpf === cpf);

        if (!aluno) return;

        aluno.notas = {};

        const campos = linha.querySelectorAll(".nota");

        campos.forEach(campo => {

            const nomeNota = campo.dataset.nota;

            aluno.notas[nomeNota] =
                campo.value === "" ? "" : Number(campo.value);

        });

    });

    salvarAlunos(alunos);

    mostrarToast("Notas salvas com sucesso!", "success");

    mostrarAlunosNotas();

});

btnLimparAlunos.addEventListener("click", () => {
    const confirmar = confirm("Tem certeza que deseja apagar todos os alunos cadastrados?");

    if (!confirmar) {
        return;
    }

    localStorage.removeItem("alunos");

    mostrarFrequencia();

    mostrarToast("Todos os alunos cadastrados foram removidos.", "success");
});

btnSair.addEventListener("click", () => {
    window.location.href = "login-professor.html";
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