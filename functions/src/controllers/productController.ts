import { Request, Response } from "express"
import { getAllProductsService, getPricingHistoryByProductIdService } from '../services/productService'

const getAllProducts = async (req: Request, res: Response) => {
    const allProducts = await getAllProductsService()
    res.send({
        status: 'OK',
        data: allProducts
    })
}

const getPricingHistoryByProductId = async (req: Request, res: Response) => {
    let productId = Number(req.params.productId)
    if (isNaN(productId) || typeof(productId) !== 'number') {
        res.status(400)
        res.send({ status: 'FAILED', message: 'productId is not a number.' })
        return
    }
    const pricingHistory = await getPricingHistoryByProductIdService(productId)
    res.send({
        status: 'OK',
        data: pricingHistory
    })
}

export {
    getAllProducts,
    getPricingHistoryByProductId
}