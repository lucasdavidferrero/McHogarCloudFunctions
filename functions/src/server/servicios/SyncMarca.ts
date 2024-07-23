import { AikonApiDtTablaService } from "./AikonApiDtTablaService";
import prisma from "../../prisma";
import { aikon_marca, Prisma } from "@prisma/client";
export class SyncMarca {
    static async prepararSincronizacion (token: string): Promise<Prisma.PrismaPromise<aikon_marca>[]> {
        const marcasFromApi = (await AikonApiDtTablaService.fetchMarcas(token)).data
        
        let marcasUpserts: Prisma.PrismaPromise<aikon_marca>[] = []
        marcasFromApi.forEach((marcaApi) => {
            const upsertMarca = prisma.aikon_marca.upsert({
                where: {
                    aik_ma_codigo: marcaApi.Codigo
                },
                update: {
                    aik_ma_descri: marcaApi.Nombre
                },
                create: {
                    aik_ma_codigo: marcaApi.Codigo,
                    aik_ma_descri: marcaApi.Nombre
                }
            })
            marcasUpserts.push(upsertMarca)
        })
        return marcasUpserts
    }
}