import express from 'express' 
import cors from 'cors'
import fs from "node:fs"

const app = express()

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use(express.json())
const PORT = 3333
const url_database = "./database/participantes.json"


app.listen(PORT, () => {
    console.log('Servidor iniciado na porta', PORT)
})

const participantes = []


//cadastro
    app.post('/participantes', (request, response) => {
        const { nome, email, senha, idade, cidade } = request.body;
    
        if(!nome || typeof nome !== 'string' || nome.trim() === ''){
            return response.status(400).json({mensagem:"O campo 'nome' é obrigatório e deve ser um texto"});
        }
    
        if(!email || typeof email !== 'string' || email.trim() === ''){
            return response.status(400).json({mensagem:"O campo 'email' é obrigatório e deve ser um texto"});
        }
    
        if(!senha || typeof senha !== 'string'){
            return response.status(400).json({mensagem:"O campo 'senha' é obrigatório e deve ser um texto"});
        }
    
        if (!idade || typeof idade !== 'number') {
            return response.status(400).json({ mensagem: "O campo 'idade' é obrigatório e deve ser um número" });
        }
    
        if(!cidade || typeof cidade !== 'string' || cidade.trim() === ''){
            return response.status(400).json({mensagem:"O campo 'cidade' é obrigatório e deve ser um texto"});
        }
    
        fs.readFile(url_database, 'utf-8', (err, data) => {
            if(err){
                return response.status(500).json({mensagem: "Erro ao ler arquivo"});
            }
    
            const participantes = JSON.parse(data);
    
            
            const emailExistente = participantes.find((pessoa) => pessoa.email === email);
            if(emailExistente){
                return response.status(400).json({mensagem: "Email já cadastrado"});
            }
    
            const novoParticipante = {
                id: Date.now().toString(),
                nome,
                email,
                senha,
                idade,
                cidade
            };
    
            participantes.push(novoParticipante);
    
            fs.writeFile(url_database, JSON.stringify(participantes, null, 6), (err) => {
                if(err){
                    return response.status(500).json({mensagem: "Erro ao cadastrar participante"});
                }
                return response.status(201).json({mensagem: "Pessoa cadastrada", data: novoParticipante});
            });
        });
    });  

//listar todos os participantes
app.get("/participantes", (request, response)=>{
    fs.readFile(url_database, 'utf-8', (err, data)=>{

        if(err){
            console.log(err)
            response.status(500).json({mensagem: "Erro ao carregar dados"})
            return
        }
        const participantes = JSON.parse(data)
        response.status(200).json({participantes})

    })
})

//listar apenas um participante especifico
app.get('/participante/:id', (request, response) => {
    const { id } = request.params

    
    fs.readFile(url_database, "utf-8", (err, data)=>{
        if(err){
            console.log('error: ',err)
            response.status(500).json({mensagem: "Erro ao ler o arquivo"})
            return
        }

        const participantes = JSON.parse(data)
        console.log('Array de participantes =>', participantes)
        const encontrarParticipantes = participantes.find((pessoa)=> pessoa.id === id)
        console.log('Participante encontrada => ', encontrarParticipantes)
        if(!encontrarParticipantes){
            response.status(404).json({mensagem: "Participante não encontrada"})
            return
        }
        response.status(200).json({mensagem:"Participante encontrada", encontrarParticipantes})
    })

    })

    //atualizar os caba

app.put('/participante/:id', (request, response) => {
    const { id } = request.params

    const {nome, email, senha, idade, cidade} = request.body

             if(!nome || typeof nome !== 'string' || nome.trim() === ''){
                response.status(400).json({mensagem:"O campo 'nome' é obrigatório e deve ser um texto"})
                return
            }
        
            if(!email || typeof email !== 'string' || email.trim() === ''){
                response
                .status(400)
                .json({mensagem:"O campo 'cargo' é obrigatório e deve ser um texto"})
                return
            }

            if(!senha){
                response.status(400).json({mensagem:"O campo 'senha' é obrigatório"})
                return
            }

            if(!idade || typeof idade !== 'number'){
                response.status(400).json({mensagem:"O campo 'idade' é obrigatório e deve ser um numero"})
                return
            }

            if(!cidade || typeof cidade !== 'string' || cidade.trim() === ''){
                response.status(400).json({mensagem:"O campo 'cidade' é obrigatório e deve ser um texto"})
                return
            }

    fs.readFile(url_database, 'utf-8', (err, data)=>{
        if(err){
            console.log(err)
            response.status(500).json({mensgem: "Erro ao ler arquivo"})
            return
        }

        const participantes = JSON.parse(data)
        const indexparticipantes = participantes.findIndex((participantes) => participantes.id === id)
        //Não encontra = undefined || Não encontra = -1
        if(indexparticipantes === -1){
            response.status(404).json({mensagem: "Pessoa não encontrada"})
            return
        }

        participantes[indexparticipantes] = {...participantes[indexparticipantes], nome, email, senha, idade, cidade} 

        fs.writeFile(url_database, JSON.stringify(participantes, null, 6), (err)=>{
            if(err){
                console.log(err)
                response.status(500).json({mensgem: "Erro ao atualizar"})
                return
            }
            response.status(200).json({mensagem: "Pessoa atualizada", pessoa: participantes[indexparticipantes]})
        })

    })
 
})

//deletar os participante

app.delete("/participante/:id", (request, response)=>{
    const {id} = request.params
    fs.readFile(url_database, "utf-8", (err, data)=>{
        if(err){
            console.log(err)
            response.status(500).json({mensagem: "Erro ao ler arquivo"})
            return
        }
        const participantes = JSON.parse(data)
        const indexparticipantes = participantes.findIndex((pessoa)=> pessoa.id === id)
        if(indexparticipantes === -1){
            response.status(404).json({mensagem: "Pessoa não encontrada"})
            return
        }

        const participantedeletado = participantes.splice(indexparticipantes, 1)[0]
        console.log(participantedeletado)

        fs.writeFile(url_database, JSON.stringify(participantes, null, 6), (err)=>{
            if(err){
                console.log(err)
                response.status(500).json({mensagem: "Erro ao salvar arquivo"})
                return
            }
            response.status(200).json({mensagem: "Pessoa Removida", pessoa: participantedeletado})
        })

    })
})

app.get('/participantes/count', (request, response) => {
    fs.readFile(url_database, 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            response.status(500).json({ mensagem: "Erro ao ler arquivo" });
            return;
        }

        const participantes = JSON.parse(data);
        response.status(200).json({ totalParticipantes: participantes.length });
    });
});

app.get('/participantes/count/over18', (request, response) => {
    fs.readFile(url_database, 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            response.status(500).json({ mensagem: "Erro ao ler arquivo" });
            return;
        }

        const participantes = JSON.parse(data);
        const over18 = participantes.filter((p) => p.idade > 18)
        console.log(over18)
        response.status(200).json({ totalParticipantes: over18.length });
    });
});

app.get('/participantes/city/most', (request, response) => {
    fs.readFile(url_database, 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
            response.status(500).json({ mensagem: "Erro ao ler arquivo" });
            return;
        }

        const participantes = JSON.parse(data);

        const cidades = participantes.reduce((arr, p) => {
            const cidade = p.cidade;
            if (!arr[cidade]) {
                arr[cidade] = 0;
            }
            arr[cidade]++;
            return arr;
        });

        let nomeCidade = null
        let numParticipantes = 0

        const objResultado = Object.entries(cidades).map(([cidade, numero]) => ({cidade, numero}))
                                                    .filter((c) => (typeof c.numero === "number") && c.cidade !== "idade")                                  
        objResultado.map((arr) => {
            if(arr.numero > numParticipantes){
                numParticipantes = arr.numero
                nomeCidade = arr.cidade
            }
        })
        const objCidade = {
            cidade: nomeCidade,
            numero: numParticipantes
        }

        response.status(200).json({mensagem: "Cidade com mais participantes", objCidade})
    });
});


