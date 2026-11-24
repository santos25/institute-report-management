-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" TEXT NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- CreateTable
CREATE TABLE "_DegreeToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DegreeToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DegreeToUser_B_index" ON "_DegreeToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "_DegreeToUser" ADD CONSTRAINT "_DegreeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Degree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DegreeToUser" ADD CONSTRAINT "_DegreeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

