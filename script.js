import pkg from "@prisma/client";
const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// await prisma.file.deleteMany({});
// const users = await prisma.file.findMany();
// const newSubFolder = await prisma.folder.create({
//   data: {
//     ownerId: 1,                // same user who owns the parent
//     parentId: 1,               // link to the parent folder’s id
//     name: "My subfolder",      // new folder’s name
//     createdAt: new Date()
//   }
// });

// console.log(newSubFolder);


// const addFile = await prisma.file.create({
//   data: {
//     ownerId: 1, // the user who owns it
//     folderId: 9, // My subfolder id
//     fileName: 'example.txt',
//     fileSize: BigInt(12345),
//     mimeType: 'text/plain',
//     uploadedAt: new Date(),
//   },
// });

// console.log(addFile);

// const deleteFile = await prisma.file.deleteMany({
//   where: {
//     id: 36,
//   }
// });

