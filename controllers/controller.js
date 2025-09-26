import {addNewUserToDB, getFilesFromDB, findFileById, createFolderInDB, getFoldersFromDb } from '../db/user.js';
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
  const files = await getFilesFromDB(); 
  const folders = await getFoldersFromDb();
  res.render('files', {title: 'Your files:', message: null,  files, folders})
}

async function downloadFile(req, res) {
  const file = await findFileById(Number(req.body.id));


}

async function createFolderPost(req, res) {
  console.log('this is req.body: ', req.body);
  const parentId = req.body.parentId || null;
  const ownerId = req.user.id;
  const files = await getFilesFromDB(); 
  await createFolderInDB(ownerId, parentId, req.body.newFolderName);
  const folders = await getFoldersFromDb();
  console.log(folders);
  res.render('files', {title: 'Your files:', message: 'Folder created', files, folders})
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

}

