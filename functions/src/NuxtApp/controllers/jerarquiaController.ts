import { Request, Response } from "express"

const obtenerJerarquiasCompleto = async (req: Request, res: Response) => {
    res.send({
        OK: true
    })
}

export {
    obtenerJerarquiasCompleto
}