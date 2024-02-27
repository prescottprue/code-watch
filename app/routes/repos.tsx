import { Outlet } from "@remix-run/react";

import { NavbarLayout } from "~/components/NavbarLayout";

export default function ReposPage() {
  return (
    <NavbarLayout>
      <Outlet />
    </NavbarLayout>
  );
}
