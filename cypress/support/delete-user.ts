// Use this to delete a user by their email
// Simply call this with:
// npx ts-node -r tsconfig-paths/register ./cypress/support/delete-user.ts username@example.com
// and that user will get deleted

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { installGlobals } from "@remix-run/node";

import { prisma } from "~/db.server";

installGlobals();

async function deleteUser(githubUsername: string) {
  if (!githubUsername) {
    throw new Error("githubUsername required for login");
  }
  try {
    await prisma.user.delete({ where: { githubUsername } });
  } catch (error) {
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      console.log("User not found, so no need to delete");
    } else {
      throw error;
    }
  } finally {
    await prisma.$disconnect();
  }
}

deleteUser(process.argv[2]);
