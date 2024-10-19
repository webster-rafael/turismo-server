const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Rota de teste
app.get("/", (req, res) => {
  res.send("Servidor funcionando!");
});

// Rota para enviar o e-mail
app.post("/send-email", async (req, res) => {
  const {
    nome,
    email,
    telefone,
    assunto,
    dataInicio,
    dataFim,
    origem,
    destino,
    numeroPessoas,
    orcamento,
    mensagem,
  } = req.body;

  // Configurações do Nodemailer
  const transporter = nodemailer.createTransport({
    host: "216.172.172.249", // Servidor de saída
    port: 465, // Porta para SSL
    secure: true, // Usar SSL
    auth: {
      user: "contato@turismociabrasil.com.br",
      pass: "@Duda2507",
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error("Erro ao verificar o transporte:", error);
    } else {
      console.log("Transporte configurado corretamente");
    }
  });

  // Opções de e-mail
  const mailOptions = {
    from: email, // Remetente (pode ser o mesmo da variável de ambiente)
    to: "contato@turismociabrasil.com.br", // Destinatário
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
    res.status(200).send("E-mail enviado com sucesso!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao enviar e-mail.");
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
