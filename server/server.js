import 'dotenv/config'; // ✅ Load environment variables first
import express from 'express';
import cors from 'cors';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import Airouter from './routes/AIroutes.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => {
  res.send('Home route');
});

app.use('/api/ai', Airouter);
app.use(requireAuth());

app.listen(port, () => {
  console.log(`✅ App listening on port ${port}`);
});
