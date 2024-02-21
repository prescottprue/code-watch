import type { LoaderFunctionArgs } from "@remix-run/node";

import { authenticator } from "~/services/auth.server";

export const loader = ({ request }: LoaderFunctionArgs) => {
  return authenticator.authenticate("github", request, {
    successRedirect: "/repos",
    failureRedirect: "/login",
  });
};