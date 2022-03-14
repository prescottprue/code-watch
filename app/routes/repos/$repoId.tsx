import { LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";
import { Repo } from "@prisma/client";

type LoaderData = {
  repo: Repo
};

export let loader: LoaderFunction = async ({ params, request }) => {
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