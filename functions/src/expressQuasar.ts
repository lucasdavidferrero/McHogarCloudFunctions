import express from "express"
import cors from "cors"
import v1ArticuloRouter from './QuasarApp/routes/articuloRoutes'

const expressAppQuasar = express()

// Install Global Middlewares
expressAppQuasar.use(cors())
expressAppQuasar.use(express.json())

// Register Routes
expressAppQuasar.use('/api/v1/articulo', v1ArticuloRouter)

export {
    expressAppQuasar
}