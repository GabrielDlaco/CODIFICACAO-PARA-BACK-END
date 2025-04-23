import express from 'express'
import cors from 'cors'
import fs from "node:fs"

const PORT = 3333
const url_database = "./database/pessoas.json"

const app = express()
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use(express.json())
//1º passo - verificar/selecionar o arquivo.json(neste caso pessoas.json)
//2º passo - Mostrar/cadastrar informações
//3º passo - devolver um resposta

app.get("/pessoas", (request, response)=>{
    fs.readFile(url_database, 'utf-8', (err, data)=>{ //O read recebe 3 parametros ele irá ler os arquivos se ele não conseguir ler os arquivos irá para "err" e se ele ler irá retornar seus dados em "data" || URL, DICIONÁRIO E FUNÇÃO DE CALLBACK

        if(err){
            console.log(err)
            response.status(500).json({mensagem: "Erro ao carregar dados"})
            return
        }
        const pessoas = JSON.parse(data)
        response.status(200).json({pessoas})

    })
})
app.post("/pessoas", (request, response)=>{
    /**
     * 1º - Receber/validar os dados da requisição
     * 2º - Ler a minha base de dados para pegar os dados
     * 3º - Transformar os dados em json
     * 4º - Montar um objeto com os dados da requisição
     * 5º - Adiconar o objeto nos dados da requisição
     * 6º - Adicionar os dados atualizados no banco de dados
     */
    const {nome, cargo} = request.body

    if(!nome || typeof nome !== 'string' || nome.trim() === ''){
        response.status(400).json({mensagem:"O campo 'nome' é obrigatório e deve ser um texto"})
        return
    }

    if(!cargo || typeof cargo !== 'string' || cargo.trim() === ''){
        response
        .status(400)
        .json({mensagem:"O campo 'cargo' é obrigatório e deve ser um texto"})
        return
    }

    fs.readFile(url_database, 'utf-8', (err, data)=>{
        if(err){
            response.status(500).json({mensagem: "Erro ao ler arquivo"})
        }

        const pessoas = JSON.parse(data)//Transformar em obj

        const novaPessoa = {
            id: Date.now().toString(),
            nome,
            cargo
        }

        pessoas.push(novaPessoa)
        fs.writeFile(url_database, JSON.stringify(pessoas,null, 2), (err)=>{
            if(err){
                response.status(500).json({mensagem: "Erro ao cadastrar pessoa"})
                return
            }
            response.status(201).json({mensagem: "Pessoa cadastrada", data: novaPessoa});
        })

    })
});
app.get("/pessoas", (request, response)=>{})
app.put("/pessoas", (request, response)=>{})
app.delete("/pessoas", (request, response)=>{})

app.listen(PORT, ()=>{
    console.log(`Servidor iniciado em  http://localhost:3333`)
})