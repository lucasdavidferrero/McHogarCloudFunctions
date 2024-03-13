/*
  Warnings:

  - You are about to alter the column `AR_DESCRI` on the `aikon_articulo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(100)`.
  - You are about to alter the column `AR_DESCRIA` on the `aikon_articulo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(200)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `aikon_articulo` MODIFY `AR_DESCRI` VARCHAR(100) NULL,
    MODIFY `AR_DESCRIA` VARCHAR(100) NULL;
