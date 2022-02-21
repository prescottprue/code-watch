import type { ActionFunction, LoaderFunction } from "remix";
import { redirect } from "remix";

import { logout } from "~/utils/session.server";

export const action: ActionFunction = async ({
  request
}) => {
  console.log('oauth callback action', request)
  // TODO: exchange code for access token Post to https://github.com/login/oauth/access_token
  return logout(request);
};

export const loader: LoaderFunction = async () => {
  console.log('oauth callback loader')
  return redirect("/");
};