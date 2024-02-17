import { Router } from "express"
import { getAllProducts, getPricingHistoryByProductId } from '../../controllers/productController'

const router = Router()

router
    .get('/', getAllProducts)
    .get('/pricing-history/:productId', getPricingHistoryByProductId)

export default router


// https://dev.to/kabartolo/how-to-document-an-express-api-with-swagger-ui-and-jsdoc-50do
// https://blog.logrocket.com/write-scalable-openapi-specification-node-js/