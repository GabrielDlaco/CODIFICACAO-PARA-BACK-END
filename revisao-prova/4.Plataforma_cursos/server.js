import express from "express"
import cors from "cors"
import {promises as fs} from "node:fs"

const PORT = 3333
const database_url = "./database/base_dados.json"

const app = express()
app.use(cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: "*",
    credentials: true
}))
app.use(express.json())

app.get("/instrutores", async (req, res) => {
    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        const instrutores = db.usuarios.filter((user) => user.tipo === "instrutor")

        res.status(200).json(instrutores)
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.get("/cursos/com-muitos-comentarios", async (req, res) => {
    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        const cursosComMuitosComentarios = db.cursos.filter((curso) => curso.comentarios.length >= 3)
        if(!cursosComMuitosComentarios){
            res.status(404).json({mensagem: "Não há nenhum curso com três comentários ou mais"})
            return
        }

        res.status(200).json(cursosComMuitosComentarios)
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
    
})

app.get("/usuarios/:id/cursos", async (req, res) => {
    const { id } = req.params
    const idInt = Number(id)

    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)

        const user = db.usuarios.find((usuario) => usuario.id === idInt)
        if(!user){
            res.status(404).json({mensagem: "Não há nenhum usuário com esse id na base de dados"})
            return
        }

        if(user.tipo === "instrutor"){
            res.status(404).json({mensagem: "O usuário com esse id é um instrutor"})
            return
        }
        
        const cursosUser = user.cursos_matriculados
        
        if(cursosUser.length === 0){
            res.status(404).json({mensagem: "Esse usuário não está matriculado em nenhum curso"})
            return
        }

        const infoCurso = db.cursos.filter(curso => cursosUser.includes(curso.id));

        res.status(200).json(infoCurso)
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.get("/usuarios/com-progresso-acima", async (req, res) => {
    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        const usuarios = db.usuarios

        const usuariosComProgressoAlto = usuarios.filter(usuario => {
            if (usuario.tipo !== 'estudante' || !usuario.progresso){
                return false
            }
            return Object.values(usuario.progresso).some(p => p > 80)
        })
        
        if(usuariosComProgressoAlto.length === 0){
            res.status(404).json({mensagem: "Não há nenhum usuário com o progresso acima de 80%"})
            return
        }

        res.status(200).json(usuariosComProgressoAlto)
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.get("/usuarios/:id/comentarios", async (req, res) => {
    const { id } = req.params
    const idInt = Number(id)

    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        
        const comentariosUsuarios = db.cursos.find((curso) => curso.comentarios.filter((c) => c.usuario_id === idInt))
        if(!comentariosUsuarios){
            res.status(404).json({mensagem: "Esse usuário não fez nenhum comentário"})
            return
        }

        res.status(200).json(comentariosUsuarios)
        
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.get("/cursos/:id/media-progresso", async (req, res) => {
    const { id } = req.params
    const idInt = Number(id)

    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        const usuario = db.usuarios.find((user) => user.id === idInt)
        if(!usuario){
            res.status(404).json({mensagem: "Não há nenhum usuário com esse id na base de dados"})
            return
        }

        const valoresProgresso = Object.values(usuario.progresso)
        
        const media = valoresProgresso.reduce((a, b) => a + b)/valoresProgresso.length
        
        res.status(200).json({mensagem: `A média do progresso desse aluno é: ${media}`})
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.get("/cursos/:id/media-nota", async (req, res) => {
    const { id } = req.params
    const idInt = Number(id)

    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        const curso = db.cursos.find((c) => c.id === idInt)
        if(!curso){
            res.status(404).json({mensagem: "Não há nenhum curso com esse id na base de dados"})
            return
        }

        const comentarios = curso.comentarios
        
        const notasComentario = comentarios.map((comentario) => comentario.nota)
        const mediaNotas = notasComentario.reduce((a, b) => a + b)/notasComentario.length

        res.status(200).json({mensagem: `A média das notas dos comentários desse curso é: ${mediaNotas}`})
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.get("/cursos/:id/duracao-total", async (req, res) => {
    const { id } = req.params
    const idInt = Number(id)

    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        const curso = db.cursos.find((c) => c.id === idInt)
        if(!curso){
            res.status(404).json({mensagem: "Não há nenhum curso com esse id na base de dados"})
            return
        }

        const aulas = curso.aulas
        const duracao = aulas.map((aula) => aula.duracao_minutos)

        const duracaoTotal = duracao.reduce((a, b) => a + b)

        res.status(200).json({mensagem: `A duração total das aulas desse curso em minutos é de: ${duracaoTotal} mins`})
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.get("/instrutores/:id/quantidade-cursos", async (req, res) => {
    const { id } = req.params
    const idInt = Number(id)

    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        const instrutor = db.usuarios.find((usuario) => usuario.id === idInt && usuario.tipo === "instrutor")
        if(!instrutor){
            res.status(404).json({mensagem: "Não há nenhum instrutor com esse id na base de dados"})
            return
        }

        const cursosCriados = db.cursos.filter((curso) => curso.instrutor_id === instrutor.id)
        if(cursosCriados.length === 0){
            res.status(404).json({mensagem: "Esse instrutor não criou nenhum curso"})
            return
        }

        res.status(200).json(cursosCriados)
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.get("/certificados/por-curso", async (req, res) => {
    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        const certificados = db.certificados

        const qtdCertificadosCurso = {}

        certificados.forEach((certificado) => {
            const id = certificado.curso_id

            qtdCertificadosCurso[id] = (qtdCertificadosCurso[id] || 0) + 1;
        });


        res.status(200).json(qtdCertificadosCurso)
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.get("/usuarios/agrupados-por-tipo", async (req, res) => {
    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        const usuarios = db.usuarios

        const estudantes = usuarios.filter((usuario) => usuario.tipo === "estudante")
        const instrutores = usuarios.filter((usuario) => usuario.tipo === "instrutor")

        const qtdEstudantes = estudantes.length
        const qtdInstrutores = instrutores.length

        res.status(200).json({mensagem: `A quantidade de estudantes é: ${qtdEstudantes}; Já a quantidade de instrutores é: ${qtdInstrutores}`})
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.get('/cursos/ordenados-por-nota', async (req, res) => {
    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)

        const cursosOrdenados = db.cursos.map((curso) => {
          const totalNotas = curso.comentarios.reduce((soma, comentario) => soma + comentario.nota, 0);
          const mediaNota = totalNotas / curso.comentarios.length;

          const c = {
            id: curso.id,
            titulo: curso.titulo,
            descricao: curso.descricao,
            instrutor_id: curso.instrutor_id,
            media_nota: mediaNota
          };

          return c
        })
        .sort((a, b) => b.media_nota - a.media_nota);

        res.status(200).json(cursosOrdenados)
    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
});

app.get("/usuarios/com-multiplos-certificados", async (req, res) => {
    try {
        const data = await fs.readFile(database_url, 'utf-8')
        const db = await JSON.parse(data)
        const alunos = db.usuarios.filter((usuario) => usuario.tipo === "estudante")
        const certificados = db.certificados

        const maisDeUmCertificado = certificados.map((certificado) => certificado.curso_id > 1)

        if(!maisDeUmCertificado){
            res.status(404).json({mensagem: "Não há nenhum aluno com mais de um certificado"})
            return
        }

        const idUsuariosCertificados = certificados.filter((usuario) => usuario.user_id)

        res.status(200).json(idUsuariosCertificados)

    } catch (error) {
        console.log(error)
        res.status(500).json({mensagem: "Internal server error"})
    }
})

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta: ${PORT}`)
})