// import prisma from '../prisma'
const getAllProductsService = async () => {
    // return prisma.product.findMany()
    return [
        { username: 'lucasfer', role: 'ADMIN' },
        { username: 'lucky2', role: 'BASIC' },
        { username: 'lucky55', role: 'SELLER' }
    ]
}

const getPricingHistoryByProductIdService = (productId: number) => {
    /*return prisma.pricingHistory.findMany({
        where: {
            productId: productId
        }
    })*/
    return {
        username: 'lucasfer',
        fullname: 'Lucas Ferrero',
        age: 28
    }
    
}

export {
    getAllProductsService,
    getPricingHistoryByProductIdService
}