-- CreateTable
CREATE TABLE "PayList" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "doc_no" TEXT,
    "trans_type" TEXT,
    "due_date" TEXT,
    "recipient" TEXT
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "u_id" INTEGER NOT NULL,
    "role" TEXT NOT NULL
);
