import express, { Application } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connectToDatabase } from './config/db';
import {userRoute} from './api/user'

import loadRecipes from './utils/csvLoader';

dotenv.config();
connectToDatabase();


const app = express();
app.use(express.json());
// Middleware
app.use(bodyParser.json());


app.use('/signup',userRoute)

const PORT: number = parseInt(process.env.PORT || '3000');
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




