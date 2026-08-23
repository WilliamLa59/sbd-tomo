/*
  Warnings:

  - A unique constraint covering the columns `[issuer,account_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `issuer` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "accounts" ADD COLUMN     "issuer" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_issuer_account_id_key" ON "accounts"("issuer", "account_id");
