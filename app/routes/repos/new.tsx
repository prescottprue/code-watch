import type { ActionFunction } from "remix";
import { useActionData, redirect, json } from "remix";
import { requireUserId } from "~/services/session.server";
import { db } from "~/utils/db.server";

function validateProjectName(name: string) {
  if (name.length < 3) {
    return `That project's name is too short`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    name: string | undefined;
  };
  fields?: {
    name: string;
  };
};


const badRequest = (data: ActionData) =>
  json(data, { status: 400 });

// TODO: Use loader to load list of Repos for user to choose from
export const action: ActionFunction = async ({
  request
}) => {
  console.log('before user load')
  const userId = await requireUserId(request);
  if (!userId) {
    return redirect('/login');
  }
  const form = await request.formData();
  console.log('form', form)
  const name = form.get("name");
  if (typeof name !== "string") {
    return badRequest({
      formError: `Form not submitted correctly.`
    });
  }

  const fieldErrors = {
    name: validateProjectName(name),
  };
  const fields = { name };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields });
  }

  // Create new project
  // TODO: Interact with Github to get info for repo create
  const project = await db.repo.create({ data: { ...fields, userId } });
  // Navigate to new project page
  return redirect(`/repos/${project.id}`);
};

export default function NewProjectRoute() {
  const actionData = useActionData<ActionData>();
  return (
    <div>
      <p>Add a project</p>
      <form method="post">
        <div>
          <label>
            Name:{" "}
            <input
              type="text"
              defaultValue={actionData?.fields?.name}
              name="name"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.name) ||
                undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.name
                  ? "name-error"
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p
              className="form-validation-error"
              role="alert"
              id="name-error"
            >
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}