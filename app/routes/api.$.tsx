import { type LoaderFunction, json } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  return json(
    { message: "Route not found, please check url" },
    { status: 404 },
  );
};
