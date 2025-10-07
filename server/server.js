import express from 'express'
import cors from 'cors';
import { clerkMiddleware, requireAuth } from '@clerk/express'
import dotenv from 'dotenv'
import Airouter from './routes/AIroutes.js';

const app = express();
dotenv.config();

const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json());
app.use(clerkMiddleware()) //if user found then attaches auth object with request object under auth key

app.get("/",(req,res) => {
    res.send("Home route");
})
app.use('/api/ai',Airouter);

app.use(requireAuth())

app.listen(port,() => {
    console.log(`app listening on port ${port}`);
})
