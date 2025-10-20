import express from 'express'
import { getpublishcreations, getUserCreations, togglelikecreations } from '../controllers/usercontroller.js';
import {auth} from '../middlewares/auth.js';

const userRouter = express.Router();

userRouter.get('/get-user-creations',auth,getUserCreations);
userRouter.get('/get-publish-creations',auth,getpublishcreations);
userRouter.post('/toggle-like-creation',auth,togglelikecreations);

export default userRouter;