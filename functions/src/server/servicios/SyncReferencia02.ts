import { AikonApiDtTablaService } from "./AikonApiDtTablaService";
import prisma from "../../prisma";
import { aikon_referencia02, Prisma } from "@prisma/client";

export class SyncReferencia02 {
    static async prepararSincronizacion (token: string): Promise<Prisma.PrismaPromise<aikon_referencia02>[]> {
        const rubrosFromApi = (await AikonApiDtTablaService.fetchReferencia02(token)).data
        const rubrosUpsert: Prisma.PrismaPromise<aikon_referencia02>[] = []

        rubrosFromApi.forEach((rubroApi) => {
            const rubroUpsert = prisma.aikon_referencia02.upsert({
                where: {
                    aik_re2_codigo: rubroApi.Codigo
                },
                update: {
                    aik_re2_descri: rubroApi.Descripcion
                },
                create: {
                    aik_re2_codigo: rubroApi.Codigo,
                    aik_re2_descri: rubroApi.Descripcion
                }
            })
            rubrosUpsert.push(rubroUpsert)
        })

        return rubrosUpsert
    }
}