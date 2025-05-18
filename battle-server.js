const express = require('express');
const { BattleStream, getPlayerStreams } = require('./sim/battle-stream');
const { Teams } = require('./sim/teams');

const app = express();
app.use(express.json());

app.post('/start-battle', async (req, res) => {
  const { player1, player2 } = req.body;

  if (!player1 || !player2) {
    return res.status(400).json({ error: 'Ambos os times são obrigatórios.' });
  }

  const battleStream = new BattleStream();
  const streams = getPlayerStreams(battleStream);

  // Formato genérico, pode mudar para outro como 'gen8randombattle'
  const format = 'gen9ou';

  streams.p1.write(`>start {"formatid":"${format}"}`);
  streams.p1.write(`>player p1 {"name":"Player 1","team":"${Teams.pack(player1)}"}`);
  streams.p2.write(`>player p2 {"name":"Player 2","team":"${Teams.pack(player2)}"}`);

  let result = '';
  for await (const chunk of battleStream) {
    result += chunk;
  }

  res.send(`<pre>${result}</pre>`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor de batalha ativo na porta ${port}`);
});
