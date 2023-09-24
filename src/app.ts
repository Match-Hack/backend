import express, {
    Express
} from 'express';
import cors from 'cors';

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const DB_URL = process.env.DB_URL ?? "";
mongoose.connect(DB_URL);

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

const app: Express = express();
app.use(cors(
    {
      origin: "https://lens-app-amber.vercel.app",
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Referer'],
    }
  ))
import newUserRouter from './routes/newUser';
import likeRouter from './routes/like';
import profilFilter from './routes/profileFiltered';


app.use("/user",newUserRouter);
app.use("/like", likeRouter);
app.use("/profile", profilFilter);

export default app;