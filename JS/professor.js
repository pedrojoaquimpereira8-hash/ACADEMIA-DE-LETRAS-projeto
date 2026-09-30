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