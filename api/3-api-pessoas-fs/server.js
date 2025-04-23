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
app.get("/pessoas/:id", (request, response)=>{
    const {id} = request.params

    fs.readFile(url_database, "utf-8", (err, data)=>{
        if(err){
            console.log('error: ',err)
            response.status(500).json({mensagem: "Erro ao ler o arquivo"})
            return
        }

        const pessoas = JSON.parse(data)
        console.log('Array de pessoas =>', pessoas)
        const encontrarPessoa = pessoas.find((pessoa)=>pessoa.id === id)
        console.log('Pessoa encontrada => ',encontrarPessoa)
        if(!encontrarPessoa){
            response.status(404).json({mensagem: "Pessoa não encontrada"})
            return
        }
        response.status(200).json({mensagem:"Pessoa encontrada", encontrarPessoa})
    })
})

app.put("/pessoas/:id", (request, response)=>{
    //1º Verificar se pessoa existe
    //2º Atualizar as informações das pessoas
    //3º Atualizar o arquivo .json com as novas infos
    const {id} = request.params
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
            console.log(err)
            response.status(500).json({mensgem: "Erro ao ler arquivo"})
            return
        }

        const pessoas = JSON.parse(data)
        const indexPessoa = pessoas.findIndex((pessoa) => pessoa.id === id)
        //Não encontra = undefined || Não encontra = -1
        if(indexPessoa === -1){
            response.status(404).json({mensagem: "Pessoa não encontrada"})
            return
        }

        pessoas[indexPessoa] = {...pessoas[indexPessoa], nome, cargo} //Linha de código que vai atualizar informações de usuários

        fs.writeFile(url_database, JSON.stringify(pessoas, null, 2), (err)=>{
            if(err){
                console.log(err)
                response.status(500).json({mensgem: "Erro ao atualizar"})
                return
            }
            response.status(200).json({mensagem: "Pessoa atualizada", pessoa: pessoas[indexPessoa]})
        })

    })
})

app.delete("/pessoas/:id", (request, response)=>{
    const {id} = request.params
    fs.readFile(url_database, "utf-8", (err, data)=>{
        if(err){
            console.log(err)
            response.status(500).json({mensagem: "Erro ao ler arquivo"})
            return
        }
        const pessoas = JSON.parse(data)
        const indexPessoa = pessoas.findIndex((pessoa)=> pessoa.id === id)
        if(indexPessoa === -1){
            response.status(404).json({mensagem: "Pessoa não encontrada"})
            return
        }

        const pessoaRemovida = pessoas.splice(indexPessoa, 1)[0]
        console.log(pessoaRemovida)

        fs.writeFile(url_database, JSON.stringify(pessoas, null, 2), (err)=>{
            if(err){
                console.log(err)
                response.status(500).json({mensagem: "Erro ao salvar arquivo"})
                return
            }
            response.status(200).json({mensagem: "Pessoa Removida", pessoa: pessoaRemovida})
        })

    })
})

app.listen(PORT, ()=>{
    console.log(`Servidor iniciado em  http://localhost:3333`)
})