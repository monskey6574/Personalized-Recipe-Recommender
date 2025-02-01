// # Function to load recipes from a CSV 

import fs from 'fs';
import csvParser from 'csv-parser';

interface Recipe {
    id: string;
    name: string;
    ingredients: string;
    steps: string;
}

const loadRecipes = (csvPath: string): Recipe[] => {
    const recipes: Recipe[] = [];
    fs.createReadStream(csvPath)
        .pipe(csvParser())
        .on('data', (row) => {
            recipes.push({
                id: row.id,
                name: row.name,
                ingredients: row.ingredients,
                steps: row.steps,
            });
        });
    return recipes;
};

export default loadRecipes;
