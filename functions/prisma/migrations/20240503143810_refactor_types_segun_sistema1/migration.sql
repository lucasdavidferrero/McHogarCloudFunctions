/*
  Warnings:

  - Made the column `aik_esa_descri` on table `aikon_estado_articulo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `aikon_estado_articulo` MODIFY `aik_esa_descri` VARCHAR(30) NOT NULL;
