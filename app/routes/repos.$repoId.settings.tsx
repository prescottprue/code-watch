import { CoverageSnapshot } from "@prisma/client";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { GithubIcon } from "~/components/GithubIcon";
import { deleteRepo, getRepo } from "~/models/repo.server";
import { authenticator } from "~/services/auth.server";

interface CountItem {
  pct: number;
  total: number;
  covered: number;
  skipped: number;
}
export interface Result {
  total: {
    lines: CountItem;
    branches: CountItem;
    functions: CountItem;
    statements: CountItem;
    branchesTrue: CountItem;
  };
}

export type CoverageSnapshotWithResult = { result: Result } & CoverageSnapshot;

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  invariant(params.repoId, "repoId not found");

  const repo = await getRepo({ id: params.repoId, userId: user?.id as string });
  if (!repo) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ repo });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  invariant(params.repoId, "repoId not found");

  await deleteRepo({ id: params.repoId, userId: user?.id as string });

  return redirect("/repos");
};

export default function RepoSettingsPage() {
  const { repo } = useLoaderData<typeof loader>();
  const repoUrl = `https://github.com/${repo.githubOwner}/${repo.githubRepo}`;

  return (
    <div className="my-6 mx-6 w-full">
      <h3 className="text-2xl font-bold">
        <Link to="/repos">{repo.githubOwner}</Link>/{repo.githubRepo}
      </h3>
      <div className="flex justify-end">
        {" "}
        <a href={repoUrl}>
          <GithubIcon />
        </a>
      </div>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  if (error.status === 404) {
    return <div>Repo not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
