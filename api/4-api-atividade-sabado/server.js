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

app.listen(PORT, ()=>{
    console.log(`Servidor iniciado em  http://localhost:3333`)
})