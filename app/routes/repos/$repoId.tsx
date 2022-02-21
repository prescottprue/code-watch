import { LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

type LoaderData = {
  project: { id: string; name: string }
};

type Params = {
  projectId: string
}

export let loader: LoaderFunction = async ({ params, request }) => {
  console.log('params in project loader', params); // <-- {jokeId: "123"}

  const project = await db.project.findUnique({
    where: { id: params.projectId }
  });
  if (!project) throw new Error("project not found");
  const data: LoaderData = { project };
  return data;
};

export default function ProjectRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <p>{data.project.name}</p>
      <p>
        Why don't you find hippopotamuses hiding in trees?
        They're really good at it.
      </p>
    </div>
  );
}