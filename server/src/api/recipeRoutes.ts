// api/recipeApi.ts
import express from 'express';
import { getRecipes } from '../applications/recipeController'; // Import the controller

export const recipeRoutes = express.Router();

// Define route for searching recipes
recipeRoutes.post('/search', getRecipes);

