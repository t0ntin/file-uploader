import {addNewUserToDB, getFilesFromDB, getUrl, createFolderInDB, getFoldersFromDb, getRootFiles, getRootFolders, getSubFolders, getFilesInSelectedFolder, getSelectedFolderId, editFolderName, deleteFolder, deleteFile } from '../db/user.js';
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
  const url = await getUrl(Number(req.body.id));
  res.redirect(url);
}

async function createFolderPost(req, res) {
  try {
    const parentId = req.params.id ? Number(req.params.id) : null;
    const ownerId = req.user.id;
    const { newFolderName } = req.body;

    if (!newFolderName) {
      req.flash('error', 'Folder name is required');
      return res.redirect(parentId ? `/files/${parentId}` : '/files');
    }

    await createFolderInDB(ownerId, parentId, newFolderName);
    
    req.flash('success', 'Folder created successfully');
    res.redirect(parentId ? `/files/${parentId}` : '/files');
    
  } catch (error) {
    console.error('Error creating folder:', error);
    req.flash('error', 'Error creating folder');
    const parentId = req.params.id ? Number(req.params.id) : null;
    res.redirect(parentId ? `/files/${parentId}` : '/files');
  }
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
  console.log('this is parent id: ', req.body.parentId);
  const parentId = req.body.parentId ? Number(req.body.parentId) : null;
  const folderId = Number(req.body.selectedForDeletion);
  await deleteFolder(folderId);
  res.redirect(parentId ? `/files/${parentId}` : '/files');
}

async function getDetailsView(req, res) {
  const files = await getFilesFromDB();

  res.render('details', {title: 'All file details:', files})
}

async function deleteFilePost(req, res) {
  const parentId = req.body.parentId ? Number(req.body.parentId) : null;
  const id = Number(req.body.id);
  await deleteFile(id);
  res.redirect(parentId ? `/files/${parentId}` : '/files');
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
  getDetailsView,
  deleteFilePost,

}

