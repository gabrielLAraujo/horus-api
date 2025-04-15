-- CreateTable
CREATE TABLE "Route" (
    "id" TEXT NOT NULL,
    "instanceUuid" TEXT NOT NULL,
    "messageUuid" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "versions" JSONB NOT NULL,
    "client" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "consumer" TEXT,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "requestCount" INTEGER NOT NULL,
    "requestSizeSum" INTEGER NOT NULL,
    "responseSizeSum" INTEGER NOT NULL,
    "responseTimes" JSONB NOT NULL,
    "requestSizes" JSONB NOT NULL,
    "responseSizes" JSONB NOT NULL,
    "validationErrors" JSONB NOT NULL,
    "serverErrors" JSONB NOT NULL,
    "consumers" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Route_instanceUuid_messageUuid_method_path_key" ON "Route"("instanceUuid", "messageUuid", "method", "path");

-- CreateIndex
CREATE INDEX "Request_routeId_idx" ON "Request"("routeId");

-- CreateIndex
CREATE INDEX "Request_timestamp_idx" ON "Request"("timestamp");

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "Route"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
