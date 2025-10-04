import {addNewUserToDB, getFilesFromDB, getUrl, createFolderInDB, getRootFiles, getRootFolders, getSubFolders, getFilesInSelectedFolder, getSelectedFolderId, editFolderName, deleteFolder, deleteFile } from '../db/user.js';
import { body, validationResult } from "express-validator";
import passport from 'passport';





const validateSignUp = [
  body("firstName").trim().notEmpty().withMessage("First name is required").isAlpha().withMessage('First name must only contain letters'),
  body("lastName").trim().notEmpty().withMessage("Last name is required").isAlpha().withMessage('Last name must only contain letters'),
  body("email").trim().isEmail().withMessage("Enter a valid email").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

function getSignUpView(req, res) {
  res.render('sign-up', {title: "Sign up", 
  oldInput: {}})
}

const signUpPost = [
  validateSignUp,
  async (req, res, next) => {
    console.log('Request body:', req.body);
    const errors = validationResult(req);
    console.log('Validation errors:', errors.array());
    if (!errors.isEmpty()) {
      return res.status(400).render("sign-up", { 
        title: "Sign in", 
        user: req.user, 
        oldInput: req.body, 
        errors: errors.array(), 
      });
    }

    try {
      const {firstName, lastName, email, password} = req.body;
      await addNewUserToDB(firstName, lastName, email, password);
        res.render('sign-up', {title: 'Success',  oldInput: {},    errors: []})
    } catch (error) {
        // console.error('Error at signUpPost: ', error);
        if (error.code === 'P2002') {
          return res.render('sign-up', {
            title: 'Sign up',
            errors: [{ msg: 'Email already exists' }], 
            oldInput: {
              firstName: req.body.firstName,
              lastName: req.body.lastName, 
              email: req.body.email
            }
          });
        }
        next(error);
    }
  }
];

function getSignInView(req, res) {
  // console.log('this is req.user: ', req.user);
  const user = req.user;
  res.render('index', {title: "Sign in", user, oldInput: {}})
}

const validateSignIn = [
  body("email").trim().isEmail().withMessage("Enter a valid email").normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

const signInPost = [
  validateSignIn,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("index", { 
        title: "Sign in", 
        user: req.user, 
        oldInput: req.body, 
        errors: errors.array(), 
      });
    }

    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      
      if (!user) {
        // Render the same page with errors (no redirect)
        return res.status(400).render("index", {
          title: "Sign in",
          user: req.user, 
          oldInput: req.body,
          errors: [{ msg: info.message || "Invalid email or password" }]
        });
      }

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect("/files");
      });
    })(req, res, next);
  },
];


function getLogOut(req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
}

async function getDriveView(req, res) {
  res.render('drive', {title: 'Your Drive'})
};

async function getFilesView(req, res) {
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
  try {

    const parentId = req.body.parentId ? Number(req.body.parentId) : null;
    const id = Number(req.body.id);
    await deleteFile(id);
    req.flash('success', 'File deleted')
    res.redirect(parentId ? `/files/${parentId}` : '/files');
  } catch (error) {
      console.error('Error in deleteFile', error);
      req.flash('error', 'Error deleting file');
  }
}

export {
  getSignInView,
  getSignUpView,
  signUpPost,
  signInPost,
  getLogOut,
  getDriveView,
  downloadFile,
  getFilesView,
  createFolderPost,
  // showFoldersInFilesView,
  editFolderNamePost,
  deleteFolderPost,
  getDetailsView,
  deleteFilePost,

}

