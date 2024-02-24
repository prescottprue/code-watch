import type { ActionFunctionArgs } from "@remix-run/node";
import { Form, useSearchParams } from "@remix-run/react";

import { authenticator } from "~/services/auth.server";

// TODO: Load github user options for user within loader

export const action = async ({ request }: ActionFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw new Error("user is required");
  }
  const formData = await request.formData();
  const inviteEmail = String(formData.get("inviteEmail"));
  if (!inviteEmail) {
    throw new Error("inviteEmail required");
  }
  // TODO: Invite by email
  return null;
};

export default function NewRepoPage() {
  const [params] = useSearchParams();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <Form method="post">
        <h1 className="text-3xl font-bold">Invite Users</h1>
        <div className="flex space-x-4 mb-6">
          <label className="flex flex-1 flex-col gap-1">
            <span>Search: </span>
            <input
              name="inviteEmail"
              placeholder="Github Email"
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
    </div>
  );
}
