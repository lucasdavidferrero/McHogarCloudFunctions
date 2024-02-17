import express from "express"
import cors from "cors"
import v1ProductRouter from './routes/v1/productRoutes'

const expressApp = express()

// Install Global Middlewares
expressApp.use(cors())
expressApp.use(express.json())

// Register Routes
expressApp.use('/api/v1/products', v1ProductRouter)

export {
    expressApp
}