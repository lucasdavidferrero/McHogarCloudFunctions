/*
  Warnings:

  - You are about to alter the column `AR_DESMAX` on the `articulo` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `Decimal(5,2)`.

*/
-- AlterTable
ALTER TABLE `articulo` MODIFY `AR_DESMAX` DECIMAL(5, 2) NULL,
    MODIFY `AR_COSREP` DECIMAL(15, 2) NULL,
    MODIFY `AR_COSUCP` DECIMAL(15, 2) NULL;
