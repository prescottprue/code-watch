import { LinksFunction, Link } from "remix";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>CodeWatch</h1>
      <p>Open source dependency and coverage reporting</p>
      <Link
        to="/projects"
        title="CodeWatch Projects"
        aria-label="CodeWatch Projects"
      >
        <span className="logo-medium">Get Started</span>
      </Link>
    </div>
  );
}
