// @ts-expect-error:
BigInt.prototype['toJSON'] = function () { 
    /*   Esta función se utiliza a la hora de hacer backup del Prisma. */
    return Number(this)
}