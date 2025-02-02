import express, { Application } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { connectToDatabase } from './config/db';
import {userRoute} from './api/user'
import {recipeRoutes} from './api/recipeRoutes'

import loadRecipes from './utils/csvLoader';

dotenv.config();
connectToDatabase();


const app = express();
app.use(express.json());
// Middleware
app.use(bodyParser.json());


app.use('/user',userRoute)
app.use("/recipe", recipeRoutes);


const PORT: number = parseInt(process.env.PORT || '3000');
app.listen(3000, () => {  
  console.log("Server started on port 3000");
});




