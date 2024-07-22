import express from "express"
import cors from "cors"
import { procesoDeSincronizacionConAikonCompleto } from './server/procesos/ProcesoDeSincronizacionConAikonCompleto'
import { performance } from "perf_hooks"

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

export {
    expressAppNuxt
}