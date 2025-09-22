import {addNewUserToDB } from '../db/user.js';
import { body, validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import passport from 'passport';
import e from 'express';


function getSignInView(req, res) {
  res.render('index', {title: "Sign in"})
}

function getSignUpView(req, res) {
  res.render('sign-up', {title: "Sign up"})
}

async function signUpPost(req, res, next) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const {firstName, lastName, email} = req.body;
    await addNewUserToDB(firstName, lastName, email, hashedPassword);
      res.render('sign-up', {title: 'Success'})
  } catch (error) {
      console.error(error);
      next(error);
  }
};

export {
  getSignInView,
  getSignUpView,
  signUpPost,

}