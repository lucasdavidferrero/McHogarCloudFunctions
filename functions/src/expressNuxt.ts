import express from "express"
import cors from "cors"

const expressAppNuxt = express()

// Install Global Middlewares
expressAppNuxt.use(cors())
expressAppNuxt.use(express.json())

// Register Routes
expressAppNuxt.use('/apiNuxt/v1/articulo', (req, res) => {
    res.send({ nuxt: true })
})

export {
    expressAppNuxt
}