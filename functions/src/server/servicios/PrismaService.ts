import { PrismaClient, aikon_articulo, Prisma, PrismaPromise } from "@prisma/client";

const prisma = new PrismaClient();

export class PrismaService {
    static fetchAllAikonArticulos(): Promise<aikon_articulo[]> {
        return prisma.aikon_articulo.findMany();
    }

    static createAikonArticulo(data: Prisma.aikon_articuloUncheckedCreateInput): PrismaPromise<aikon_articulo> {
        return prisma.aikon_articulo.create({ data });
    }

    static updateAikonArticulo(codigo: string, data: Prisma.aikon_articuloUpdateInput): Promise<aikon_articulo> {
        return prisma.aikon_articulo.update({ where: { aik_ar_codigo: codigo }, data });
    }

    static async transaction(operations: Prisma.PrismaPromise<any>[]) {
        return prisma.$transaction(operations);
    }
}