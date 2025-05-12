import express, { response } from "express";
import cors from "cors";
import { promises as fs } from "node:fs";
import { resolve } from "node:path";
import { request } from "node:http";

const PORT = 3333;
const DATABASE_URL = "./database/base_dados.json";

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(express.json());

app.get("/instrutores", async (request, response) => {
    try {
        const data = await fs.readFile(DATABASE_URL, 'utf-8')
        const db = await JSON.parse(data)

        const instructors = db.usuarios.filter((aluno) => aluno.tipo === 'instrutor')

        response.status(200).json({ instructors })
    } catch (error) {
        console.log(error)
        response.status(500).json({ mensagem: "Internal server error" })
    }
})

app.get("/cursos/com-muitos-comentarios", async (request, response) => {
    try {
        const data = await fs.readFile(DATABASE_URL, 'utf-8')
        const db = await JSON.parse(data)

        const comentarios3 = db.cursos.filter((comentariosCom3) => comentariosCom3.comentarios.length >= 3)
        response.status(200).json({ mensagem: "Os seguintes cursos possuem 3 comentários ou mais: ", comentarios3 })
    } catch (error) {
        console.log(error)
        response.status(500).json({ mensagem: "Internal server error" })
    }
})

app.get("/usuarios/:id/cursos", async (request, response) => {
    const { id } = request.params
    try {
        const data = await fs.readFile(DATABASE_URL, 'utf-8')
        const db = await JSON.parse(data)

        const encontrarID = db.usuarios.find((usuario) => usuario.id === id)
        const matriculaCursos = db.motoristas.filter((cursos) => cursos.id === encontrarID.cursos_matriculados)
        response.status(200).json({ mensagem: "O aluno está matriculado nos seguintes cursos: ", matriculaCursos })
    } catch (error) {

    }
})

app.get("/usuarios/com-progresso-acima", async (request, response) => {

})

app.get("/usuarios/:id/comentarios", async (request, response) => {
    const { id } = request.params

    try {
        const data = await fs.readFile(DATABASE_URL, 'utf-8')
        const db = await JSON.parse(data)

        const findUser = db.usuarios.filter((usuario) => usuario.id === id);
        
        if (!findUser) {
            response.status(404).json({ mensagem: "Usuario não encontrado" });
            return;
        }
       
        const encontrarComentario = db.cursos.comentarios.filter((comentario) => comentario.comentarios.usuario_id === id)
        response.status(200).json({ encontrarComentario })
    } catch (error) {

    }
})

app.listen(PORT, () => {
    console.log("Servido Iniciado na porta: " + PORT);
});