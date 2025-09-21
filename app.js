import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pool from './db/pool.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import connectPgSimple from "connect-pg-simple";
import router from './routes/router.js';
import bcrypt from 'bcryptjs';
import dotenv from "dotenv";
dotenv.config();
const PgSession = connectPgSimple(session);


const app = express();
const PORT = process.env.PORT || 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// set up ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({extended:true}));

app.use(session({
  store: new PgSession({ pool: pool }),
  secret: "cats",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day in milliseconds
}));

app.use(passport.session());



app.get(/^\/$|\/index(\.html)?$/, (req, res) => {
  res.render('index', {title: 'ejs is cool' });
});

app.use((req, res) => {
  res.status(404).render('404');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

app.listen(PORT,  (error) => {
  if(error){
    throw error;
  }
  console.log(`server running on port ${PORT}`)
});