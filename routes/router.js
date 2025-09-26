import express from 'express';
import { getSignInView, getSignUpView, signUpPost, signInPost, getDriveView, getUploadView, downloadFile, getFilesView, createFolderPost} from '../controllers/controller.js';
const router = express.Router();

router.get('/', getSignInView);

router.get('/sign-up', getSignUpView);
router.post('/sign-up', signUpPost);

router.post('/sign-in', signInPost);

router.get('/drive', getDriveView);

router.get('/upload', getUploadView);

router.post('/download', downloadFile);

router.get('/files', getFilesView);
router.post('/create-folder', createFolderPost);

export default router;
