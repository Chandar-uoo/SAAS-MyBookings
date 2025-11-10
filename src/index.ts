import { PrismaClient } from "@prisma/client";

import dotenv from 'dotenv';


dotenv.config(); // automatically loads .env from root

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });

  console.log('User created:', user);

  const users = await prisma.user.findMany();
  console.log('All users:', users);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
