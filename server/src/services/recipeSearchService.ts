// controllers/recipeSearchController.ts
import { SearchClient, AzureKeyCredential } from "@azure/search-documents";
import dotenv from 'dotenv';

dotenv.config();

// Get Azure Search Service details from environment variables
const searchEndpoint = process.env.SEARCH_ENDPOINT ;
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
export const searchRecipes = async (ingredients: string[], healthCondition: string) => {
  try {
    // Construct a query for ingredients and health condition
    const searchQuery = `ingredients:(${ingredients.join(' OR ')}) AND health_labels:(${healthCondition})`;

    // Query Azure Cognitive Search
    const results = await searchClient.search(searchQuery, {
      includeTotalCount: true,
      filter: `health_labels eq '${healthCondition}'`, // Optionally filter by health condition
    });

    // Return the matching recipes
    const documents = [];
    for await (const result of results.results) {
      documents.push(result.document);
    }
    return documents;
  } catch (err) {
    console.error("❌ Error fetching recipes:", err);
    throw new Error("Failed to fetch recipes from Azure Search");
  }
};
