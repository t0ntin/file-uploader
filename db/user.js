import pkg from "@prisma/client";
import bcrypt from 'bcryptjs';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function addNewUserToDB(firstName, lastName, email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.User.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
      },
    });

    console.log('User added:', user);
    return user;
  } catch (err) {
    console.error('Error adding user:', err);
    throw err;
  }
}


export {
  addNewUserToDB,

}