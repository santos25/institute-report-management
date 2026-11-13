-- CreateTable: Join table for User (teachers) and Degree (grados)
CREATE TABLE "_DegreeToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DegreeToUser_AB_unique" ON "_DegreeToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DegreeToUser_B_index" ON "_DegreeToUser"("B");

-- AddForeignKey
ALTER TABLE "_DegreeToUser" ADD CONSTRAINT "_DegreeToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Degree"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DegreeToUser" ADD CONSTRAINT "_DegreeToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
