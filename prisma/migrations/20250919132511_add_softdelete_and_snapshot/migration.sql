/*
  Warnings:

  - You are about to drop the column `tags` on the `Product` table. All the data in the column will be lost.
  - Added the required column `productName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_productId_fkey`;

-- DropIndex
DROP INDEX `OrderItem_productId_fkey` ON `OrderItem`;

-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `productName` VARCHAR(191) NOT NULL,
    MODIFY `productId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `tags`,
    ADD COLUMN `deleted` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
