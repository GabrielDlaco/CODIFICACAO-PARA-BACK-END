import express from 'express' 
import cors from 'cors'
import { v4 as uuidv4 } from 'uuid';

const app = express()

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELTE"],
    credentials: true
}))

app.use(express.json())
const PORT = 3333

const usuarios = []


//cadastrar uma pessoa
app.post('/usuarios', (request, response) => {
    const {nome, email, senha, link_img} = request.body


            const encontrarEmail = usuarios.findIndex((usuario) => usuario.email === email)
            console.log(encontrarEmail)
            
    
        if(!nome){
            response.status(400).json({menssagem: "Nome é obrigatório"}) 
            return
        }

        if(nome === usuarios.map((usuario) => usuario.nome)){
            response.status(400).json({menssagem: "Esse nome já está cadastrado"})
            return
        }

        if(!email ){
            response.status(400).json({menssagem: "Email é obrigatório"}) 
            return
        }

        if (!email || !email.includes('@') || encontrarEmail > -1) { 
            response.status(400).json({ mensagem: 'Email é obrigatorio e precisa ser unico' });
            return;
        }

        if(!senha){
            response.status(400).json({menssagem: "Senha é obrigatório"}) 
            return
        }
    
        if(!link_img){
            response.status(400).json({menssagem: "Link da imagem é obrigatorio"})
            return
        }

    
       const usuario = {
            id: uuidv4(),
            nome,
            email,
            senha,
            link_img
       }
    
        usuarios.push(usuario)//adiciona um item no array "usuarios"
        response.status(201).json({menssagem: 'Cadastro realizado com sucesso', usuario})
   
})

//Listar pessoas
app.get('/usuarios', (request, response) => {
    response.status(200).json(usuarios)
})

//Buscar uma unica pessoa
app.get('/usuarios/:id', (request, response) => {
    const { id } = request.params

    const UsuariosEncontrados = usuarios.findIndex((obj) => obj.id === id)
    if(UsuariosEncontrados === -1){
        response.status(404).json({menssagem: 'Pessoa não encontrada.'})
        return
    }

    const usuario = usuarios [UsuariosEncontrados]

    response.status(200).json({menssagem: 'Pessoa encontrada', usuario})
})

//Atualizar uma única pessoa
app.put('/usuarios/:id', (request, response) => {

    const {id} = request.params

    const {nome, email, senha, link_img} = request.body

    const UsuariosEncontrados = usuarios.findIndex((obj) => obj.id === id)
    if(UsuariosEncontrados === -1){
        response.status(404).json({menssagem: 'Usuário não encontrada.'})
        return
    }

    if(!nome || !senha || !email){

        response.status(400).json({messagem: 'Nome, Senha e Email são campos obrigatorios!'})
        return
    }

    const usuarioatualizado = {
        id,
        nome,
        email,
        senha,
        link_img
    }
    
    usuarios[UsuariosEncontrados] = usuarioatualizado

    response.status(200).json({rota: 'Usuário atualizado com sucesso!', usuarioatualizado})


})

//deletar uma única pessoa
app.delete('/usuarios/:id', (request, response) => {
    const { id } = request.params

    
    const UsuariosEncontrados = usuarios.findIndex((obj) => obj.id === id)
    if(UsuariosEncontrados === -1){
        response.status(404).json({menssagem: 'Usuário não encontrada.'})
        return
    }
    usuarios.splice(UsuariosEncontrados, 1)
    response.status(200).json({menssagem:'Usuário deletado com sucesso.'})
})


// Fazer Login
app.post('/usuarios/login', (request, response) => {
    const { nome, email, senha } = request.body;

    if(!nome){
        response.status(400).json({menssagem: "Nome é obrigatório"}) 
        return
    }

    if (!email) {
        response.status(400).json({ menssagem: "Email é obrigatório" });
        return;
    }

    if (!senha) {
        response.status(400).json({ menssagem: "Senha é obrigatória" });
        return;
    }

    const usuarioEncontrado = usuarios.findIndex(usuario => usuario.email === email && usuario.senha === senha);

    if (!usuarioEncontrado) {
        response.status(401).json({ menssagem: "Credenciais inválidas. Verifique o email e a senha." });
        return;
    }

    response.status(200).json({ menssagem: "Login realizado com sucesso!", usuario: usuarioEncontrado });
});

app.listen(PORT, () => {
    console.log('Servidor iniciado na porta', PORT)
})
