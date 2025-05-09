import express from "express";
import cors from "cors";
import { promises as fs } from "node:fs";

const PORT = 3333;
const DATABASE_URL = "./database/participantes.json";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/participants", async (request, response) => {
  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const participants = await JSON.parse(data);

    response.status(200).json({ participants });
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "Internal server error" });
  }
});

app.get("/participants/count", async (request, response) => {
  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const participants = await JSON.parse(data);

    response.status(200).json({ quantidadeParticipantes: participants.length });
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "Internal server error" });
  }
});

app.get("/participants/count/over18", async (request, response) => {
  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const participants = await JSON.parse(data);

    const participantAge18 = participants.filter(
      (participant) => participant.age >= 18
    );

    if (participantAge18.length === 0) {
      response.status(200).json({
        mensagem: "Nenhum participante maior de idade foi encontrado",
      });
      return;
    }
    response.status(200).json({ participantes: participantAge18.length });
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "internal server error" });
  }
});

app.get("/participants/city/most", async (request, response) => {
  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const participantes = await JSON.parse(data);

    //acc[participante]- Acessa o contador da cidade participante atual
    // || 0: se a cidade não existir no acc, contador começa com 0
    // + 1: incrementa 1, se encontrar mais em uma cidade
    const contarCidades = participantes.reduce((acc, participante) => {
      acc[participante.city] = (acc[participante.city] || 0) + 1;
      return acc;
    }, {});
    console.log(contarCidades);

    // -> [[],[]]
    let quantidadeDeParticipantesDaCidade = 0;
    let cidadeComMaiorNumeroDeParticipante = "";
    Object.entries(contarCidades).forEach(([city, count]) => {
      //Maceió, 2
      //Arapiraca, 1
      // console.log("-", city, count)
      if (count > quantidadeDeParticipantesDaCidade) {
        quantidadeDeParticipantesDaCidade = count;
        cidadeComMaiorNumeroDeParticipante = city;
      }
    });
    console.log(
      cidadeComMaiorNumeroDeParticipante,
      quantidadeDeParticipantesDaCidade
    );

    response.status(200).json({
      Cidade: cidadeComMaiorNumeroDeParticipante,
      Quantidade: quantidadeDeParticipantesDaCidade,
    });
  } catch (error) {
    console.log(error)
    response.status(500).json({mensagem:"Internal server error"})
  }
});

app.post("/participants", async (request, response) => {
  const { name, email, password, age, city } = request.body;

  if (!name) {
    response.status(400).json({ mensagem: "Nome é obrigatório" });
    return;
  }
  if (!email) {
    response.status(400).json({ mensagem: "Email é obrigatório" });
    return;
  }
  if (!password) {
    response.status(400).json({ mensagem: "Senha é obrigatória" });
    return;
  }
  if (!age) {
    response.status(400).json({ mensagem: "Idade é obrigatório" });
    return;
  }
  if (!city) {
    response.status(400).json({ mensagem: "Cidade é obrigatória" });
    return;
  }

  if (age < 16) {
    response.status(401).json({ mensagem: "Idade não permitida" });
    return;
  }

  const participant = {
    id: Date.now().toString(),
    name,
    email,
    password,
    age,
    city,
  };

  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const participants = await JSON.parse(data);
    //[]
    const findParticipant = participants.find(
      (participant) => participant.email === email
    );
    //[obj.email === email] = true || false
    if (findParticipant) {
      response.status(401).json({ mensagem: "E-mail já está em uso" });
      return;
    }

    //[].push(participant)
    participants.push(participant);
    //[{participant}]

    await fs.writeFile(DATABASE_URL, JSON.stringify(participants, null, 2));
    response
      .status(201)
      .json({ mensagem: "Participante cadastrado", participant });
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "Internal server error" });
  }
});

app.get("/participants/:id", async (request, response) => {
  const { id } = request.params; //{ id:'10'}

  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const participants = await JSON.parse(data);

    const findParticipant = participants.find(
      (participant) => participant.id === id
    );
    if (!findParticipant) {
      response.status(404).json({ mensagem: "Participante não encontrado" });
      return;
    }

    response.status(200).json({ findParticipant });
  } catch (error) {
    console.log(error);
    response.status(500).json({ mensagem: "Internals server error" });
  }
});

app.put("/participants/:id", async (request, response) => {
  const { id } = request.params;
  const { name, email, password, age, city } = request.body;

  if (!name) {
    response.status(400).json({ mensagem: "Nome é obirgatório" });
    return;
  }
  if (!email) {
    response.status(400).json({ mensagem: "Email é obirgatório" });
    return;
  }
  if (!password) {
    response.status(400).json({ mensagem: "Senha é obirgatório" });
    return;
  }
  if (!age) {
    response.status(400).json({ mensagem: " Idade é obirgatória" });
    return;
  }
  if (!city) {
    response.status(400).json({ mensagem: "Cidade é obirgatória" });
    return;
  }
  if (age < 16) {
    response.status(401).json({ mensagem: " Idade não permitida" });
    return;
  }

  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const participants = await JSON.parse(data);
    //[3 => atualizado]
    //1º encontrar a posição o participante
    const indexParticipant = participants.findIndex(
      (participant) => participant.id === id
    );
    if (indexParticipant === -1) {
      response.status(404).json({ mensagem: "Participante não encontrado" });
      return;
    }

    //2º Validar a existencia de Email
    const emailParticipante = participants.find(
      (participant) => participant.email === email && participant.id !== id
    );

    if (emailParticipante) {
      response.status(409).json({ mensagem: "Este e-mail já está em uso" });
      return;
    }

    participants[indexParticipant] = {
      ...participants[indexParticipant],
      name,
      email,
      password,
      age,
      city,
    };
  } catch (error) {
    console.log(error);
  }
});

app.delete("/participants/:id", async (request, response) => {
  const id = request.params.id; //{id: 2}

  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const participantes = await JSON.parse(data);

    //[{}, {}, {}]
    const posicaoParticipante = participantes.findIndex((participante)=> participante.id === id)
    if(posicaoParticipante === -1){
      response.status(404).json({mensagem:"Participante não encontrado"})
      return
    }

    participantes.splice(posicaoParticipante, 1)

    await fs.writeFile(DATABASE_URL, JSON.stringify(participantes, null, 2))
    response.status(200).json({mensagem: "Participante excluído"})

  } catch (error) {
    console.log(error)
    response.status(500).json({mensagem:"Internal server error"})
  }

});

app.listen(PORT, () => {
  console.log("Servido Iniciado na porta: " + PORT);
});
