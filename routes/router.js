import express from 'express';
import { getSignInView, getSignUpView, signUpPost, signInPost, getDriveView, getUploadView, downloadFile, getFilesView, createFolderPost, editFolderNamePost, deleteFolderPost
  // showFoldersInFilesView
} from '../controllers/controller.js';
const router = express.Router();

router.get('/', getSignInView);

router.get('/sign-up', getSignUpView);
router.post('/sign-up', signUpPost);

router.post('/sign-in', signInPost);

router.get('/drive', getDriveView);

// router.get('/upload', getUploadView);

router.post('/download', downloadFile);

router.get('/files', getFilesView);
router.get('/files/:id', getFilesView);
// router.get('/files/:id', showFoldersInFilesView);
router.post('/files', createFolderPost); 
router.post('/files/:id', createFolderPost);

router.post('/edit-folder-name', editFolderNamePost);

router.post('/delete-folder', deleteFolderPost);

export default router;
