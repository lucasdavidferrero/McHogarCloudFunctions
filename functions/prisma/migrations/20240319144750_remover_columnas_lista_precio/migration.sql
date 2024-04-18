/*
  Warnings:

  - You are about to drop the column `LP_PVCONSULTA` on the `aikon_lista_precio` table. All the data in the column will be lost.
  - You are about to drop the column `LP_VERCOLCONSART` on the `aikon_lista_precio` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `aikon_lista_precio` DROP COLUMN `LP_PVCONSULTA`,
    DROP COLUMN `LP_VERCOLCONSART`;
