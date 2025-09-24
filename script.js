import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

const users = await prisma.User.findMany();
console.log('users are: ', users);
