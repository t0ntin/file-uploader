import dotenv from "dotenv";
dotenv.config();
import "./config/cloudinary.js";
import { v2 as cloudinary } from 'cloudinary';
import express from 'express';
import flash from 'connect-flash';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import connectPgSimple from "connect-pg-simple";
import router from './routes/router.js';
import bcrypt from 'bcryptjs';

import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import multer from 'multer';
import fs from 'fs';
import pkg from "@prisma/client";
// import { storeFileInfoInDB } from './db/user.js';
const { PrismaClient } = pkg;
const prisma = new PrismaClient();
console.log("Prisma ready!");
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
  secret: "process.env.SESSION_SECRET", 
  resave: false,
  saveUninitialized: false,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, // clean up expired sessions every 2 minutes
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
  },

}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(
    { usernameField: "email" }, 
    async (email, password, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          return done(null, false, { message: "Incorrect email" });
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);

        if (!isValid) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // store only the user ID in the session
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user); 
  } catch (err) {
    done(err);
  }
});


app.use('/', router);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // folder where files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // unique file name
  }
});

// const upload = multer({ storage }); THIS WAS USED TO UPLOAD FILES TO MY COMP.

// app.post('/upload/:folderId', upload.single('file'), async (req, res) => {
//   console.log('this is req.file: ', req.file);
//   // console.log('this is req.user: ', req.user);
//   console.log('this is req params: ', req.params.folderId);
//   const folderId = Number(req.params.folderId);
//   await storeFileInfoInDB(req.user.id, folderId, req.file.originalname, req.file.mimetype, req.file.size);
//   res.redirect('/files');
// });
// Multer config (keeps files in /tmp until uploaded to Cloudinary)
const upload = multer({ dest: 'tmp/', limits: { fileSize: 3 * 1024 * 1024 } });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Get folder ID from hidden input
    const folderId = req.body.folderId ? Number(req.body.folderId) : null;

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'Files', // optional
    });

    // Delete temp file
    fs.unlinkSync(req.file.path);
    console.log('folderId from body:', req.body.folderId);

    // Save file info in DB
    await prisma.file.create({
      data: {
        ownerId: req.user.id,
        folderId: folderId,
        fileName: req.file.originalname,
        fileSize: BigInt(req.file.size),
        mimeType: req.file.mimetype,
        url: result.secure_url,
      },
    });
    req.flash('success', 'File uploaded successfully.')
    // Redirect to correct folder
    if (folderId === null) {
      res.redirect('/files');
    } else {
      res.redirect(`/files/${folderId}`);
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).send('Upload failed');
  }
});




app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    req.flash('error', 'File is too large (Max: 2MB)');
    return res.redirect('/files');
  }
  next(err);
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