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

// Enable CORS for all routes
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://lens-app-amber.vercel.app/');
    res.header('Access-Control-Allow-Credentials', "true");
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    next();
  });
import newUserRouter from './routes/newUser';
import likeRouter from './routes/like';
import profilFilter from './routes/profileFiltered';


app.use("/user",newUserRouter);
app.use("/like", likeRouter);
app.use("/profile", profilFilter);

export default app;