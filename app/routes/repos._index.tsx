import { Link } from "@remix-run/react";

export default function ReposIndexPage() {
  return (
    <p>
      No repo selected. Select a repo on the left, or{" "}
      <Link to="new" className="text-blue-500 underline">
        link a new repo
      </Link>
    </p>
  );
}
