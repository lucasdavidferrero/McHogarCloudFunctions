import { PrismaClient, aikon_articulo, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class PrismaService {
    static async fetchAllAikonArticulos(): Promise<aikon_articulo[]> {
        return prisma.aikon_articulo.findMany();
    }

    static async createAikonArticulo(data: Prisma.aikon_articuloCreateInput): Promise<aikon_articulo> {
        return prisma.aikon_articulo.create({ data });
    }

    static async updateAikonArticulo(codigo: string, data: Prisma.aikon_articuloUpdateInput): Promise<aikon_articulo> {
        return prisma.aikon_articulo.update({ where: { aik_ar_codigo: codigo }, data });
    }

    static async transaction(operations: Prisma.PrismaPromise<any>[]) {
        return prisma.$transaction(operations);
    }
}