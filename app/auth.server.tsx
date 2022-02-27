// app/services/auth.server.ts
import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/utils/session.server";
import { GitHubStrategy } from "remix-auth-github";
import { User } from "@prisma/client";
import { db } from "./utils/db.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);

if (!process.env.GITHUB_OAUTH_SECRET) {
  throw new Error('GITHUB_OAUTH_SECRET secret not set')
}

const hostUrl = process.env.NODE_ENV === 'production'
? "http://localhost:3000"
: process.env.HOST_URL || 'https://code-watch-cloud.fly.dev'

console.log('host url ----', hostUrl)

let gitHubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_OAUTH_CLIENT_ID || '5417f5417163ff44ae16',
    clientSecret: process.env.GITHUB_OAUTH_SECRET,
    callbackURL: `${hostUrl}/auth/github/callback`,
  },
  async ({ accessToken, extraParams, profile}) => {
    // TODO: Lookup user based on username first
    console.log('in success', { profile })
    if (db.user.findFirst({ username: profile.displayName })) {

    }
    // Get the user data from your DB or API using the tokens and profile
    return db.user.create({ data: { username: profile.displayName } });
  }
);

authenticator.use(gitHubStrategy);