// controllers/recipeSearchController.ts
import { Request, Response, RequestHandler } from 'express';
import { searchRecipes } from '../services/recipeSearchService'; // Import the search function

// Recipe search endpoint
export const getRecipes: RequestHandler = async (req: Request, res: Response, next: Function): Promise<void> => {
  const { ingredients, healthCondition } = req.body;

  if (!ingredients || !healthCondition) {
    res.status(400).json({ error: "Ingredients and health condition are required" });
    return;
  }

  try {
    // Call the searchRecipes function to get matching recipes from Azure Search
    const recipes = await searchRecipes(ingredients, healthCondition);
    
      res.status(200).json({ recipes });
    } catch (err) {
      console.error("Error fetching recipes:", err);
      res.status(500).json({ error: 'Failed to fetch recipes' });
    }
  }

