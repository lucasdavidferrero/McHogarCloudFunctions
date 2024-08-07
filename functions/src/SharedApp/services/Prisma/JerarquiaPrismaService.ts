import prisma from '../../../prisma'

const CODIGO_CATEGORIA_SIN_CATEGORIA = '09999'

export class JerarquiaPrismaService {

    static async obtenerJerarquiaCompleta (omitirSinCategoria = true) {
        return prisma.aikon_referencia01.findMany({
            where: (omitirSinCategoria) ? {
                aik_re1_codigo: {
                    not: CODIGO_CATEGORIA_SIN_CATEGORIA
                }
            } : undefined,
            include: {
                categoria_rubro: {
                    include: {
                        aikon_referencia02: {
                            include: {
                                rubro_familia: {
                                    include: {
                                        aikon_familia: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    }
}