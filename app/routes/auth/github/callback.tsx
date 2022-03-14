import { LoaderFunction } from "remix";
import { authenticator } from "~/services/auth.server";

export let loader: LoaderFunction = ({ request }) => {
  console.log('loader of github callback route')
  return authenticator.authenticate("github", request, {
    successRedirect: "/repos",
    failureRedirect: "/login",
  });
};