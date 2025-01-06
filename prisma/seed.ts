import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const githubUsername = "octocat";

  // cleanup the existing database
  await prisma.user.delete({ where: { githubUsername } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const user = await prisma.user.create({
    data: {
      githubUsername,
    },
  });

  await prisma.repo.create({
    data: {
      owner: "octocat",
      repo: "Hello-World",
      provider: 'github',
      userId: user.id,
    },
  });

  await prisma.repo.create({
    data: {
      owner: "octocat",
      repo: "Hello-World-2",
      provider: 'github',
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
