-- DropForeignKey
ALTER TABLE "log_body" DROP CONSTRAINT "log_body_messageId_fkey";

-- DropIndex
DROP INDEX "log_body_messageId_key";

-- DropIndex
DROP INDEX "logs_messageId_key";

-- AlterTable
ALTER TABLE "logs" ADD COLUMN     "logBodyId" TEXT;

-- AddForeignKey
ALTER TABLE "logs" ADD CONSTRAINT "logs_logBodyId_fkey" FOREIGN KEY ("logBodyId") REFERENCES "log_body"("id") ON DELETE SET NULL ON UPDATE CASCADE;
