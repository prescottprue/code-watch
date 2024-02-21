import { User } from "@prisma/client";
import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";

import { prisma } from "~/db.server";
import { sessionStorage } from "~/session.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
const authenticator = new Authenticator<User>(sessionStorage);

if (!process.env.GITHUB_OAUTH_SECRET) {
  throw new Error('GITHUB_OAUTH_SECRET secret not set')
}

const hostUrl = process.env.NODE_ENV === 'production'
? 'https://code-watch-cloud.fly.dev'
: "http://localhost:3000"

const gitHubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_OAUTH_CLIENT_ID || '5417f5417163ff44ae16',
    clientSecret: process.env.GITHUB_OAUTH_SECRET,
    callbackURL: `${hostUrl}/auth/github/callback`,
  },
  // extraParams.tokenType
  async ({ accessToken, profile }) => {
    const { login: githubUsername } = profile._json
    try {
      const existingUser = await prisma.user.findFirst({ where: { githubUsername } })
      if (existingUser) {
        return existingUser
      }
      // Get the user data from your DB or API using the tokens and profile
      const newUser = await prisma.user.create({ data: { githubUsername, avatarUrl: profile.photos[0].value, githubToken: accessToken } });
      return newUser
    } catch(err) {
      console.log('Error in Github Auth', err)
      throw err
    }
  }
);

authenticator.use(gitHubStrategy);

export { authenticator }