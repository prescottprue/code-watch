import {
  createCookieSessionStorage,
  redirect
} from "@remix-run/node";
import { db } from "~/db.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session",
    // normally you want this to be `secure: true`
    // but that doesn't work on localhost for Safari
    // https://web.dev/when-to-use-local-https/
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true
  }
});

function getUserSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("user")?.id;
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("user")?.id;
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo]
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== 'string') {
    return null
  }
  try {
    const userProfile = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true }
    });
    console.log('user profile loaded', userProfile)
    return userProfile;
  } catch {
    throw new Error('Error creating profile')
    // throw logout(request);
  }
}

export let { getSession, commitSession, destroySession } = sessionStorage;

