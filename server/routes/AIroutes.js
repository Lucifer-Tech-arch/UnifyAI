import express from 'express'
import { generateArticle, generateblogtitle, generateimage } from '../controllers/AIcontroller.js';
import {auth} from '../middlewares/auth.js';

const Airouter = express.Router();

Airouter.post('/generate-article',auth,generateArticle);
Airouter.post('/blog-titles',auth,generateblogtitle);
Airouter.post('/generate-image',auth,generateimage);

export default Airouter;