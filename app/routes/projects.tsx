import type { LinksFunction, LoaderFunction } from "remix";
import { Outlet, Link, useLoaderData } from "remix";
import { getUser } from "~/utils/session.server";
import { db } from "~/utils/db.server";

import stylesUrl from "~/styles/projects.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  projectListItems: Array<{ id: string; name: string }>;
};

export let loader: LoaderFunction = async ({ params, request }) => {
  console.log('params in loader', params); // <-- {jokeId: "123"}
  const user = await getUser(request);
  console.log('user', user)

  const data: LoaderData = {
    projectListItems: await db.project.findMany(),
    user
  };
  console.log('data in loader', data)
  return data;
};

export default function ProjectsRoute() {
  const data = useLoaderData<LoaderData>();
  console.log('data in component', data)

  return (
    <div className="projects-layout">
      <header className="projects-header">
        <div className="container">
          <h1 className="home-link">
            <Link
              to="/"
              title="CodeWatch Project"
              aria-label="CodeWatch Project"
            >
              Projects
            </Link>
          </h1>
        </div>
      </header>
      <main className="projects-main">
        <div className="container">
          <div className="projects-list">
            <ul>
              {data.projectListItems.map(project => (
                <li key={project.id}>
                  <Link to={project.id}>{project.name}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
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