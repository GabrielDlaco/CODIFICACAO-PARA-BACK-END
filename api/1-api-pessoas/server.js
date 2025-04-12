import express from 'express'
import { v4 as uuidv4 } from 'uuid';
import cors from 'cors'

const PORT = 3333
/** TODO-LIST
 *[X] - Listar todas as pessoas cadastradas
 *[X] - Cadastrar uma pessoa
 *[X] - Buscar uma única pessoa
 *[X] - Atualizar uma única pessoa
 *[X] - Deletar uma única pessoa
 */

const app = express()
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

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
    response.status(201).json({mensagem: "Cadastro realizado com sucesso", pessoa}) //Nessa linha, quando cadastramos a pessoa no thunder client, faz com que essas pessoas vão para o array "pessoas"
})

//Buscar uma única pessoa
app.get('/pessoas/:id', (request, response)=>{
    const {id} = request.params //Precisamos desestruturar o "ID" usando as chaves, lembrando sempre de usar console.log para verificar se estou recebendo essas informações
    /**[
     * {id:19, nome:"Carlos", cargo:"instrutor"},
     * {id:20, nome:"Carlos", cargo:"instrutor"}
     * ]
     * -1
     */
    const encontrarPessoas = pessoas.findIndex((obj)=>obj.id === id) // Esta função está sem chaves pois, com chaves sempre iremos precisar passar o return, já sem as chaves o retorno dessas informações é obrigatorio
    if(encontrarPessoas === -1){
        response.status(404).json({mensagem: 'Pessoa não encontrada'})
        return
    }
    //Mostrar pessoa procurada
    const pessoa = pessoas[encontrarPessoas]
    response.status(200).json({mensagem:"Pessoa encontrada", pessoa})
})

//Atualizar uma única pessoa
app.put('/pessoas/:id', (request, response) => {
    const { id } = request.params
    const {nome, cargo} = request.body

    const encontrarPessoa = pessoas.findIndex((obj) => obj.id === id)
    if(encontrarPessoa === -1){
        response.status(404).json({menssagem: 'Pessoa não encontrada.'})
        return
    }

    if(!cargo || !nome){
        response.status(400).json({messagem: 'Nome e cargo é obrigatorio'})
        return
    }

    const pessoaAtualizada = {
        id,
        nome,
        cargo
    }

    pessoas[encontrarPessoa] = pessoaAtualizada

    response.status(200).json({rota: 'Pessoa Atualizada', pessoaAtualizada})
    
})

//Deletar uma única pessoa
app.delete('/pessoas/:id', (request, response)=>{

    const { id } = request.params

    const encontrarPessoa = pessoas.findIndex((obj) => obj.id === id)
    if(encontrarPessoa === -1){
        response.status(404).json({menssagem: 'Pessoa não encontrada.'})
        return
    }

    pessoas.splice(encontrarPessoa, 1) //Site que explica sobre função splite favoritado no google ('mdn splice')
    response.status(200).json({mensagem: 'Pessoa excluída'})
})

app.listen(PORT, ()=>{
    console.log('Servidor iniciado na PORT:', PORT)
})