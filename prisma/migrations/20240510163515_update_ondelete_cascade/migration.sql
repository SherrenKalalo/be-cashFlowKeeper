-- DropForeignKey
ALTER TABLE `Budget` DROP FOREIGN KEY `Budget_id_user_fkey`;

-- DropForeignKey
ALTER TABLE `Expense` DROP FOREIGN KEY `Expense_id_budget_fkey`;

-- AddForeignKey
ALTER TABLE `Budget` ADD CONSTRAINT `Budget_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Expense` ADD CONSTRAINT `Expense_id_budget_fkey` FOREIGN KEY (`id_budget`) REFERENCES `Budget`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
