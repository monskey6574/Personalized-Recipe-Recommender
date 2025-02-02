import { Request, Response } from 'express';
import { connectToDatabase, sql } from '../config/db';

// Recipe endpoint
export const getRecipe = async (req: Request, res: Response) => {
    const { ingredients, healthCondition } = req.body;

    try {
        const pool = await connectToDatabase();  // Get the connection pool
        
        // Build the SQL query dynamically based on the ingredients and health condition
        const query = `
            SELECT * FROM Recipes
            WHERE ingredients LIKE '%${ingredients.join("%' OR ingredients LIKE '%")}%' 
            AND health_labels LIKE '%${healthCondition}%'
        `;

        // Query the database
        const result = await pool.request().query(query);

        // Return the result as JSON
        res.json({ recipes: result.recordset });
    } catch (err) {
        console.error('❌ Error in fetching recipes:', err);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
};
