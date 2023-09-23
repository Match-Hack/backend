import express, {
    Express
} from 'express';
import cors from 'cors';

import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
/*const dbURL = process.env.DB_URL ?? "";
mongoose.connect(dbURL);

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));*/

const app: Express = express();

/*app.use(cors(
  {
    origin: ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Referer'],
  }
))*/

import poapRouter from './routes/POAP';
import newUserRouter from './routes/newUser';

app.use("/poap",poapRouter);
app.use(newUserRouter);

export default app;