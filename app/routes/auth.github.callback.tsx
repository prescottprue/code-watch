import type { LoaderFunctionArgs } from "@remix-run/node";

import { authenticator } from "~/services/auth.server";

export const loader = ({ request }: LoaderFunctionArgs) => {
  console.log('loader of github callback route')
  return authenticator.authenticate("github", request, {
    successRedirect: "/repos",
    failureRedirect: "/login",
  });
};