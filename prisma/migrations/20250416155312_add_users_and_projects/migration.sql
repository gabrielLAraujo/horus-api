-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "requestSize" TEXT,
    "responseSize" TEXT,
    "error" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogBody" (
    "id" TEXT NOT NULL,
    "logId" TEXT NOT NULL,
    "requestBody" JSONB,
    "reqHeaders" JSONB,
    "respBody" JSONB,
    "respHeaders" JSONB,

    CONSTRAINT "LogBody_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Log_messageId_idx" ON "Log"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "LogBody_logId_key" ON "LogBody"("logId");

-- AddForeignKey
ALTER TABLE "LogBody" ADD CONSTRAINT "LogBody_logId_fkey" FOREIGN KEY ("logId") REFERENCES "Log"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
