import prisma from '../../prisma'
export class ArticuloWebService {
    static async obtenerArticuloWebPorCodigoArticulo (aikArCodigo: string) {
     const articuloWeb = await prisma.articulo_web.findUnique({
        where: {
            aik_ar_codigo: aikArCodigo
        }
     })
     return articuloWeb
    }
    static async saveUrlImagenPrincipal (aikArCodigo: string, arUrlImgPrincipal: string) {
        const articuloActualizado = await prisma.articulo_web.update({
            where: {
                aik_ar_codigo: aikArCodigo
            },
            data: {
                ar_url_img_principal: arUrlImgPrincipal
            }
        })
        return articuloActualizado
    }
    static async eliminarUrlImagenPrincipal (aikArCodigo: string) {
        const articuloActualizado = await prisma.articulo_web.update({
            where: {
                aik_ar_codigo: aikArCodigo
            },
            data: {
                ar_url_img_principal: null
            }
        })
        return articuloActualizado
    }
}