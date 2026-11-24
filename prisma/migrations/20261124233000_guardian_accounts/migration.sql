-- CreateTable
CREATE TABLE "Guardian" (
    "id" TEXT NOT NULL,
    "identification" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "failedAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guardian_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuardianAccessLog" (
    "id" TEXT NOT NULL,
    "guardianId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuardianAccessLog_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Student" ADD COLUMN "guardianId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Guardian_identification_key" ON "Guardian"("identification");

-- CreateIndex
CREATE INDEX "GuardianAccessLog_guardianId_idx" ON "GuardianAccessLog"("guardianId");

-- CreateIndex
CREATE INDEX "Student_guardianId_idx" ON "Student"("guardianId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "Guardian"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuardianAccessLog" ADD CONSTRAINT "GuardianAccessLog_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "Guardian"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
