import { CoverageSnapshot } from "@prisma/client";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { GithubIcon } from "~/components/GithubIcon";
import { ResultsTable } from "~/components/ResultsTable";
import { getRepo } from "~/models/repo.server";
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
  console.log('repo', repo?.coverageSnapshots[0].result)
  if (!repo) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ repo });
};

export default function RepoDetailsPage() {
  const { repo } = useLoaderData<typeof loader>();
  const repoUrl = `https://github.com/${repo.githubOwner}/${repo.githubRepo}`;
  console.log('repo', repo)
  return (
    <div className="py-6 px-6 w-full">
      <h3 className="text-2xl font-bold">
        <Link to="/repos">{repo.githubOwner}</Link>/{repo.githubRepo}
      </h3>
      <div className="flex justify-end">
        {" "}
        <a href={repoUrl}>
          <GithubIcon />
        </a>
      </div>
      <div className="flex justify-center w-full my-8">
        {repo.coverageSnapshots?.length ? (
          <ResultsTable
            repoUrl={repoUrl}
            coverageSnapshots={
              repo.coverageSnapshots as [] as CoverageSnapshotWithResult[]
            }
          />
        ) : (
          <div>
            <h3 className="text-m font-bold">No coverage snapshots</h3>
            <div className="flex flex-col items-center">
              <p><pre style={{ display: "inline" }}>POST</pre> results to:</p><br />
              <p>/api/repos/{repo.githubOwner}/{repo.githubRepo}/coverage</p>
            </div>
          </div>
        )}
      </div>
      <hr className="my-4" />
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
