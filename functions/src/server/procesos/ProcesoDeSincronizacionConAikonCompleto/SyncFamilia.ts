import { AikonApiDtTablaService } from "../../servicios/AikonApiDtTablaService";
import prisma from "../../../prisma";
import { aikon_familia, Prisma } from "@prisma/client";
export class SyncFamilia {
    static async prepararSincronizacion(token: string): Promise<Prisma.PrismaPromise<aikon_familia>[]> {

        const familiaFromApi = (await AikonApiDtTablaService.fetchFamilia(token)).data
        const femiliaUpserts: Prisma.PrismaPromise<aikon_familia>[] = []
        familiaFromApi.forEach((familiaApi) => {
            const familiaUpsert = prisma.aikon_familia.upsert({
                where: {
                    aik_fa_codigo: familiaApi.FA_CODIGO
                },
                update: {
                    aik_fa_nombre: familiaApi.FA_NOMBRE,
                    aik_fa_nivel: familiaApi.FA_NIVEL,
                    aik_fa_palm: familiaApi.FA_PALM
                },
                create: {
                    aik_fa_codigo: familiaApi.FA_CODIGO,
                    aik_fa_nombre: familiaApi.FA_NOMBRE,
                    aik_fa_nivel: familiaApi.FA_NIVEL,
                    aik_fa_palm: familiaApi.FA_PALM
                }
            })

            femiliaUpserts.push(familiaUpsert)
        })

        return femiliaUpserts
    }
}