import { ActionFunction, LoaderFunction, redirect } from "remix";
import { authenticator } from "~/services/auth.server";

export let loader: LoaderFunction = () => {
  console.log('loader of github index route')
  return redirect("/login");
}

export let action: ActionFunction = ({ request }) => {
  console.log('action of github index route')
  return authenticator.authenticate("github", request);
};