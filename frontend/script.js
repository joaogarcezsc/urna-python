let meuGrafico = null;

function atualizarApuracao() {
  fetch("http://127.0.0.1:8000/listar")
    .then((resposta) => resposta.json())
    .then((votosBrutos) => {
      console.log("Dados brutos recebidos do banco:", votosBrutos);

      let contagem = {
        professora: 0,
        engenheiro: 0,
        medica: 0,
        advogado: 0,
        branco: 0,
        nulo: 0,
      };

      votosBrutos.forEach((voto) => {
        if (voto.numero_candidato === 19) {
          contagem.professora++;
        } else if (voto.numero_candidato === 26) {
          contagem.engenheiro++;
        } else if (voto.numero_candidato === 75) {
          contagem.medica++;
        } else if (voto.numero_candidato === 89) {
          contagem.advogado++;
        } else if (voto.numero_candidato === 0) {
          contagem.branco++;
        } else {
          contagem.nulo++;
        }
      });

      desenharGrafico(contagem);
    })
    .catch((erro) => {
      console.error("Erro ao buscar dados da API:", erro);
    });
}

function desenharGrafico(dadosContados) {
  const canvasElement = document.getElementById("graficoVotos");

  if (!canvasElement) {
    console.error(
      "Erro: Não encontrei nenhum <canvas> com o id 'graficoVotos' no seu HTML!",
    );
    return;
  }

  const ctx = canvasElement.getContext("2d");

  console.log("Desenhando gráfico com os dados:", dadosContados);

  if (meuGrafico) {
    meuGrafico.destroy();
  }

  meuGrafico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
        "Professora (19)",
        "Engenheiro (26)",
        "Médica (75)",
        "Advogado (90)",
        "Brancos",
        "Nulos",
      ],
      datasets: [
        {
          label: "Total de Votos",
          data: [
            dadosContados.professora,
            dadosContados.engenheiro,
            dadosContados.medica,
            dadosContados.advogado,
            dadosContados.branco,
            dadosContados.nulo,
          ],
          backgroundColor: [
            "#4e73df",
            "#1cc88a",
            "#36b9cc",
            "#f6c23e",
            "#a6a6a6",
            "#e74a3b",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });
}

atualizarApuracao();

function zerarVotacao() {
  // Um aviso de segurança para você não clicar sem querer
  if (
    confirm(
      "Deseja mesmo apagar todos os votos do banco de dados para a apresentação?",
    )
  ) {
    fetch("http://127.0.0.1:8000/reset", {
      method: "POST", // Dispara a rota que criamos no Python
    })
      .then((resposta) => resposta.json())
      .then((dados) => {
        alert(dados.mensagem); // Mostra o aviso de sucesso na tela
        atualizarApuracao(); // Atualiza o gráfico na hora (ele vai sumir/zerar)
      })
      .catch((erro) => console.error("Erro ao zerar votação:", erro));
  }
}
