

  import express, { response } from "express";
  import cors from "cors";
  import { promises as fs } from "node:fs";
  
  const PORT = 3333;
  const DATABASE_URL = "./database/bustrack.json";
  
  const app = express();
  
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    })
  );
  app.use(express.json());


app.post("/motoristas", async (request, response) => {
  const { nome, carteira_habilitacao, data_nascimento, onibus_id } = request.body;

  if (!nome || !carteira_habilitacao || !data_nascimento) {
    return response.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser preenchidos." });
  }

  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const db = JSON.parse(data);

    const novoMotorista = {
      id: db.motoristas.length + 1,
      nome,
      carteira_habilitacao,
      data_nascimento,
      onibus_id: onibus_id || null,
    };

    db.motoristas.push(novoMotorista);
    await fs.writeFile(DATABASE_URL, JSON.stringify(db, null, 2));

    response.status(201).json({ mensagem: "Motorista cadastrado com sucesso", motorista: novoMotorista });
  } catch (err) {
    response.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

app.post("/onibus", async (request, response) => {
  const { placa, modelo, ano_fabricacao, capacidade, motorista_id } = request.body;

  if (!placa || !modelo || !ano_fabricacao || !capacidade) {
    return response.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser preenchidos." });
  }

  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const db = JSON.parse(data);

    const novoOnibus = {
      id: db.onibus.length + 1,
      placa,
      modelo,
      ano_fabricacao,
      capacidade,
      motorista_id: motorista_id || null,
    };

    db.onibus.push(novoOnibus);
    await fs.writeFile(DATABASE_URL, JSON.stringify(db, null, 2));

    response.status(201).json({ mensagem: "Ônibus cadastrado com sucesso", onibus: novoOnibus });
  } catch (err) {
    response.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});


app.get("/motoristas", async (request, response) => {
  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const db = JSON.parse(data);
    response.status(200).json(db.motoristas);
  } catch (err) {
    response.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

app.get("/onibus", async (request, response) => {
  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const db = JSON.parse(data);
    response.status(200).json(db.onibus);
  } catch (err) {
    response.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});


app.get("/onibus/:id/motorista", async (request, response) => {
  const id = parseInt(request.params.id); 

  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8");
    const db = JSON.parse(data);

    const onibus = db.onibus.find((busao) => busao.id === id);
    if (!onibus) return response.status(404).json({ mensagem: "Ônibus não encontrado" });

    const motorista = db.motoristas.find((motor) => motor.id === onibus.motorista_id) || null;

    response.status(200).json({ ...onibus, motorista });
  } catch (err) {
    response.status(500).json({ mensagem: "Erro interno no servidor" });
  }
});

app.listen(PORT, () => {
    console.log("Servido Iniciado na porta: "+PORT);
  });