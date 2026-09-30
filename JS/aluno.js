const nomeAluno = document.getElementById("nomeAluno");
const cursoAluno = document.getElementById("cursoAluno");
const cpfAluno = document.getElementById("cpfAluno");

const notaMarAbr = document.getElementById("notaMarAbr");
const notaMaiJun = document.getElementById("notaMaiJun");
const notaAgoSet = document.getElementById("notaAgoSet");
const notaOutNov = document.getElementById("notaOutNov");
const mediaAluno = document.getElementById("mediaAluno");

const presencasAluno = document.getElementById("presencasAluno");
const faltasAluno = document.getElementById("faltasAluno");
const frequenciaAluno = document.getElementById("frequenciaAluno");

const posicaoRanking = document.getElementById("posicaoRanking");
const btnSairAluno = document.getElementById("btnSairAluno");

const cpfLogado = sessionStorage.getItem("cpfAlunoLogado");

if (!cpfLogado) {
    window.location.href = "login-aluno.html";
}

const alunos = JSON.parse(localStorage.getItem("alunos")) || [];
const aluno = alunos.find(aluno => aluno.cpf === cpfLogado);

if (!aluno) {
    sessionStorage.removeItem("cpfAlunoLogado");
    window.location.href = "login-aluno.html";
}

nomeAluno.textContent = aluno.nome;
cursoAluno.textContent = aluno.curso;
cpfAluno.textContent = formatarCPF(aluno.cpf);

const notas = aluno.notas || {
    marAbr: "",
    maiJun: "",
    agoSet: "",
    outNov: ""
};

notaMarAbr.textContent = formatarNota(notas.marAbr);
notaMaiJun.textContent = formatarNota(notas.maiJun);
notaAgoSet.textContent = formatarNota(notas.agoSet);
notaOutNov.textContent = formatarNota(notas.outNov);

const valoresNotas = [
    notas.marAbr,
    notas.maiJun,
    notas.agoSet,
    notas.outNov
];

const notasLancadas = valoresNotas.filter(nota => nota !== "" && nota !== null && nota !== undefined);

if (notasLancadas.length > 0) {
    const soma = notasLancadas.reduce((total, nota) => total + Number(nota), 0);
    const media = soma / notasLancadas.length;
    mediaAluno.textContent = media.toFixed(1).replace(".", ",");
} else {
    mediaAluno.textContent = "—";
}

const presencas = Number(aluno.frequencia?.presencas) || 0;
const faltas = Number(aluno.frequencia?.faltas) || 0;
const totalAulas = presencas + faltas;

let porcentagem = 0;

if (totalAulas > 0) {
    porcentagem = (presencas / totalAulas) * 100;
}

presencasAluno.textContent = presencas;
faltasAluno.textContent = faltas;
frequenciaAluno.textContent = porcentagem.toFixed(1).replace(".", ",") + "%";

mostrarPosicaoRanking();

function formatarNota(nota) {
    if (nota === "" || nota === null || nota === undefined) {
        return "—";
    }

    return Number(nota).toFixed(1).replace(".", ",");
}

function formatarCPF(cpf) {
    if (!cpf || cpf.length !== 11) {
        return cpf;
    }

    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

function mostrarPosicaoRanking() {
    const alunosCurso = alunos.filter(alunoCurso =>
        alunoCurso.curso === aluno.curso
    );

    const alunosAvaliados = alunosCurso.map(alunoCurso => {
        if (!alunoCurso.notas) {
            return null;
        }

        const notasAluno = [
            alunoCurso.notas.marAbr,
            alunoCurso.notas.maiJun,
            alunoCurso.notas.agoSet,
            alunoCurso.notas.outNov
        ];

        if (notasAluno.some(nota =>
            nota === "" ||
            nota === null ||
            nota === undefined
        )) {
            return null;
        }

        const soma = notasAluno.reduce(
            (total, nota) => total + Number(nota),
            0
        );

        return {
            cpf: alunoCurso.cpf,
            media: soma / 4
        };
    }).filter(alunoCurso =>
        alunoCurso !== null &&
        !Number.isNaN(alunoCurso.media)
    );

    alunosAvaliados.sort((a, b) => b.media - a.media);

    const posicao = alunosAvaliados.findIndex(alunoCurso =>
        alunoCurso.cpf === aluno.cpf
    );

    if (posicao === -1) {
        posicaoRanking.textContent = "Sua posição aparecerá após o lançamento das quatro notas.";
        return;
    }

    posicaoRanking.textContent = `${posicao + 1}º lugar no curso de ${aluno.curso}.`;
}

btnSairAluno.addEventListener("click", () => {
    sessionStorage.removeItem("cpfAlunoLogado");
    window.location.href = "login-aluno.html";
});