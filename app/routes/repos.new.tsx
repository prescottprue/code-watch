import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useSearchParams } from "@remix-run/react";
import { useRef } from "react";

// import { createRepo } from "~/models/repo.server";
import { authenticator } from "~/services/auth.server";

interface GithubRepo {
  name: string
  full_name: string
  url: string
  id: string
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  const url = new URL(request.url)
  const search = new URLSearchParams(url.search);

  // Leverage Github's search API if user provided search exists
  if (search.has('q')) {
    const searchParams = new URLSearchParams({ q: `${search.get('q')} user:${user?.githubUsername}` })
    const reposResponse = await fetch(`https://api.github.com/search/repositories?${searchParams.toString()}`, { headers: { Authorization: `Bearer ${user?.githubToken}`}})
    const { items: reposList } = await reposResponse.json()
    return {
      githubUsername: user?.githubUsername,
      repos: (reposList) as GithubRepo[]
    }
  }

  const reposResponse = await fetch(`https://api.github.com/users/${user?.githubUsername}/repos?sort=updated`, { headers: { Authorization: `Bearer ${user?.githubToken}`}})
  const reposList = await reposResponse.json()
  return {
    githubUsername: user?.githubUsername,
    repos: (reposList) as GithubRepo[]
  }
}

export default function NewRepoPage() {
  const loaderData = useLoaderData<typeof loader>()
  const [params] = useSearchParams()
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <Form
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <h1 className="text-3xl font-bold">Add Repos</h1>
      <p className="text-md mb-4">Switch the toggle next to any repo to add it to Code Watch.</p>
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
      <ol className="flex w-full flex-col gap-1">
        {loaderData.repos.map((repo) => (
          <li key={repo.id} className="flex-col">
            <div className="flex-row inline-flex py-2">
              <label className="inline-flex items-center cursor-pointer mr-4" htmlFor={`${repo.id}-enable`}>
                <input type="checkbox" value="" className="sr-only peer" id={`${repo.id}-enable`} />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
              <h2 className="text-lg">{repo.full_name}</h2>
            </div>
            <hr />
          </li>
        ))}
      </ol>
      {/* <input type="hidden" name="user" value={loaderData.githubUsername} /> */}

    </Form>
  );
}
