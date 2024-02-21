import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { createRepo } from "~/models/repo.server";
import { requireUserId } from "~/session.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const githubOwner = formData.get("githubOwner");
  const githubRepo = formData.get("githubRepo");

  if (typeof githubOwner !== "string" || githubOwner.length === 0) {
    return json(
      { errors: { githubRepo: null, githubOwner: "Owner is required" } },
      { status: 400 },
    );
  }

  if (typeof githubRepo !== "string" || githubRepo.length === 0) {
    return json(
      { errors: { githubRepo: "Repo is required", githubOwner: null } },
      { status: 400 },
    );
  }

  const repo = await createRepo({ githubOwner, githubRepo, userId });

  return redirect(`/repos/${repo.id}`);
};

export default function NewRepoPage() {
  const actionData = useActionData<typeof action>();
  const githubOwnerRef = useRef<HTMLInputElement>(null);
  const githubRepoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (actionData?.errors?.githubOwner) {
      githubOwnerRef.current?.focus();
    } else if (actionData?.errors?.githubRepo) {
      githubRepoRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Github Owner: </span>
          <input
            ref={githubOwnerRef}
            name="githubOwner"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.githubOwner ? true : undefined}
            aria-errormessage={
              actionData?.errors?.githubOwner ? "githubOwner-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.githubOwner ? (
          <div className="pt-1 text-red-700" id="githubOwner-error">
            {actionData.errors.githubOwner}
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Github Repo: </span>
          <input
            ref={githubRepoRef}
            name="githubRepo"
            className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
            aria-invalid={actionData?.errors?.githubRepo ? true : undefined}
            aria-errormessage={
              actionData?.errors?.githubRepo ? "githubRepo-error" : undefined
            }
          />
        </label>
        {actionData?.errors?.githubRepo ? (
          <div className="pt-1 text-red-700" id="githubRepo-error">
            {actionData.errors.githubRepo}
          </div>
        ) : null}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
