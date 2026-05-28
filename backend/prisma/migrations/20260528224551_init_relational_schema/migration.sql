/*
  Warnings:

  - You are about to drop the column `city` on the `customers` table. All the data in the column will be lost.
  - Added the required column `city_id` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Made the column `gender` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `company` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `customers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `customers` DROP COLUMN `city`,
    ADD COLUMN `city_id` INTEGER NOT NULL,
    MODIFY `gender` VARCHAR(191) NOT NULL,
    MODIFY `company` VARCHAR(191) NOT NULL,
    MODIFY `title` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `cities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `cities_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `customers` ADD CONSTRAINT `customers_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
