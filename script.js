import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

await prisma.file.deleteMany({});
const users = await prisma.file.findMany();
console.log('users are: ', users);
