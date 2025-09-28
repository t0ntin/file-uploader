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

async function getRootFolders(id) {
  try {
    const rootFolders = await prisma.folder.findMany({
      where: {
        ownerId: id,
        parentId: null,
      }
    })
    return rootFolders;
  } catch (error) {
    console.error('Error retrieving root folders', error);
    throw error;
  }

}

async function getRootFiles(id) {
  try {
    const rootFiles = await prisma.file.findMany( {
      where: {
        ownerId: id,
        folderId: null,
      }
    })
    return rootFiles;
  } catch (error) {
    console.error('Error retrieving root files', error);
    throw error;
  }
}

async function getSubFolders (id) {
  try {
    const subFolders = await prisma.folder.findMany( {
      where: {
        parentId: id,
      }
    });
    return subFolders;
  } catch (error) {
    console.error('Error retrieving subfolders', error);
    throw error;
  }
}

async function getFilesInSelectedFolder(id) {
  try {
      const filesInSelectedFolder = await prisma.file.findMany({
    where: {
      folderId: id,
    }
  })
  return filesInSelectedFolder;
  } catch (error) {
    console.error('Error inside getFilesInSelectedFolder', error);
    throw error;
  }
}

async function getSelectedFolderId(id) {
  const folderId = Number(id);
  if (!Number.isInteger(folderId)) return null;

  try {
    const selectedFolder = await prisma.folder.findUnique({
      where: { id: folderId }
    });
    return selectedFolder;
  } catch (error) {
    console.error('Error inside getSelectedFolderId', error);
    throw error;
  }
}

async function editFolderName(id, editedFolderName) {
  try {
    const newName = await prisma.folder.update({
      where: {
        id:id,
      },
      data: {
        name: editedFolderName,
      }
    });
    return newName;
  } catch (error) {
    console.error('Error at editFolderName', error);
    throw error;
  }
}

async function deleteFolder(id) {
  try {
  const deletedFolder = await prisma.folder.delete({
    where: {
      id:id,
    }
  });
  return deletedFolder;
  } catch (error) {
    console.error('Error inside deleteFolder', error);
    throw error;
  }
};


export {
  addNewUserToDB,
  storeFileInfoInDB, 
  getFilesFromDB,
  findFileById,
  createFolderInDB,
  getFoldersFromDb,
  getRootFolders,
  getRootFiles,
  getSubFolders,
  getFilesInSelectedFolder, 
  getSelectedFolderId,
  editFolderName,
  deleteFolder,

}