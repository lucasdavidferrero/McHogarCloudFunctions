import express from "express"
import cors from "cors"
import v1ArticuloRouter from './routes/v1/articuloRoutes'

const expressApp = express()

// Install Global Middlewares
expressApp.use(cors())
expressApp.use(express.json())

// Register Routes
expressApp.use('/api/v1/articulo', v1ArticuloRouter)

export {
    expressApp
}