import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { NavbarLayout } from "~/components/NavbarLayout";
import { getUserListItems } from "~/models/user.server";
import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticator.isAuthenticated(request);
  const users = await getUserListItems();
  return json({ users });
};

export default function UsersPage() {
  const data = useLoaderData<typeof loader>();

  return (
    <NavbarLayout>
      <div className="h-full w-80 border-r bg-gray-50">
        <Link to="new" className="block p-4 text-xl text-blue-500">
          + Invite User
        </Link>

        <hr />

        {data.users.length === 0 ? (
          <p className="p-4">No users yet</p>
        ) : (
          <ol>
            {data.users.map((user) => (
              <li key={user.id}>
                <NavLink
                  className={({ isActive }) =>
                    `block border-b p-4 text-xl ${isActive ? "bg-white" : ""}`
                  }
                  to={user.id}
                >
                  📝 {user.githubUsername}
                </NavLink>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </NavbarLayout>
  );
}
