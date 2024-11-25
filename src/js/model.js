/**
 * @module Model
 * @description This module represents the Model in the MVC architecture.
 * It manages application data, interacts with APIs, and maintains the application state.
 * This module is exported to the Controller for further interaction with the View.
 * @author Youssef Gaafar
 */

import { async } from 'regenerator-runtime';
import { API_KEY, API_URL, RESULTS_PER_PAGE } from './config.js';
import { AJAXRequest } from './helpers.js';

// This object will be exported mainly to the Controller component
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [], // Holds all of the search query results of a given query (recipe)
    page: 1,
    resutlsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [], // Holda all of the user's desired bookmarked recipes
};

/**
 * Transforms raw API recipe data into a standardized format for the application.
 * @param {Object} data - The raw data received from the API.
 * @returns {Object} The formatted recipe object with properties like title, publisher, ingredients, etc.
 * Includes an API key if available.
 */
const createRecipeObject = function (data) {
  const { recipe: receivedRecipe } = data.data; // Refactoring the received recipe object
  return {
    id: receivedRecipe.id,
    title: receivedRecipe.title,
    publisher: receivedRecipe.publisher,
    sourceUrl: receivedRecipe.source_url,
    image: receivedRecipe.image_url,
    servings: receivedRecipe.servings,
    cookingTime: receivedRecipe.cooking_time,
    ingredients: receivedRecipe.ingredients,
    ...(receivedRecipe.key && { key: receivedRecipe.key }),
  };
};

/**
 * Loads a recipe by its unique ID and updates the application state.
 * @async
 * @param {string} id - The unique ID of the recipe to load.
 * @returns {Promise<void>} Updates the state.recipe object with the loaded recipe.
 * @throws Will throw an error if the API request fails.
 * @description Fetches a single recipe by its ID, parses it, and stores it in the application state.
 * Marks the recipe as bookmarked if it's already bookmarked by the user.
 */
export const loadRecipe = async function (id) {
  try {
    const data = await AJAXRequest(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    // Temporary Error Handling
    console.error(`${error} 💣💣💣💣`);
    throw error; // So in the model, we will not handle the errors, we will throw it to be handled in the Controller
  }
};

/**
 * Fetches and loads search results for a given query into the application state.
 * @async
 * @param {string} query - The search query (e.g., "pizza", "pasta").
 * @returns {Promise<void>} Updates the state.search.results with the retrieved recipes.
 * @throws Will throw an error if the API request fails.
 * @description Sends a search request to the API, processes the results, and stores them in the application state.
 * Resets the pagination to the first page for a new search query.
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;

    const data = await AJAXRequest(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1; // We will reset the state.search.page for each search query to start from page 1
  } catch (error) {
    console.error(`${error} 💣💣💣💣`);
    throw error; // So in the model, we will not handle the errors, we will throw it to be handled in the Controller
  }
};

/**
 * Retrieves a paginated subset of search results.
 * @param {number} [page=state.search.page] - The desired page number to retrieve.
 * @returns {Array} An array of recipes for the specified page.
 * @description This function slices the search results into manageable chunks for pagination.
 * The results are divided based on the current page and the predefined results per page.
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resutlsPerPage; // 0;
  const end = page * state.search.resutlsPerPage; // 9;

  return state.search.results.slice(start, end);
};

/**
 * Updates the servings and ingredient quantities in the currently loaded recipe.
 * @param {number} newServings - The new number of servings to update.
 * @description Recalculates the ingredient quantities based on the new number of servings.
 * The new quantities are calculated proportionally to the old quantities.
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    // Formula: newQ = oldQt * newServings / oldServings
    ing.quantity = ing.quantity * (newServings / state.recipe.servings);
  });
  // Updating the servings in the state as well
  state.recipe.servings = newServings;
};

/**
 * Saves the current bookmarks to localStorage for persistence.
 */
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/**
 * Adds a recipe to the bookmarks list and updates localStorage.
 * @param {Object} recipe - The recipe object to bookmark.
 * @description Marks the current recipe as bookmarked and stores it in the bookmarks array.
 * Updates localStorage to persist the bookmarks across sessions.
 */
export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);

  // Marking the currently displayed recipe as bookmark, by setting a bookmarked flag indicating this currently displayed recipe is bookrmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

/**
 * Removes a recipe from the bookmarks list and updates localStorage.
 * @param {string} id - The unique ID of the recipe to remove.
 * @description Finds the recipe by ID in the bookmarks array and removes it.
 * If the removed recipe is currently displayed, it is marked as not bookmarked.
 */
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id); // Gets the bookmark with the specified id and remove it using splice
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false; // Remarking the removed Recipe as not bookmarked

  persistBookmarks();
};

/**
 * Uploads a new recipe to the API and bookmarks it.
 * @async
 * @param {Object} newRecipe - The recipe object to upload.
 * @returns {Promise<void>} Updates the state with the newly uploaded recipe.
 * @throws Will throw an error if the recipe format is invalid or the API request fails.
 * @description Formats the recipe data, validates it, and sends it to the API.
 * After successful upload, the recipe is bookmarked and stored in the application state.
 */
export const uploadRecipe = async function (newRecipe) {
  try {
    // Extracting and transforming the ingredients from the newRecipe object:
    const ingredients = Object.entries(newRecipe) // 1. Convert the newRecipe object into an array of [key, value] pairs using Object.entries().
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '') // 2. Filter out entries that do not start with 'ingredient' or have an empty value.
      .map(ing => {
        // 3. Check if the received Ingredient is of length 3 after splitting on comma.
        // 4. Map over the filtered entries to transform each ingredient string into an object with quantity, unit, and description properties.
        // 5. Split each ingredient string by commas after removing spaces to separate quantity, unit, and description.
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format, EX: (0.5,Kg,Rice)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAXRequest(`${API_URL}?key=${API_KEY}`, recipe); // Object { status: "success", data: {…} }
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

// const clearBookmarks = function () {
//   localStorage.removeItem('bookmarks');
// };
// clearBookmarks(); // Used for debugging

// const deleteRecipe = async function (id) {
//   const res = await fetch(`${API_URL}${id}?key=${API_KEY}`, {
//     method: 'DELETE',
//   });
// };
// deleteRecipe('65577bbaa239dd001459371d'); // Used for debugging

/**
 * Initializes the application state by loading stored bookmarks from localStorage.
 * @description Retrieves the bookmarks from localStorage, parses them, and updates the state.
 * Ensures that bookmarks persist across browser sessions.
 */
const initStorage = function () {
  const storedBookmarks = localStorage.getItem('bookmarks'); // Loading the items stored in the bookmarks
  if (storedBookmarks) state.bookmarks = JSON.parse(storedBookmarks);
};
initStorage();
