/*
  Warnings:

  - Made the column `aik_fa_nivel` on table `aikon_familia` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_fa_nombre` on table `aikon_familia` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_fa_palm` on table `aikon_familia` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aik_ma_descri` on table `aikon_marca` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `aikon_familia` MODIFY `aik_fa_nivel` VARCHAR(2) NOT NULL,
    MODIFY `aik_fa_nombre` VARCHAR(30) NOT NULL,
    MODIFY `aik_fa_palm` VARCHAR(1) NOT NULL;

-- AlterTable
ALTER TABLE `aikon_marca` MODIFY `aik_ma_descri` VARCHAR(30) NOT NULL;
