import { useLoaderData } from "@remix-run/react";
import { db } from "~/db.server";
import { Repo } from "@prisma/client";

type LoaderData = {
  repo: Repo
};

export const loader = async ({ params, request }) => {
  console.log('params in Repo loader', params);

  const repo = await db.repo.findUnique({
    where: { id: params.repoId }
  });
  if (!repo) throw new Error("repo not found");
  const data: LoaderData = { repo };
  return data;
};

export default function RepoRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <p>{data.repo.name}</p>
    </div>
  );
}