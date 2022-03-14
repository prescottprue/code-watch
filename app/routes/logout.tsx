import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";
import { authenticator } from "~/services/auth.server";

export const action: ActionFunction = async ({
  request
}) => {
  return authenticator.logout(request, { redirectTo: "/login" });
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};