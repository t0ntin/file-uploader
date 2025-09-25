import pkg from "@prisma/client";
import bcrypt from 'bcryptjs';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function addNewUserToDB(firstName, lastName, email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
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

async function storeFileInfoInDB(userId, folderId, originalname, mimetype, fileSize) {
  try {

    const fileInfo = await prisma.file.create({
      data: {
        ownerId: userId, 
        folderId: folderId || null,
        fileName: originalname,
        fileSize: BigInt(fileSize),
        mimeType: mimetype,
        uploadedAt: new Date(),
      }
    })
    return fileInfo;
  } catch(error) {
    console.error('Error adding file: ', error);
    throw error;
  }

}

export {
  addNewUserToDB,
  storeFileInfoInDB, 

}