import express from "express"
import cors from "cors"
import { ProcesoDiarioParaSincronizarArticulos } from "./QuasarApp/services/ProcesosApiAikon/ProcesoDiarioParaSincronizarArticulos"

const expressAppNuxt = express()

// Install Global Middlewares
expressAppNuxt.use(cors())
expressAppNuxt.use(express.json())

// Register Routes
expressAppNuxt.use('/apiNuxt/v1/articulo', async (req, res) => {
    const procesoDiario = new ProcesoDiarioParaSincronizarArticulos()
    await procesoDiario.iniciar()
    res.send({ nuxt: true })
})

export {
    expressAppNuxt
}