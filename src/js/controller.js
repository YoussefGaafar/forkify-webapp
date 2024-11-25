/**
 * @module Controller
 * @description This is the controller module in the MVC architecture. It acts as a bridge between the model and view modules.
 * It handles all the application logic, processes user interactions, and updates the view accordingly.
 * @requires core-js/stable
 * @requires regenerator-runtime/runtime
 * @requires ./model.js
 * @requires ./config.js
 * @requires ./views/recipeView.js
 * @requires ./views/searchView.js
 * @requires ./views/resultsView.js
 * @requires ./views/paginationView.js
 * @requires ./views/bookmarksView.js
 * @requires ./views/addRecipeView.js
 * @author Youssef Gaafar
 */

import { async } from 'regenerator-runtime';

// MVCs Imports
import * as model from './model.js'; // This is the model component that has model.state obj, model.loadRecipe() method, etc.
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

///////////////////////////////////////

/**
 * Handles loading and rendering of a recipe based on the hash in the URL.
 * @async
 * @function controlRecipes
 * @description This function is triggered when the user navigates to a recipe (via URL hash change).
 * It retrieves the recipe data, updates relevant views, and handles loading indicators and error messages.
 * The Controller's controlRecipes function `Subscribes` to these events. It gets triggered whenever the events are emitted, allowing it to handle the application logic (e.g., fetching and rendering the recipe).
 * @throws Will render an error message if the recipe cannot be fetched.
 */
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id); // 5ed6604591c37cdc054bc886
    if (!id) return; // Guard Clause

    recipeView.renderSpinner(); // Rendering the Loading Spinner

    resultsView.update(model.getSearchResultsPage()); // Updating resultsView to mark the selected search result
    bookmarksView.update(model.state.bookmarks); // Updating the bookmarked recipe to be highlighted when it appears in the search result

    await model.loadRecipe(id); // Here we are actually loading the recipe from the model component, this will modify the model.state obj

    // Rendering the Recipe to the webpage by using RecipeView class
    recipeView.render(model.state.recipe); // This method (render) will be used to initialize the private data(recipe data) variable of our recipeView object.
  } catch (error) {
    recipeView.renderError();
    console.log(error);
  }
};

/**
 * Handles search functionality: fetches search results and renders them with pagination.
 * @async
 * @function controlSearchResults
 * @description This function is triggered when the user searches for a recipe using the search bar.
 * It retrieves the search query, loads the results, and renders the first page of results with pagination buttons.
 * @throws Will log an error if the search results cannot be fetched.
 */
const controlSearchResults = async function () {
  // We don't want to have any DOM Manipulations in the Controller component, because it's handled in the Views.
  try {
    // Loading the Spinner
    resultsView.renderSpinner();

    // Retrieving the search query
    const query = searchView.getQuery();
    if (!query) return; // If the query is empty ('')

    // Loading the search results
    await model.loadSearchResults(query);

    // Rendering the Results
    // resultsView.render(model.state.search.results); // Here we will display all of the results without pagination
    resultsView.render(model.getSearchResultsPage()); // Here we will display pagination results

    // Rendering the Initial Pagination buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

/**
 * Handles pagination: renders new results and pagination buttons when a page is clicked.
 * @function controlPagination
 * @param {number} goToPage - The page number to navigate to.
 * @description This function is triggered when the user clicks a pagination button. It updates the results view with the selected page.
 */
const controlPagination = function (goToPage) {
  // Rendering the new Results after clicking the pagination buttons
  resultsView.render(model.getSearchResultsPage(goToPage)); // This will set state.search.page to goToPage and render the new recipes page

  // Rendering the New Pagination buttons
  paginationView.render(model.state.search);
};

/**
 * Handles updating of servings in the recipe.
 * @function controlServings
 * @param {number} newServings - The updated number of servings.
 * @description This function is triggered when the user increases or decreases the number of servings.
 * It updates the ingredient quantities accordingly and reflects the changes in the recipe view.
 */
const controlServings = function (newServings) {
  // (i). Updating the Recipe servings, which is found in the state Object
  model.updateServings(newServings);

  // (ii). Updating the recipeView
  // recipeView.render(model.state.recipe); // The issue in this line is we are rendering the whole recipe just for updating the servings & ingredients, which is an Overkill.

  recipeView.update(model.state.recipe); // That's why we will use update() method to update the texts and attributes in the dom to avoid re-rendering
};

/**
 * Handles adding or removing a recipe from bookmarks.
 * @function controlAddBookmark
 * @description This function is triggered when the user clicks the bookmark icon.
 * It toggles the bookmark status of the current recipe and updates the bookmarks view.
 */
const controlAddBookmark = function () {
  // (i) Adding/Removing Bookmarks
  // If the current recipe is NOT bookmarked, add it in the bookmarks array
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id); // else, delete it from the bookmarks array.

  // (ii) Updating the recipeView to fill/unfill the bookmark icon
  recipeView.update(model.state.recipe);

  // (iii) Rendering the bookmarks
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Handles rendering of bookmarks when the page is loaded or bookmarks are updated.
 * @function controlBookmarks
 * @description This function is triggered when the application is initialized or bookmarks are updated.
 * It renders the list of bookmarked recipes in the bookmarks view.
 */
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

/**
 * Handles uploading of a new recipe.
 * @async
 * @function controlAddRecipe
 * @param {Object} newRecipe - The recipe data submitted by the user.
 * @description This function is triggered when the user submits a new recipe.
 * It uploads the recipe to the API, updates the state, and renders the new recipe in the view.
 * @throws Will render an error message if the recipe upload fails.
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    // Rendering the spinner
    addRecipeView.renderSpinner();

    // Uploading a new recipe
    await model.uploadRecipe(newRecipe);

    // Rendering the created recipe
    recipeView.render(model.state.recipe);

    // Displaying a Success message
    addRecipeView.renderSuccessMessage();

    // Render again the bookmarksView
    bookmarksView.render(model.state.bookmarks);

    // Changing the hash ID in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Closing the Form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error('💣💣', error);
    addRecipeView.renderError(error.message);
    // Closing the Form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  }
};

/**
 * Initializes the application by setting up event handlers for user interactions.
 * @function init
 * @description This function sets up event listeners for various interactions (e.g., searching, pagination, adding bookmarks, etc.).
 * It connects the "Publisher" (view) with the "Subscriber" (controller logic).
 */
// -------------------------------------------------------------------------
// NOTE !!!: the init function is the central place for setting up ALL the event handlers in or application. If we have multiple handlers (e.g., for searching, rendering, pagination, updating servings, etc.), we should include all of them in the init function.
// This approach keeps our application modular, and the init function acts as the entry point where all the components are connected.
// -------------------------------------------------------------------------
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks); // Handler for Rendering the bookmarks to avoid breaking the page.
  recipeView.addHandlerRender(controlRecipes); // Handler for Rendering the Recipe
  recipeView.addHandlerUpdateServings(controlServings); // Handler for updating the ingredings per servings
  recipeView.addHandlerAddBookmark(controlAddBookmark); // Handler for adding bookmarked recipe whenever it's clicked
  searchView.addHandlerSearch(controlSearchResults); // Handler for search button
  paginationView.addHandlerClick(controlPagination); // Handler for Pagination buttons (prev/next)
  addRecipeView.addHandlerUpload(controlAddRecipe); // Handler for adding the submitted Form data (recipe)
};
init(); // Initializes the application
