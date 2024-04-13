/*
  Warnings:

  - You are about to alter the column `u_id` on the `User` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "u_id" INTEGER NOT NULL,
    "role" TEXT
);
INSERT INTO "new_User" ("id", "role", "u_id") SELECT "id", "role", "u_id" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
