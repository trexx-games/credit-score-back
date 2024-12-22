/*
  Warnings:

  - You are about to drop the column `blockchain_id` on the `user_events` table. All the data in the column will be lost.
  - Added the required column `blockchain` to the `user_events` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_events_blockchain_id_idx";

-- AlterTable
ALTER TABLE "user_events" DROP COLUMN "blockchain_id",
ADD COLUMN     "blockchain" TEXT NOT NULL;
