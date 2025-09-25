import express from 'express';
import { getSignInView, getSignUpView, signUpPost, signInPost, getDriveView, getUploadView} from '../controllers/controller.js';
const router = express.Router();

router.get('/', getSignInView);

router.get('/sign-up', getSignUpView);
router.post('/sign-up', signUpPost);

router.post('/sign-in', signInPost);

router.get('/drive', getDriveView);

router.get('/upload', getUploadView);

export default router;
