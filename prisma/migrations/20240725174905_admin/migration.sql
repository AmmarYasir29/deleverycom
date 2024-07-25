-- CreateTable
CREATE TABLE "Super" (
    "id" SERIAL NOT NULL,
    "fullname" VARCHAR(300) NOT NULL,
    "username" VARCHAR(20) NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Super_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Super_username_key" ON "Super"("username");
