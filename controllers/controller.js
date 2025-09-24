import {addNewUserToDB } from '../db/user.js';
import { body, validationResult } from "express-validator";
import passport from 'passport';
import express from 'express';


function getSignInView(req, res) {
  res.render('index', {title: "Sign in"})
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
    successRedirect: '/drive',
    failureRedirect: '/',
  })(req, res, next);
  console.log('success');
};

async function getDriveView(req, res) {
  res.render('drive', {title: 'Your Drive'})
}

export {
  getSignInView,
  getSignUpView,
  signUpPost,
  signInPost,
  getDriveView,

}