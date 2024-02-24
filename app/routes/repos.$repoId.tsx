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

import { deleteRepo, getRepo } from "~/models/repo.server";
import { authenticator } from "~/services/auth.server";

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

export default function RepoDetailsPage() {
  const { repo } = useLoaderData<typeof loader>();
  const repoUrl = `https://github.com/${repo.githubOwner}/${repo.githubRepo}`;
  return (
    <div className="my-6 mx-6">
      <h3 className="text-2xl font-bold">
        <Link to="/repos">{repo.githubOwner}</Link>/{repo.githubRepo}
      </h3>
      <p className="py-6">
        Github Link: <a href={repoUrl}>{repoUrl}</a>
      </p>

      <p className="py-6">
        {repo.coverageSnapshots.length ? (
          repo.coverageSnapshots.map((snapshot) => (
            <div key={snapshot.id}>
              <p>branch:{snapshot.branch}</p>
              <p>Created:{snapshot.createdAt}</p>
              <p>Result:{JSON.stringify(snapshot.result)}</p>
            </div>
          ))
        ) : (
          <div>No coverage snapshots captured</div>
        )}
      </p>
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
