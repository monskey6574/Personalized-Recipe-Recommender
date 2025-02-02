import express from "express";
import { getRecipe } from "../applications/recipeController";

export const recipeRoutes = express.Router();

recipeRoutes.post("/get-recipe", getRecipe);

