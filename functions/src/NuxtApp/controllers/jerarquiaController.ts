import { Request, Response } from "express"
import { JerarquiaPrismaService } from "../../SharedApp/services/Prisma/JerarquiaPrismaService"

const obtenerJerarquiasCompleto = async (req: Request, res: Response) => {
    const result = await JerarquiaPrismaService.obtenerJerarquiaCompleta()
    res.send({
        estado: 'satisfactorio',
        mensaje: 'Jerarquía completa excluyendo la categoría "SIN CATEGORÍA"',
        data: result
    })
}

export {
    obtenerJerarquiasCompleto
}