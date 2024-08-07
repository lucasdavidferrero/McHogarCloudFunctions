import express from "express"
import cors from "cors"
import { procesoDeSincronizacionArticulosInfoRelevante } from "./server/procesos/ProcesoDeSincronizacionArticulosInfoRelevante/ProcesoDeSincronizacionArticulosInfoRelevante";
import { procesoDeSincronizacionConAikonCompleto } from "./server/procesos/ProcesoDeSincronizacionConAikonCompleto/ProcesoDeSincronizacionConAikonCompleto";
import { JerarquiaPrismaService } from './SharedApp/services/Prisma/JerarquiaPrismaService'
import v1JerarquiaRouter from './NuxtApp/routes/jerarquiaRoutes'

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

expressAppNuxt.use('/test/', async (req, res) => {
    const result = await JerarquiaPrismaService.obtenerJerarquiaCompleta()
    res.send(result)
})

expressAppNuxt.use('/apiNuxt/v1/procesoInfoRelevante', async (req, res) => {
    await procesoDeSincronizacionArticulosInfoRelevante()
    res.send({ procesoInfoRelevante: true })
})

expressAppNuxt.use('/api/v1/jerarquias', v1JerarquiaRouter)

export {
    expressAppNuxt
}