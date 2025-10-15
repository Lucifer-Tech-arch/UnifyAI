import express from 'express'
import { getpublishcreations, getusercreations, togglelikecreations } from '../controllers/usercontroller.js';

const userRouter = express.Router();

userRouter.get('/get-user-creations',auth,getusercreations);
userRouter.get('/get-publish-creations',auth,getpublishcreations);
userRouter.post('/toggle-like-creation',auth,togglelikecreations);

export default userRouter;