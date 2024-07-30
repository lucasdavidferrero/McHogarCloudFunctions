import express from "express"
import cors from "cors"
import { procesoDeSincronizacionArticulosInfoRelevante } from "./server/procesos/ProcesoDeSincronizacionArticulosInfoRelevante"
import { procesoDeSincronizacionConAikonCompleto } from "./server/procesos/ProcesoDeSincronizacionConAikonCompleto"

const expressAppNuxt = express()

// Install Global Middlewares
expressAppNuxt.use(cors())
expressAppNuxt.use(express.json())

// Register Routes
expressAppNuxt.use('/apiNuxt/v1/articulo', async (req, res) => {
    const startProcess = performance.now()
    await procesoDeSincronizacionConAikonCompleto()
    const endProcess = performance.now()
    console.log(`El tiempo de ejecución del proceso completo fue de ${endProcess - startProcess}ms.`)
    res.send({ nuxt: true })
})

expressAppNuxt.use('/apiNuxt/v1/procesoInfoRelevante', async (req, res) => {
    await procesoDeSincronizacionArticulosInfoRelevante()
    res.send({ procesoInfoRelevante: true })
})

export {
    expressAppNuxt
}