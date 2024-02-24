import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { NavbarLayout } from "~/components/NavbarLayout";
import { getRepoListItems } from "~/models/repo.server";
import { authenticator } from "~/services/auth.server";

export default function ReposPage() {
  return (
    <NavbarLayout>
      <Outlet />
    </NavbarLayout>
  );
}
