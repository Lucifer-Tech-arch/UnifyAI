import express from 'express'
import { backgroundremoval, generateArticle, generateblogtitle, generateimage, removeobject, reviewresume } from '../controllers/AIcontroller.js';
import {auth} from '../middlewares/auth.js';
import {upload} from '../config/multer.js'

const Airouter = express.Router();

Airouter.post('/generate-article',auth,generateArticle);
Airouter.post('/blog-titles',auth,generateblogtitle);
Airouter.post('/generate-image',auth,generateimage);
Airouter.post('/background-removal',upload.single('image'),auth,backgroundremoval);
Airouter.post('/remove-object',auth,upload.single('image'),removeobject);
Airouter.post('/review-resume',auth,upload.single('resume'),reviewresume);

export default Airouter;