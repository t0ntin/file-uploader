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

async function getFilesFromDB() {
  try {
    const files = await prisma.file.findMany();
    return files;
  } catch (error) {
    console.error('Error retrieving file list.', error);
    throw error;
  }

}

async function findFileById(id) {
 const file = await prisma.file.findUnique({
  where: {
    id:id
  }
 })
 return file;
}

async function createFolderInDB(ownerId, parentId, newFolderName) {
  const newFolder = await prisma.folder.create({
    data: {
      ownerId: ownerId,
      parentId: parentId,
      name: newFolderName,
    }
  })
  return newFolder;
}

async function getFoldersFromDb() {
  try {
    const folders = await prisma.folder.findMany();
    return folders;
  } catch (error) {
    console.error('Error retrieving folder list', error);
    throw error;
  }
}

export {
  addNewUserToDB,
  storeFileInfoInDB, 
  getFilesFromDB,
  findFileById,
  createFolderInDB,
  getFoldersFromDb,

}