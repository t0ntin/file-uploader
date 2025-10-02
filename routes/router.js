import express from 'express';
import { getSignInView, getSignUpView, signUpPost, signInPost, getDriveView, downloadFile, getFilesView, createFolderPost, editFolderNamePost, deleteFolderPost, getDetailsView, deleteFilePost, getLogOut
  // showFoldersInFilesView
} from '../controllers/controller.js';
const router = express.Router();

router.get('/', getSignInView);
router.get('/log-out', getLogOut);

router.get('/sign-up', getSignUpView);
router.post('/sign-up', signUpPost);

router.post('/sign-in', signInPost);

router.get('/drive', getDriveView);


router.post('/download', downloadFile);

router.get('/files', getFilesView);
router.get('/files/:id', getFilesView);

router.post('/files', createFolderPost); 
router.post('/files/:id', createFolderPost);

router.post('/edit-folder-name', editFolderNamePost);

router.post('/delete-folder', deleteFolderPost);

router.post('/delete-file', deleteFilePost);

router.get('/details', getDetailsView);

export default router;
