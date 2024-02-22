import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(githubUsername: User["githubUsername"]) {
  return prisma.user.create({
    data: {
      githubUsername,
    },
  });
}

export async function deleteUserByEmail(githubUsername: User["githubUsername"]) {
  return prisma.user.delete({ where: { githubUsername } });
}
