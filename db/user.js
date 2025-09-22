import pkg from "@prisma/client";
import bcrypt from "bcryptjs";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function addNewUserToDB(firstName, lastName, email, hashedPassword) {
  try {
    // const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password_hash: hashedPassword,
      },
    });

    console.log("User added:", user);
    return user;
  } catch (err) {
    console.error("Error adding user:", err);
    throw err;
  }
}

export {
  addNewUserToDB,

}