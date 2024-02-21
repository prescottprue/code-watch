import { ActionFunctionArgs, redirect } from "@remix-run/node";

import { authenticator } from "~/services/auth.server";

export const loader = () => {
  console.log('loader of github index route')
  return redirect("/login");
}

export async function action({ request }: ActionFunctionArgs) {
  console.log('action of github index route')
  return await authenticator.authenticate("github", request);
};