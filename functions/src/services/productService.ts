import prisma from '../prisma'
const getAllProductsService = async () => {
    return prisma.product.findMany()
}

const getPricingHistoryByProductIdService = (productId: number) => {
    return prisma.pricingHistory.findMany({
        where: {
            productId: productId
        }
    })
}

export {
    getAllProductsService,
    getPricingHistoryByProductIdService
}