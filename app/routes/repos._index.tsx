import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, NavLink, useLoaderData } from "@remix-run/react";

import { getRepoListItems } from "~/models/repo.server";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  const repos = await getRepoListItems(user?.githubUsername as string);
  return json({ repos });
};

export default function ReposIndexPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="h-full w-full border-r bg-gray-50 px-8 my-8">
      <h1 className="text-3xl font-bold">Repos</h1>
      <Link to="new" className="block p-4 text-xl text-blue-500">
        + New Repo
      </Link>
      <div>
        {data.repos?.length === 0 ? (
          <p className="p-4">No repos yet</p>
        ) : (
          <ol>
            {data.repos.map((repo) => (
              <li key={repo.id}>
                <NavLink
                  className={({ isActive }) =>
                    `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                  }
                  to={repo.id}
                >
                  📝 {repo.githubOwner}/{repo.githubRepo}
                </NavLink>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
