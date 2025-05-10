
import express, { response } from "express";
import cors from "cors";
import { promises as fs } from "node:fs";
import { resolve } from "node:path";

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
  const { nome, data_nascimento, carteira_habilitacao } = request.body

  if (!nome) {
    response.status(400).json({ mensagem: "Nome é obrigatório" })
    return
  }

  if (!data_nascimento) {
    response.status(400).json({ mensagem: "Data de nascimento é obrigatória" })
    return
  }

  if (!carteira_habilitacao) {
    response.status(400).json({ mensagem: "Carteira de habilitação é obrigatória" })
    return
  }

  const novoMotorista = {
    id_motorista: Date.now().toString(),
    nome,
    data_nascimento,
    carteira_habilitacao,
    onibus_id: 0
  }

  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8")
    const db = await JSON.parse(data)
    //{ [], [] } Temos 2 arrays diferentes na base de dados por isso fazemos de uma maneira diferente
    //[].push | logo usamos "db.motorista" para acessar um array especifico

    db.motoristas.push(novoMotorista)

    await fs.writeFile(DATABASE_URL, JSON.stringify(db /*Devemos passar db pois ele que contem todas as informações dos arrays, se passarmos "novoMotorista" irá formatar a base de daods*/, null, 2))
    response.status(201).json({ mensagem: "Cadastrado", novoMotorista })
  } catch (error) {
    console.log(error)
    response.status(500).json({ mensagem: "Internal server error" })
  }
})

app.post("/onibus", async (request, response) => {
  const {placa, modelo, ano_fabricacao, capacidade} = request.body

  if (!placa) {
    response.status(400).json({ mensagem: "Placa é obrigatório" })
    return
  }

  if (!modelo) {
    response.status(400).json({ mensagem: "Modelo é obrigatório" })
    return
  }

  if (!ano_fabricacao) {
    response.status(400).json({ mensagem: "Ano de fabricação é obrigatório" })
    return
  }

  if (!capacidade) {
    response.status(400).json({ mensagem: "Capacidade é obrigatório" })
    return
  }

  const novoOnibus = {
    id_onibus: Date.now().toString(),
    placa,
    modelo,
    ano_fabricacao,
    capacidade,
    motorista_id: 0
  }

  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8")
    const db = await JSON.parse(data)
    //{ [], [] } Temos 2 arrays diferentes na base de dados por isso fazemos de uma maneira diferente
    //[].push | logo usamos "db.onibus" para acessar um array especifico

    db.onibus.push(novoOnibus)

    await fs.writeFile(DATABASE_URL, JSON.stringify(db /*Devemos passar db pois ele que contem todas as informações dos arrays, se passarmos "novoOnibus" irá formatar a base de daods*/, null, 2))
    response.status(201).json({ mensagem: "Cadastrado", novoOnibus })
  } catch (error) {
    console.log(error)
    response.status(500).json({ mensagem: "Internal server error" })
  }
})

app.get("/motoristas", async (request, response) => {
  try {
    const data = await fs.readFile(DATABASE_URL, 'utf-8')
    const db = await JSON.parse(data)
    const listaMotoristas = db.motoristas
    response.status(200).json({ listaMotoristas })
  } catch (error) {
    console.log(error)
    response.status(500).json({ mensagem: "Internal server error" })
  }
})

app.get("/onibus", async (request, response) => {
  try {
    const data = await fs.readFile(DATABASE_URL, 'utf-8')
    const db = await JSON.parse(data)
    response.status(200).json({onibus: db.onibus})
  } catch (error) {
    console.log(error)
    response.status(500).json({ mensagem: "Internal server error" })
  }
})

app.put("/motoristas/:id/onibus", async (request, response) => {
  const { id } = request.params
  const { onibus_id } = request.body

  if(!onibus_id){
    response.status(400).json({mensagem:"ID do ônibus é obrigatório"})
    return
  }


  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8")
    const db = await JSON.parse(data)

    const motorista = db.motoristas.find((motorista) => motorista.id_motorista === id)
    const onibus = db.onibus.find((onibus) => onibus.id_onibus === onibus_id)

    if(!motorista || !onibus){
    response.status(400).json({mensagem:"Motorista ou ônibus inválido"})
    return
  }

  motorista.onibus_id = onibus_id
  onibus.motorista_id = id
    
    await fs.writeFile(DATABASE_URL, JSON.stringify(db, null, 2))
    response.status(201).json({mensagem:"Vinculo realizado"})
  } catch (error) {
    
  }

})

app.get("/onibus/:id/motorista", async (request, response) => {
  const { id } = request.params

  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8")
    const db = await JSON.parse(data)

    const encontrarOnibus = db.onibus.find((onibus) => onibus.id_onibus === id)
    if(!encontrarOnibus){
      response.status(404).json({mensagem:"Ônibus não encontrado"})
      return
    }
    //Tem ônibus
    const infoMotorista = db.motoristas.find((motorista) => motorista.id_motorista === encontrarOnibus.motorista_id) // ver se o motorista está vinculado ao onibus

    const infoMotoristaOnibus = {
      "Ônibus":encontrarOnibus,
      "Motorista": infoMotorista == undefined ? "Não existe vinculo":infoMotorista
    }

    response.status(200).json(infoMotoristaOnibus)

  } catch (error) {
    console.log(error)
    response.status(500).json({mensagem:"Internal server error"})
  }
})

app.delete("/onibus/:id/motorista", async (request, response) => {
  const { id } = request.params
  
  try {
    const data = await fs.readFile(DATABASE_URL, "utf-8")
    const db = await JSON.parse(data)

    const encontrarOnibus = db.onibus.find((onibus) => onibus.id_onibus === id)

    if(!encontrarOnibus){
      response.status(404).json({mensagem:"Ônibus não encontrado"})
      return
    }

    const encontrarVinculoMotorista = db.motoristas.find((motorista) => motorista.id_motorista ===  encontrarOnibus.motorista_id)
    
    if(!encontrarVinculoMotorista){
      response.status(404).json({mensagem:"Não existe motorista para esse ônibus"})
      return
    }

    encontrarOnibus.motorista_id = 0
    encontrarVinculoMotorista.onibus_id = 0

    await fs.writeFile(DATABASE_URL, JSON.stringify(db, null , 2))

    response.status(200).json({mensgaem:"Ônibus desvinculado de motorista"})
  } catch (error) {
    console.log(error)
    response.status(500).json({mensagem:"Internal server error"})
  }
})

// app.post("/motoristas", async (request, response) => {
//   const { nome, carteira_habilitacao, data_nascimento, onibus_id } = request.body;

//   if (!nome || !carteira_habilitacao || !data_nascimento) {
//     return response.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser preenchidos." });
//   }

//   try {
//     const data = await fs.readFile(DATABASE_URL, "utf-8");
//     const db = JSON.parse(data);

//     const novoMotorista = {
//       id: db.motoristas.length + 1,
//       nome,
//       carteira_habilitacao,
//       data_nascimento,
//       onibus_id: onibus_id || null,
//     };

//     db.motoristas.push(novoMotorista);
//     await fs.writeFile(DATABASE_URL, JSON.stringify(db, null, 2));

//     response.status(201).json({ mensagem: "Motorista cadastrado com sucesso", motorista: novoMotorista });
//   } catch (err) {
//     response.status(500).json({ mensagem: "Erro interno no servidor" });
//   }
// });

// app.post("/onibus", async (request, response) => {
//   const { placa, modelo, ano_fabricacao, capacidade, motorista_id } = request.body;

//   if (!placa || !modelo || !ano_fabricacao || !capacidade) {
//     return response.status(400).json({ mensagem: "Todos os campos obrigatórios devem ser preenchidos." });
//   }

//   try {
//     const data = await fs.readFile(DATABASE_URL, "utf-8");
//     const db = JSON.parse(data);

//     const novoOnibus = {
//       id: db.onibus.length + 1,
//       placa,
//       modelo,
//       ano_fabricacao,
//       capacidade,
//       motorista_id: motorista_id || null,
//     };

//     db.onibus.push(novoOnibus);
//     await fs.writeFile(DATABASE_URL, JSON.stringify(db, null, 2));

//     response.status(201).json({ mensagem: "Ônibus cadastrado com sucesso", onibus: novoOnibus });
//   } catch (err) {
//     response.status(500).json({ mensagem: "Erro interno no servidor" });
//   }
// });


// app.get("/motoristas", async (request, response) => {
//   try {
//     const data = await fs.readFile(DATABASE_URL, "utf-8");
//     const db = JSON.parse(data);
//     response.status(200).json(db.motoristas);
//   } catch (err) {
//     response.status(500).json({ mensagem: "Erro interno no servidor" });
//   }
// });

// app.get("/onibus", async (request, response) => {
//   try {
//     const data = await fs.readFile(DATABASE_URL, "utf-8");
//     const db = JSON.parse(data);
//     response.status(200).json(db.onibus);
//   } catch (err) {
//     response.status(500).json({ mensagem: "Erro interno no servidor" });
//   }
// });


// app.get("/onibus/:id/motorista", async (request, response) => {
//   const id = parseInt(request.params.id);

//   try {
//     const data = await fs.readFile(DATABASE_URL, "utf-8");
//     const db = JSON.parse(data);

//     const onibus = db.onibus.find((busao) => busao.id === id);
//     if (!onibus) return response.status(404).json({ mensagem: "Ônibus não encontrado" });

//     const motorista = db.motoristas.find((motor) => motor.id === onibus.motorista_id) || null;

//     response.status(200).json({ ...onibus, motorista });
//   } catch (err) {
//     response.status(500).json({ mensagem: "Erro interno no servidor" });
//   }
// });

app.listen(PORT, () => {
  console.log("Servido Iniciado na porta: " + PORT);
});