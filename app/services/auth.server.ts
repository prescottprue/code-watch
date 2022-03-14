// app/services/auth.server.ts
import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import { GitHubStrategy } from "remix-auth-github";
import { User } from "@prisma/client";
import { db } from "~/utils/db.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
let authenticator = new Authenticator<User>(sessionStorage);

if (!process.env.GITHUB_OAUTH_SECRET) {
  throw new Error('GITHUB_OAUTH_SECRET secret not set')
}

const hostUrl = process.env.HOST_URL || process.env.NODE_ENV === 'production'
? 'https://code-watch-cloud.fly.dev'
: "http://localhost:3000"

console.log('host url ----', hostUrl)

let gitHubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_OAUTH_CLIENT_ID || '5417f5417163ff44ae16',
    clientSecret: process.env.GITHUB_OAUTH_SECRET,
    callbackURL: `${hostUrl}/auth/github/callback`,
  },
  // extraParams.tokenType
  async ({ accessToken, profile }) => {
    const { login: username } = profile._json
    console.log('in success username:', username)
    try {
      const existingUser = await db.user.findFirst({ where: { username } })
      console.log('existing user loaded', existingUser)
      if (existingUser) {
        return existingUser
      }
      // Get the user data from your DB or API using the tokens and profile
      return db.user.create({ data: { username, avatarUrl: profile.photos[0].value } });
    } catch(err) {
      console.log('error', err)
      throw err
    }
  }
);

authenticator.use(gitHubStrategy);

export { authenticator }