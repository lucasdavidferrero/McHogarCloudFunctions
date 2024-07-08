import express from "express"
import cors from "cors"
import { logData } from './utils/ejemploProcesoDiarioCompleto'

const expressAppNuxt = express()

// Install Global Middlewares
expressAppNuxt.use(cors())
expressAppNuxt.use(express.json())

// Register Routes
expressAppNuxt.use('/apiNuxt/v1/articulo', (req, res) => {
    logData
    res.send({ nuxt: true })
})

export {
    expressAppNuxt
}