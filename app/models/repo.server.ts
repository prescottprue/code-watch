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
      owner: true,
      repo: true,
      coverageSnapshots: true,
    },
    where: { id },
  });
}

export function getRepoListItems(owner: string, provider = 'github') {
  return prisma.repo.findMany({
    select: { id: true, owner: true, repo: true },
    where: { owner, provider },
    orderBy: { updatedAt: "desc" },
  });
}

export function createRepo({
  owner,
  repo,
  provider,
  userId,
}: Pick<Repo, "owner" | "repo" | 'provider'> & {
  userId: User["id"];
}) {
  return prisma.repo.create({
    data: {
      owner,
      repo,
      provider,
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
