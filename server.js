const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Rota de teste para garantir que o servidor está funcionando
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Rota para enviar o e-mail
app.post('/send-email', async (req, res) => {
  const { nome, email, telefone, assunto, dataInicio, dataFim, origem, destino, numeroPessoas, orcamento, mensagem } = req.body;

  // Configurações do Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Opções de e-mail
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.RECEIVER_EMAIL,
    subject: `Novo pedido de orçamento de ${nome}`,
    text: `
      Nome: ${nome}
      E-mail: ${email}
      Telefone: ${telefone}
      Assunto: ${assunto}
      Data de Início: ${dataInicio}
      Data de Fim: ${dataFim}
      Origem: ${origem}
      Destino: ${destino}
      Número de Pessoas: ${numeroPessoas}
      Orçamento: R$${orcamento}
      Mensagem: ${mensagem}
    `,
  };

  try {
    // Enviar e-mail
    await transporter.sendMail(mailOptions);
    res.status(200).send('E-mail enviado com sucesso!');
  } catch (error) {
    res.status(500).send('Erro ao enviar e-mail.');
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
