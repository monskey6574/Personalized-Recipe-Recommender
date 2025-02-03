import { SearchClient, AzureKeyCredential } from "@azure/search-documents";
import dotenv from 'dotenv';

dotenv.config();

// Define the interface for a recipe document
interface Recipe {
  name: string;
  ingredients: string;
  health_labels: string;
}

// Get Azure Search Service details from environment variables
const searchEndpoint = process.env.SEARCH_ENDPOINT;
const apiKey = process.env.SEARCH_API_KEY || "";
const indexName = process.env.INDEX_NAME || "";

// Initialize the Azure Search client
if (!searchEndpoint) {
  throw new Error("SEARCH_ENDPOINT is not defined in the environment variables");
}
const searchClient = new SearchClient(searchEndpoint, indexName, new AzureKeyCredential(apiKey));
if (!indexName) {
  throw new Error("INDEX_NAME is not defined in the environment variables");
}

// Function to search for recipes based on ingredients and health conditions
export const searchRecipes = async (ingredients: string[], healthPreferences: string[]) => {
  try {
    // Construct a query for ingredients and health condition
    const ingredientsQuery = ingredients.map(ingredient => `"${ingredient}"`).join(" AND "); // AND ensures exact matching

    const healthQuery = healthPreferences.map(label => `"${label}"`).join(" OR "); // OR for flexible health label matching

    // Construct the final search query
    const searchQuery = `ingredients:(${ingredientsQuery}) AND health_labels:(${healthQuery})`;

    // Query Azure Cognitive Search
    const results = await searchClient.search(searchQuery, {
      includeTotalCount: true,
      searchFields: ["name", "ingredients", "health_labels"], // Search in relevant fields
      queryType: "full", // Allow more flexible search
    });

    // Filter out results where extra ingredients exist that the user did not enter
    const documents: Recipe[] = [];
    for await (const result of results.results) {
      const recipe = result.document as Recipe;

      // Check if the recipe only contains the exact ingredients entered by the user
      const recipeIngredients: string[] = recipe.ingredients.split(',').map((ingredient: string) => ingredient.trim().toLowerCase());
      const enteredIngredients = ingredients.map(ingredient => ingredient.toLowerCase());

      // Ensure all entered ingredients match exactly with the recipe's ingredients
      const isExactMatch = enteredIngredients.every(ingredient => recipeIngredients.includes(ingredient)) &&
                            recipeIngredients.length === enteredIngredients.length;

      if (isExactMatch) {
        documents.push(recipe);
      }
    }

    return documents;

  } catch (err) {
    console.error("❌ Error fetching recipes:", err);
    throw new Error("Failed to fetch recipes from Azure Search");
  }
};
