import express from 'express'
import { generateArticle } from '../controllers/AIcontroller.js';
import {auth} from '../middlewares/auth.js';

const Airouter = express.Router();

Airouter.post('/generate-article',auth,generateArticle);

export default Airouter;