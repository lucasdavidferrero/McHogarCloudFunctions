import express from "express"
import cors from "cors"
import prisma  from "./prisma"
// import v1ProductRouter from './src/routes/v1/productRoutes.js'

const expressApp = express()

// Install Global Middlewares
expressApp.use(cors())
expressApp.use(express.json())

// Register Routes
expressApp.get('/test', async (_, res) => {
    const products = await prisma.product.findMany()
    res.send({
        data: products,
        status: 'OK'
    })
})

export {
    expressApp
}