import React, { Component } from 'react';
import './form.css';
import Button from '../button/Button';

export default class RecipeRecommendation extends Component {
  constructor(props) {
    super(props);
    this.sliderRef = React.createRef();
  }

  state = {
    ingredients: [],
    errors: {},
    currentIngredient: '',
    healthPreferences: '',
    recipeResults: [],
  };

  componentDidMount() {
    const slider = this.sliderRef.current;
    if (slider) {
      slider.addEventListener('input', () => {
        const value = slider.value;
        const max = slider.max;
        const progress = (value / max) * 100;
        slider.style.setProperty('--slider-progress', `${progress}%`);
      });
    }
  }

  componentWillUnmount() {
    const slider = this.sliderRef.current;
    if (slider) {
      slider.removeEventListener('input', this.handleSliderInput);
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleIngredientChange = (e) => {
    this.setState({ currentIngredient: e.target.value });
  };

  addIngredient = () => {
    const { currentIngredient, ingredients } = this.state;
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      this.setState({
        ingredients: [...ingredients, currentIngredient.trim()],
        currentIngredient: '',
      });
    }
  };

  removeIngredient = (ingredient) => {
    this.setState({
      ingredients: this.state.ingredients.filter((item) => item !== ingredient),
    });
  };

  toggleHealthPreference = (preference) => {
    this.setState((prevState) => {
      const { healthPreferences } = prevState;
      return {
        healthPreferences: healthPreferences.includes(preference)
          ? healthPreferences.filter((item) => item !== preference)
          : [...healthPreferences, preference],
      };
    });
  };



  handleSubmit = async (e) => {
    e.preventDefault();
    const errors = this.validateForm();
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }
  
    const { ingredients, healthPreferences } = this.state;
  
    try {
      const response = await fetch("http://localhost:5000/recipe/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: ingredients,
          healthPreferences: healthPreferences,
        }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response Error:", errorText);
        alert(`Error: ${errorText}`);
        return;
      }
  
      const data = await response.json();
      console.log("Recipe Recommendations:", data);
  
      // Ensure ingredients are converted to an array if they are a string
      const recipes = data.recipes.map((recipe) => {
        return {
          ...recipe,
          ingredients: recipe.ingredients.split(',').map(ingredient => ingredient.trim())
        };
      });
  
      this.setState({ recipeResults: recipes });
      alert("Recipe recommendations fetched successfully!");
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("There was an error while fetching recipe recommendations.");
    }
  
    console.log('Ingredients:', ingredients);
    console.log('Health Preferences:', healthPreferences);
  };
  
  
  validateForm = () => {
    const errors = {};
    if (this.state.ingredients.length === 0) {
      errors.ingredients = "At least one ingredient is required.";
    }
    return errors;
  };
  

  render() {
    const { ingredients, errors, currentIngredient, healthPreferences, recipeResults } = this.state;
    const healthOptions = ["Vegetarian", "vegan", "gluten free", "low carb", "Keto", "Dairy-Free", "Nut-Free" , "high protein"];

    return (
      <section className="recipe-recommendation">
        <div className="recipe-content">
          <h2 className="recipe-title">Get Personalized Recipe Recommendations</h2>
          <p className="recipe-description">
            Tell us what ingredients you have, and we'll suggest delicious recipes tailored to your preferences.
          </p>

          <div className="recipe-form">
            {/* Ingredients Input Section */}
            <div className="form-group">
              <label className="form-label">Ingredients</label>
              <div className="ingredients-input">
                <input
                  type="text"
                  name="currentIngredient"
                  value={currentIngredient}
                  onChange={this.handleIngredientChange}
                  placeholder="Enter an ingredient (e.g., chicken, tomatoes)"
                  className="ingredient-field"
                />
                <Button type="button" variant="secondary" onClick={this.addIngredient}>
                  Add
                </Button>
              </div>
              <div className="ingredients-tags">
                {ingredients.map((ingredient, index) => (
                  <span key={index} className="ingredient-tag">
                    {ingredient}
                    <button type="button" onClick={() => this.removeIngredient(ingredient)}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
              {errors.ingredients && <span className="error-message">{errors.ingredients}</span>}
            </div>

            {/* Health Preferences Section */}
            <div className="form-group">
              <label className="form-label">Health Preferences</label>
              <div className="health-options">
                {healthOptions.map((option) => (
                  <Button
                    key={option}
                    type="button"
                    variant={healthPreferences.includes(option) ? "primary" : "outline"}
                    onClick={() => this.toggleHealthPreference(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <Button type="submit" variant="primary" onClick={this.handleSubmit}>
                Get Recipes
              </Button>
            </div>
          </div>

          {/* Recipe Results Section */}
          <div className="recipe-results">
            {recipeResults.length > 0 ? (
              <div className="recipe-cards">
                {recipeResults.map((recipe, index) => (
                  <div key={index} className="recipe-card">
                    <h3>{recipe.name}</h3>
                    <p>{recipe.description}</p>
                    <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
                    <p><strong>Instructions:</strong> {recipe.instructions}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No recipes found. Please try again.</p>
            )}
          </div>
        </div>
      </section>
    );
  }
}
