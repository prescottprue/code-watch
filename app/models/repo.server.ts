import type { User, Repo } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Repo } from "@prisma/client";

export function getRepo({
  id,
}: Pick<Repo, "id"> & {
  userId: User["id"];
}) {
  return prisma.repo.findFirst({
    select: {
      id: true,
      githubOwner: true,
      githubRepo: true,
      coverageSnapshots: true,
    },
    where: { id },
  });
}

export function getRepoListItems(githubOwner: string) {
  return prisma.repo.findMany({
    select: { id: true, githubOwner: true, githubRepo: true },
    where: { githubOwner },
    orderBy: { updatedAt: "desc" },
  });
}

export function createRepo({
  githubOwner,
  githubRepo,
  userId,
}: Pick<Repo, "githubOwner" | "githubRepo"> & {
  userId: User["id"];
}) {
  return prisma.repo.create({
    data: {
      githubOwner,
      githubRepo,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteRepo({
  id,
  userId,
}: Pick<Repo, "id"> & { userId: User["id"] }) {
  return prisma.repo.deleteMany({
    where: { id, userId },
  });
}
