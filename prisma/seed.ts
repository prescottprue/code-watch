import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  const testUser = await db.user.create({
    data: {
      username: "asdf",
      // this is a hashed version of "twixrox"
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u"
    }
  });
  await Promise.all(
    getProjects().map(joke => {
      console.log('test user', testUser.id)
      const data = { userId: testUser.id, ...joke };
      return db.project.create({ data });
    })
  );
}

seed();

function getProjects() {
  return [
    {
      name: "Test Project",
    },
  ];
}