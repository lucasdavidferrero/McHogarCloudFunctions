// @ts-expect-error: }
BigInt.prototype['toJSON'] = function () { 
    return Number(this)
}