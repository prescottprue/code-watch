import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  useFetcher,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { useRef } from "react";

import { Repo, createRepo, getRepoListItems } from "~/models/repo.server";
// import { createRepo } from "~/models/repo.server";
import { authenticator } from "~/services/auth.server";

interface GithubRepo {
  name: string;
  full_name: string;
  url: string;
  id: string;
  dbRepo: Repo;
  owner: {
    login: string;
  };
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  try {
    const dbRepos = await getRepoListItems(user?.githubUsername as string);
    console.log("db repos", dbRepos);
    const url = new URL(request.url);
    const search = new URLSearchParams(url.search);
    // Leverage Github's search API if user provided search exists
    if (search.has("q")) {
      const searchParams = new URLSearchParams({
        q: `${search.get("q")} user:${user?.githubUsername}`,
      });
      const reposResponse = await fetch(
        `https://api.github.com/search/repositories?${searchParams.toString()}`,
        { headers: { Authorization: `Bearer ${user?.githubToken}` } },
      );
      const { items: githubRepos } = (await reposResponse.json()) as {
        items: GithubRepo[];
      };
      return {
        repos: githubRepos.map((githubRepo) => ({
          ...githubRepo,
          dbRepo: dbRepos.find(
            (dbRepo) =>
              githubRepo.name === dbRepo.githubRepo &&
              githubRepo.owner.login === dbRepo.githubOwner,
          ),
        })),
      };
    }

    const reposResponse = await fetch(
      `https://api.github.com/users/${user?.githubUsername}/repos?sort=updated`,
      { headers: { Authorization: `Bearer ${user?.githubToken}` } },
    );
    const githubRepos = (await reposResponse.json()) as GithubRepo[];
    // TODO: Include whether or not repos are enabled already by querying db
    return {
      repos: githubRepos.map((githubRepo) => ({
        ...githubRepo,
        dbRepo: dbRepos.find(
          (dbRepo) =>
            githubRepo.name === dbRepo.githubRepo &&
            githubRepo.owner.login === dbRepo.githubOwner,
        ),
      })),
    };
  } catch (err) {
    console.error("Error loading repos:", {
      err: (err as Error).message || err,
    });
    return {
      repos: null,
    };
  }
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new Error("user is required");
  }
  const formData = await request.formData();
  const githubRepo = String(formData.get("githubRepo"));
  const githubOwner = String(formData.get("githubOwner"));
  if (!githubOwner || !githubRepo) {
    throw new Error("owner and repo required");
  }
  await createRepo({ githubOwner, githubRepo, userId: user.id });
  return null;
};

export default function NewRepoPage() {
  const loaderData = useLoaderData<typeof loader>();
  const [params] = useSearchParams();
  const fetcher = useFetcher();
  const submit = useSubmit();

  const isSubmitting = fetcher.state === "submitting";
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
      className="my-4 mx-4"
    >
      <Form method="get">
        <h1 className="text-3xl font-bold">Add Repos</h1>
        <p className="text-md mb-4">
          Switch the toggle next to any repo to add it to Code Watch.
        </p>
        <div className="flex space-x-4 mb-6">
          <label className="flex flex-1 flex-col gap-1">
            <span>Search: </span>
            <input
              ref={searchRef}
              name="q"
              defaultValue={params.get("q") || undefined}
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            />
          </label>
          <div className="flex gap-1 flex-col items-center justify-end">
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Search
            </button>
          </div>
        </div>
      </Form>

      {loaderData.repos ? (
        <ol className="flex w-full flex-col gap-1">
          {loaderData.repos.map((repo) => {
            return (
              <li key={repo.id} className="flex-col">
                <fetcher.Form
                  method="post"
                  onChange={(e) => submit(e.currentTarget)}
                >
                  <div className="flex-row inline-flex py-2">
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label
                      className="inline-flex items-center cursor-pointer mr-4"
                      htmlFor={`${repo.id}-enable`}
                    >
                      {/* <button type="submit" value={repo.dbRepo ? "1" : "0"} name="enabled" className="sr-only peer" id={`${repo.id}-enable`} disabled={isSubmitting || !!repo.dbRepo} /> */}
                      <input
                        type="checkbox"
                        defaultChecked={!!repo.dbRepo}
                        name="enabled"
                        className="sr-only peer"
                        id={`${repo.id}-enable`}
                        disabled={isSubmitting || !!repo.dbRepo}
                      />
                      <input
                        type="hidden"
                        name="githubOwner"
                        value={repo.owner.login}
                      />
                      <input
                        type="hidden"
                        name="githubRepo"
                        value={repo.name}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                    <h2 className="text-lg">{repo.full_name}</h2>
                  </div>
                  <hr />
                </fetcher.Form>
              </li>
            );
          })}
        </ol>
      ) : (
        <div>
          Error loading repos from Github - please log out an back in to refresh
          access
        </div>
      )}
    </div>
  );
}
