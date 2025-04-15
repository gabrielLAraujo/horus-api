/*
  Warnings:

  - You are about to drop the column `consumer` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `consumers` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `requestCount` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `requestSizeSum` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `requestSizes` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `responseSizeSum` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `responseSizes` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `responseTimes` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `routeId` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `serverErrors` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `statusCode` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `validationErrors` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the `Route` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[request_id]` on the table `Request` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `duration_ms` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `request_id` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Request" DROP CONSTRAINT "Request_routeId_fkey";

-- DropIndex
DROP INDEX "Request_routeId_idx";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "consumer",
DROP COLUMN "consumers",
DROP COLUMN "requestCount",
DROP COLUMN "requestSizeSum",
DROP COLUMN "requestSizes",
DROP COLUMN "responseSizeSum",
DROP COLUMN "responseSizes",
DROP COLUMN "responseTimes",
DROP COLUMN "routeId",
DROP COLUMN "serverErrors",
DROP COLUMN "statusCode",
DROP COLUMN "validationErrors",
ADD COLUMN     "customData" JSONB,
ADD COLUMN     "duration_ms" INTEGER NOT NULL,
ADD COLUMN     "request_id" TEXT NOT NULL,
ADD COLUMN     "status" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Route";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Request_request_id_key" ON "Request"("request_id");

-- CreateIndex
CREATE INDEX "Request_request_id_idx" ON "Request"("request_id");

-- CreateIndex
CREATE INDEX "Request_method_idx" ON "Request"("method");

-- CreateIndex
CREATE INDEX "Request_path_idx" ON "Request"("path");
