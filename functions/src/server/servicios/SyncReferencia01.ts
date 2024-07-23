import { AikonApiDtTablaService } from "./AikonApiDtTablaService";
import prisma from "../../prisma";
import { aikon_referencia01, Prisma } from "@prisma/client";
export class SyncReferencia01 {
    static async prepararSincronizacion (token: string): Promise<Prisma.PrismaPromise<aikon_referencia01>[]> {
        const categoriasFromApi = (await AikonApiDtTablaService.fetchReferencia01(token)).data
        const categoriasUpsert: Prisma.PrismaPromise<aikon_referencia01>[] = []

        categoriasFromApi.forEach((categoriaApi) => {
            const categoriaUpsert = prisma.aikon_referencia01.upsert({
                where: {
                    aik_re1_codigo: categoriaApi.Codigo
                },
                update: {
                    aik_re1_descri: categoriaApi.Descripcion
                },
                create: {
                    aik_re1_codigo: categoriaApi.Codigo,
                    aik_re1_descri: categoriaApi.Descripcion
                }
            })
            categoriasUpsert.push(categoriaUpsert)
        })

        return categoriasUpsert
    }
}