import {addNewUserToDB, getFilesFromDB, findFileById, createFolderInDB, getFoldersFromDb, getRootFiles, getRootFolders, getSubFolders, getFilesInSelectedFolder, getSelectedFolderId, editFolderName, deleteFolder } from '../db/user.js';
import { body, validationResult } from "express-validator";
import passport from 'passport';

function getSignInView(req, res) {
  console.log('this is req.user: ', req.user);
  const user = req.user;
  res.render('index', {title: "Sign in", user})
}

function getSignUpView(req, res) {
  res.render('sign-up', {title: "Sign up"})
}

async function signUpPost(req, res, next) {
  try {
    const {firstName, lastName, email, password} = req.body;
    await addNewUserToDB(firstName, lastName, email, password);
      res.render('sign-up', {title: 'Success'})
  } catch (error) {
      console.error(error);
      next(error);
  }
};

async function signInPost(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/upload',
    failureRedirect: '/',
  })(req, res, next);
  console.log('success');
};

async function getDriveView(req, res) {
  res.render('drive', {title: 'Your Drive'})
};


async function getUploadView(req, res) {
  res.render('upload', {title: "Upload a file", message: null})
};

async function getFilesView(req, res) {
  // const allFiles = await getFilesFromDB(); 
  // const rootFolders = await getRootFolders(req.user.id);
  // const rootFiles = await getRootFiles(req.user.id);
  // const filesInSelectedFolder = await getFilesInSelectedFolder(Number(req.params.id));
  // const selectedFolder = await getSelectedFolderId(Number(req.params.id));
  let rootFolders = [];
  let rootFiles = [];
  let subFolders = [];
  let filesInSelectedFolder = [];
  let selectedFolder = null;

  if (req.params.id) {
    // CASE 2: Inside a folder
    const folderId = req.params.id ? Number(req.params.id) : null;

    console.log('This is folderId:', folderId);

    selectedFolder = await getSelectedFolderId(folderId);

    // Files inside this folder
    filesInSelectedFolder = await getFilesInSelectedFolder(folderId);

    // Subfolders inside this folder
    subFolders = await getSubFolders(folderId);
  } else {
    // CASE 1: Root
    rootFolders = await getRootFolders(req.user.id);
    rootFiles = await getRootFiles(req.user.id);
  }
  console.log('this is selectedfolder: ', selectedFolder);
  res.render('files', {title: 'Your files:', message: null,  rootFiles, rootFolders, subFolders, filesInSelectedFolder, selectedFolder})
}



// async function showFoldersInFilesView(req, res) {
//   const files = await getFilesFromDB(); 
//   const rootFolders = await getRootFolders(req.user.id);
//   const allFolders = await getFoldersFromDb();
//   const rootFiles = await getRootFiles(req.user.id);
//   const subFolders = await getSubFolders(Number(req.params.id));
//   const filesInSelectedFolder = await getFilesInSelectedFolder(Number(req.params.id));
//   console.log('selected files', filesInSelectedFolder);
//   res.render('files', {title: 'Your files:', message: null, rootFiles, rootFolders, subFolders, filesInSelectedFolder})
// }

async function downloadFile(req, res) {
  const file = await findFileById(Number(req.body.id));


}

async function createFolderPost(req, res) {
  console.log('this is req.params.parentId: ', req.params.parentId);
  const parentId = Number(req.params.id) || null;
  const ownerId = req.user.id;
  const files = await getFilesFromDB(); 
  const selectedFolder =  await getSelectedFolderId(parentId);
  await createFolderInDB(ownerId, parentId, req.body.newFolderName);
  const folders = await getFoldersFromDb();
  // console.log(folders);
  res.render('files', {title: 'Your files:', message: 'Folder created', rootFiles: null, rootFolders: null, subFolders: null, filesInSelectedFolder: null, selectedFolder})
}

async function editFolderNamePost(req, res) {
  const selectedFolder = Number(req.body.selectedFolder);
  await editFolderName(Number(req.body.folderId), req.body.editedFolderName);
  
  if (isNaN(selectedFolder)) {
    res.redirect('/files');
  } else {
    res.redirect(`/files/${selectedFolder}`);
  }
};

async function deleteFolderPost(req, res) {
  const folderId = Number(req.body.selectedForDeletion);
  await deleteFolder(folderId);
  res.redirect('/files');

}

export {
  getSignInView,
  getSignUpView,
  signUpPost,
  signInPost,
  getDriveView,
  getUploadView,
  downloadFile,
  getFilesView,
  createFolderPost,
  // showFoldersInFilesView,
  editFolderNamePost,
  deleteFolderPost,

}

