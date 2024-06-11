import prisma from '../prisma'
export class ArticuloWebService {
    static async saveUrlImagenPrincipal (aikArCodigo: string, arUrlImgPrincipal: string) {
        const updateUser = await prisma.articulo_web.update({
            where: {
                aik_ar_codigo: aikArCodigo
            },
            data: {
                ar_url_img_principal: arUrlImgPrincipal
            }
        })
        return updateUser
    }
}