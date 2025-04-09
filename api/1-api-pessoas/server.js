import express from 'express'
import { v4 as uuidv4 } from 'uuid';

const PORT = 3333

const app = express()

//OBRIGATÓRIO PARA RECEBER REQUISIÇÃO JSON
app.use(express.json())

const pessoas = []

//Buscar pessoas cadastradas
app.get('/pessoas', (request, response)=>{
    response.status(200).json(pessoas)
})

//Buscar uma pessoa
app.post('/pessoas', (request, response)=>{
    const {nome, cargo} = request.body

    if(!nome){
        response.status(400).json({mensagem: 'Nome é obrigatório'}) //Caso o seguinte erro apareça no console após testar as informações no thunder client: "Cannot set headers after they are sent to the client", está mensagem diz que não podemos usar mandar 2 mensagens de uma vez, logo preisamos usar o "return" para mandar uma mensagem de cada vez.
        return
    }
    if(!cargo){
        response.status(400).json({mensagem: 'Cargo é obrigatório'})
        return
    }

    const pessoa = {
        id: uuidv4(),
        nome,
        cargo
    }

    pessoas.push(pessoa)//Para adicionar um item ao array (pessoas)
    response.status(201).json({mensagem: "Cadastro realizado com sucesso", pessoa})
})

//Buscar uma única pessoa
app.get('/pessoas/:id', (request, response)=>{
    response.status(200).json({rota: 'GET /pessoas/:id'})
})

//Atualizar uma única pessoa
app.put('/pessoas/:id', (request, response)=>{
    response.status(200).json({rota: 'GET /pessoas/:id'})
})

//Deletar uma única pessoa
app.delete('/pessoas/:id', (request, response)=>{
    response.status(200).json({rota: 'GET /pessoas/:id'})
})

app.listen(PORT, ()=>{
    console.log('Servidor iniciado na PORT:', PORT)
})