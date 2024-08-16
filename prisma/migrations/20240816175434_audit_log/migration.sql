-- CreateTable
CREATE TABLE "ApiAuditLog" (
    "id" SERIAL NOT NULL,
    "method" TEXT NOT NULL,
    "urlPath" TEXT NOT NULL,
    "headers" JSONB NOT NULL,
    "queryParams" JSONB NOT NULL,
    "requestBody" JSONB NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "responseStatus" INTEGER,
    "responseBody" JSONB,
    "responseTime" INTEGER,
    "errorMessage" TEXT,
    "errorStack" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiAuditLog_pkey" PRIMARY KEY ("id")
);
