import type { User } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByApiKey(apiKey: string) {
  return prisma.user.findFirst({
    where: { apiCredentials: { some: { apiKey: { equals: apiKey } } } },
  });
}

export function getUserListItems() {
  return prisma.user.findMany({
    select: { id: true, githubUsername: true, avatarUrl: true },
    orderBy: { updatedAt: "desc" },
  });
}
export async function createUser(githubUsername: User["githubUsername"]) {
  return prisma.user.create({
    data: {
      githubUsername,
    },
  });
}

export async function deleteUserByEmail(
  githubUsername: User["githubUsername"],
) {
  return prisma.user.delete({ where: { githubUsername } });
}
