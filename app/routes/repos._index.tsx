import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { getRepoListItems } from "~/models/repo.server";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  const repoListItems = await getRepoListItems(user?.githubUsername as string);
  return json({ repoListItems });
};

export default function ReposIndexPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="h-full w-full border-r bg-gray-50 px-4 my-4">
      <h1 className="text-3xl font-bold">Repos</h1>
      <Link to="new" className="block p-4 text-xl text-blue-500">
        + New Repo
      </Link>
      <div>
        {data.repoListItems.length === 0 ? (
          <p className="p-4">No repos yet</p>
        ) : (
          <ol>
            {data.repoListItems.map((repo) => (
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
