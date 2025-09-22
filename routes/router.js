import express from 'express';
import { getSignInView, getSignUpView, signUpPost} from '../controllers/controller.js';
const router = express.Router();

router.get('/', getSignInView);

router.get('/sign-up', getSignUpView);
router.post('/sign-up', signUpPost);
export default router;