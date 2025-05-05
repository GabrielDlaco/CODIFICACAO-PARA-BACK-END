import express from "express"
import cors from "cors"
import fs from "node:fs"
import { stringify } from "node:querystring"

const app = express()
const PORT = 3333
const url_database = "./database/motoristas.json"

app.use(express.json())

app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: '*',
    credentials: true
}))

const motoristas = []
const onibus = []

app.post("/motoristas", (req, res) => {
    

    const {nome, dataNascimento, carteiraHabilitacao} = req.body

    if(!nome || typeof nome !== 'string' || nome.trim() === ''){
        res.status(400).json({mensagem: "Nome é obrigatório"})
        return
    }

    if(!dataNascimento || typeof dataNascimento !== 'string' || dataNascimento.trim() === ''){
        res.status(400).json({mensagem: "Data de nascimento é obrigatória"})
        return
    }

    if(!carteiraHabilitacao || typeof carteiraHabilitacao !== 'string' || carteiraHabilitacao.trim() === '' || carteiraHabilitacao.length !== 12){
        res.status(400).json({mensagem: "Carteira de habilitação é obrigatória"})
        return
    }

    fs.readFile(url_database, "utf-8", (err, data) => {

        if(err){
            console.log(err)
            res.status(500).json({mensagem: "Erro ao ler o arquivo"})
            return
        }


        const motorista = {
            id: Date.now().toString(),
            nome,
            dataNascimento,
            carteiraHabilitacao
        }

        motoristas.push(motorista)

        fs.writeFile(url_database, JSON.stringify(motoristas, null, 6), (err) => {
            if(err){
                res.status(500).json({mensagem: "Erro ao cadastrar motorista"})
                return
            }

            const motoristas = JSON.parse(data)

            res.status(200).json({mensagem: "Motorista Cadastrado: ", data: motorista})
        })
    })

})
app.post("/onibus", (req, res) => {
    if(!motoristas){
        res.status(400).json({mensagem: "Não é possível cadastrar um ônibus sem um motorista cadastrado"})
        return
    }

    const {placa, modelo, anoFabricacao, capacidade} = req.body

    if(!placa || typeof placa !== 'string' || placa.trim() === ''){
        res.status(400).json({mensagem: "A placa do ônibus é obrigatória"})
        return
    }

    if(!modelo || typeof modelo !== 'string' || modelo.trim() === ''){
        res.status(400).json({mensagem: "O modelo do ônibus é obrigatório"})
        return
    }

    if(!anoFabricacao || typeof anoFabricacao !== 'number'){
        res.status(400).json({mensagem: "O ano de fabricação do ônibus é obrigatório"})
        return
    }

    if(!capacidade || typeof capacidade !== 'number'){
        res.status(400).json({mensagem: "A capacidade do ônibus é obrigatória"})
        return
    }

    fs.readFile(url_database, 'utf-8' ,(err, data) => {
        if(err){
            res.status(500).json({mensagem: "Erro ao ler o arquivo"})
            return
        }

        const novoOnibus = {
            id: Date.now().toString(),
            placa,
            modelo,
            anoFabricacao,
            capacidade
        }

        onibus.push(novoOnibus)
        
        fs.writeFile(url_database, JSON.stringify(onibus, null, 6), (err) => {
            if(err){
                res.status(500).json({mensagem: "Erro ao cadastrar onibus"})
            }
            res.status(200).json({mensagem: "Ônibus cadastrado: ", data: novoOnibus})
        })
    })
})

 app.get("/motoristas", (request, response) => {})
 app.get('/onibus', (request, response) => {})
// app.get()
// app.put()
// app.delete()

app.listen(PORT, () => {
    console.log(`Servidor iniciado em http://localhost:${PORT}`)
})