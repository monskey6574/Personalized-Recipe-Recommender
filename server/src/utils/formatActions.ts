interface Recipe {
  id: string;
  name: string;
  ingredients: string;
  steps: string;
}

const formatActions = (recipes: Recipe[]) => {
  return recipes.map((recipe) => ({
      id: recipe.id,
      features: [
          { name: recipe.name },
          { ingredients: recipe.ingredients },
      ],
  }));
};

export default formatActions;
