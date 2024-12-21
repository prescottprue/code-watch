import { ActionFunction, LoaderFunction, json } from "@remix-run/node";

import { createRepo, getRepoListItems } from "~/models/repo.server";
import { requireApiKey } from "~/session.server";

export const loader: LoaderFunction = async ({ params, request }) => {
  await requireApiKey(request);
  const repos = await getRepoListItems(params.ownerId as string);
  return json(repos);
};

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }
  const { githubUsername, id: userId } = await requireApiKey(request);
  const { repoName } = await request.json();
  if (!repoName) {
    return json({ message: "repoName required" }, 400);
  }
  const newRepo = await createRepo({
    githubOwner: githubUsername,
    userId,
    githubRepo: repoName,
  });
  return json(newRepo);
};
