import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  const testUser = await db.user.create({
    data: {
      username: "asdf2",
      // this is a hashed version of "twixrox"
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u"
    }
  });
  await Promise.all(
    getRepos().map(repo => {
      console.log('test user', testUser.id)
      const data = { userId: testUser.id, ...repo };
      return db.repo.create({ data });
    })
  );
}

seed();

function getRepos() {
  return [
    {
      name: "Test Repo",
    },
  ];
}