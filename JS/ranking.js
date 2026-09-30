function mostrarRankingCurso(nomeCurso, idElemento) {

    const elementoRanking = document.getElementById(idElemento);

    if (!elementoRanking) {
        return;
    }

    elementoRanking.innerHTML = "";

    const alunos = JSON.parse(localStorage.getItem("alunos")) || [];

    const alunosCurso = alunos.filter(aluno =>
        aluno && aluno.curso === nomeCurso
    );

    const alunosAvaliados = alunosCurso
        .map(aluno => {

            if (!aluno.notas) {
                return null;
            }

            const notas = [
                aluno.notas.marAbr,
                aluno.notas.maiJun,
                aluno.notas.agoSet,
                aluno.notas.outNov
            ];

            if (notas.some(nota =>
                nota === "" ||
                nota === null ||
                nota === undefined
            )) {
                return null;
            }

            const soma = notas.reduce(
                (total, nota) => total + Number(nota),
                0
            );

            return {
                nome: aluno.nome,
                media: soma / 4
            };
        })
        .filter(aluno =>
            aluno !== null &&
            !Number.isNaN(aluno.media)
        );

    alunosAvaliados.sort((a, b) =>
        b.media - a.media
    );

    const destaques = alunosAvaliados.slice(0, 3);

    if (destaques.length === 0) {

        const mensagem = document.createElement("p");

        mensagem.className = "sem-alunos";

        mensagem.textContent =
            "Os alunos em destaque aparecerão aqui após o lançamento das notas.";

        elementoRanking.appendChild(mensagem);

        return;
    }

    const medalhas = ["🥇", "🥈", "🥉"];

    destaques.forEach((aluno, indice) => {

        const item = document.createElement("div");
        item.className = "item-ranking";

        const posicao = document.createElement("div");
        posicao.className = "posicao-ranking";
        posicao.textContent = medalhas[indice];

        const informacoes = document.createElement("div");
        informacoes.className = "info-aluno-ranking";

        const nome = document.createElement("div");
        nome.className = "nome-aluno-ranking";
        nome.textContent = aluno.nome;

        const colocacao = document.createElement("small");
        colocacao.textContent = `${indice + 1}º lugar`;

        const media = document.createElement("div");
        media.className = "media-ranking";
        media.textContent = aluno.media.toFixed(1);

        informacoes.appendChild(nome);
        informacoes.appendChild(colocacao);

        item.appendChild(posicao);
        item.appendChild(informacoes);
        item.appendChild(media);

        elementoRanking.appendChild(item);
    });
}

function atualizarRankings() {

    mostrarRankingCurso("Inglês", "rankingIngles");
    mostrarRankingCurso("Espanhol", "rankingEspanhol");
    mostrarRankingCurso("Francês", "rankingFrances");
    mostrarRankingCurso("Japonês", "rankingJapones");
}

atualizarRankings();