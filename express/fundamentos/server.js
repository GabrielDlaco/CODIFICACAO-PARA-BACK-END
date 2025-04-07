// AULA 02, 03
// Instalamos o express usando o comando "npm i express" na pasta fundamentos e agora precisamos importar
// "npm init -y" para trazer as pastas necessárias do servidor.
import express from 'express'

const app = express()

//OBRIGATORIO PARA ACEITAR JSON
app.use(express.json())//Permite a aplicação receber informações em json
// app.use(express.urlencoded({extended:true})) //Permite a aplicação aceitar imagens
/** Requisições
 * 1. - Métodos
 * 1.1 - GET -> Busca/ Lista dados
 * 1.2 - POST -> Criar um recurso/dados
 * 1.3 - PUT -> Atualizar recursos/dados
 * 1.4 - DELETE -> Deletar recursos/dados
 * 1.5 - PATH -> Atualizar UMA informação
 * 2. - Receber informações
 * 2.1 - Query params -> Filtros (São parâmetros que são passados na URL)
 * 2.1.1. - http://exemplo.com/projetos?nome=Web&author=Carlos
 * 2.2 - Route params -> Identificar Recurso (Busca somente UMA rota)
 * 2.2.1. - http://exemplo.com/projetos/30 
 * 2.3 -> Body Params -> {obj - JSON}
 * 2.3.1 - {nome:Carlos, idade:33}
 * 3. - Status Code HTTP
 * 3.1 - 100 -> Informativo
 * 3.2 - 200 -> TUDO OK
 * 3.3 - 300 -> Recurso movido
 * 3.4 - 400 -> Erro do cliente
 * 3.5 - 500 -> Erro do servidor
 */
//             query route / projetos&nome="Carlos"
app.get('/projetos',(request, response)=>{
    const {titulo, autor} = request.query //Pega as informações para imprimir elas individualmente, no caso uma propiedade e o seu valor (titulo e autor)
    console.log(titulo, autor)
    response.status(200).json(['projeto 01', 'projeto 02'])
})

app.post('/projetos', (request, response)=>{ //Para pegar as informações de um corpo da aplicação (ex: body do html que contem um formulário) precisamos fazer o seguinte ->
    console.log(request.body)
    response.status(201).json(['projeto 01', 'projeto 02', 'projeto 03'])
})

app.put('/projetos', (request, response)=>{
    response.status(200).json(['projeto 88', 'projeto 02', 'projeto 03'])
})

//Receber informação por rota Route params /projetos/12
app.delete('/projetos/:id', (request, response)=>{ //Passamos a informação por ID. Quando passamos Route params, quer dizer dizer que esssa informação é obrigaória, nesse caso seria obrigatório passar o id para o método delete, e se não passarmos essa informação obrigatória, a aplicação irá retornar um erro, que seria o 404 diferentemente do query route, que recebe informações opcionais
    const {id} = request.params
    response.status(200).json(['projeto 02', 'projeto 03'])
})

app.listen(3333, ()=>{
    console.log('Servidor iniciado em http://localhost:3333')
    // 1.1 - No terminal da pasta fundamentos irei digitar "node server.js" e irá aparecer essa informação
    // 1.2 - Se pesquisar "http://localhost:3333/projetos" que seria nosso endpoint, no caso uma outra rota. Tudo isso na guia do google após digitar "node server.js" no terminal da pasta
    // 1.3 - Podemos apertar "cntrl + c" para cancelar o servidor aberto e atualizar informções, pois quando alteramos alguma informação com o servidor aberto, essa informação não é atualizada na página do servidor
    // 1.4 - Agora iremos instalar um módulo externo que mesmo com o servidor aberto atualiza as informações, esse módulo se chama "nodemon" e irá ajudar somente no caso atual, para codificar código para instalar "npm i nodemon -D"
    // 1.5 - No package.json usamos ""dev": "nodemon ./server.js"" na parte de script, pois o nodemon estava dando erro
    // 1.6 - Ao invés de usarmos "node server.js" no terminal iremos usar "npm run dev" após isntalar o nodemon e mudar o package.json
    // 1.7 - Os endpoints devem estar no plural -> projetos, pessoas, roupas
    // 1.8 -


})