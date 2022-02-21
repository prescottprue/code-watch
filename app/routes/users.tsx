import type { LinksFunction, LoaderFunction } from "remix";
import { Outlet, Link, useLoaderData } from "remix";
import { User } from "@prisma/client";
import { getUser } from "~/utils/session.server";
import { db } from "~/utils/db.server";

import stylesUrl from "~/styles/projects.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  userListItems: Array<User>;
};

export let loader: LoaderFunction = async ({ params, request }) => {
  console.log('params in loader', params); // <-- {jokeId: "123"}
  const user = await getUser(request);
  console.log('user', user)

  const data: LoaderData = {
    userListItems: await db.user.findMany(),
    user
  };
  console.log('data in loader', data)
  return data;
};

export default function UsersRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="users-layout">
      <header className="users-header">
        <div className="container">
          <h1 className="home-link">
            <Link
              to="/"
              title="CodeWatch Project"
              aria-label="CodeWatch Project"
            >
              Users
            </Link>
          </h1>
        </div>
      </header>
      <main className="users-main">
        <div className="container">
          <div className="users-list">
            <ul>
              {data.userListItems.map(user => (
                <li key={user.id}>
                  <Link to={user.id}>{user.username}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add A User
            </Link>
          </div>
          <div className="projects-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}