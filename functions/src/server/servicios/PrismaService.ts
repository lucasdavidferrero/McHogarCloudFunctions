import { PrismaClient, aikon_articulo, Prisma, PrismaPromise } from "@prisma/client";
import fs from 'fs'

const prisma = new PrismaClient();

export class PrismaService {
    static fetchAllAikonArticulos(): Promise<aikon_articulo[]> {
        return prisma.aikon_articulo.findMany();
    }

    static createAikonArticulo(data: Prisma.aikon_articuloUncheckedCreateInput): PrismaPromise<aikon_articulo> {
        return prisma.aikon_articulo.create({ data });
    }

    static updateAikonArticulo(codigo: string, data: Prisma.aikon_articuloUpdateInput): PrismaPromise<aikon_articulo> {
        return prisma.aikon_articulo.update({ where: { aik_ar_codigo: codigo }, data });
    }

    static async executeTransactionFromBatchOperations(operations: Prisma.PrismaPromise<any>[]) {
        return prisma.$transaction(operations);
    }

    static async generateBackupForProcesoDeSincronizacionConAikonCompleto () {
        /*const aikon_familia = prisma.aikon_familia.findMany()
        const aikon_categoria = prisma.aikon_referencia01.findMany()
        const aikon_rubro = prisma.aikon_referencia02.findMany()
        const aikon_marca = prisma.aikon_marca.findMany()
        const aikon_articulo = prisma.aikon_articulo.findMany()
        const aikon_historial_costo_neto = prisma.aikon_articulo_historial_costo_neto.findMany()
        const aikon_historial_stock_total = prisma.aikon_articulo_historial_stock_total.findMany()
        const aikon_historial_utilidad = prisma.aikon_articulo_historial_utilidad.findMany()
        const articulo_web = prisma.articulo_web.findMany()
        const articulo_precio = prisma.articulo_precio.findMany() */
        const [
            aikon_familia,
            aikon_categoria,
            aikon_rubro,
            aikon_marca,
            aikon_articulo,
            aikon_historial_costo_neto,
            aikon_historial_stock_total,
            aikon_historial_utilidad,
            articulo_web,
            articulo_precio
        ] = await Promise.all([
            prisma.aikon_familia.findMany(),
            prisma.aikon_referencia01.findMany(),
            prisma.aikon_referencia02.findMany(),
            prisma.aikon_marca.findMany(),
            prisma.aikon_articulo.findMany(),
            prisma.aikon_articulo_historial_costo_neto.findMany(),
            prisma.aikon_articulo_historial_stock_total.findMany(),
            prisma.aikon_articulo_historial_utilidad.findMany(),
            prisma.articulo_web.findMany(),
            prisma.articulo_precio.findMany()
        ])
        const backupData = {
            aikon_familia,
            aikon_categoria,
            aikon_rubro,
            aikon_marca,
            aikon_articulo,
            aikon_historial_costo_neto,
            aikon_historial_stock_total,
            aikon_historial_utilidad,
            articulo_web,
            articulo_precio
        }
        /*  Save backupData to Cloud Storage in a special bucket designed for storing database backupfiles.
            We could split the file system of the storage in something like:
            
         */
        // fs.writeFileSync('./backup.json', JSON.stringify(backupData, null, 2));
        console.log('Backup completed successfully.');
    }
}